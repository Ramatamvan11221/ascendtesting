"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Send, Loader2, Image, Paperclip, MoreVertical, Hash, Trash2, X } from "lucide-react";
import Pusher from "pusher-js";

const STYLES = `
  .cr-wrap{display:flex;flex-direction:column;height:100%;background:var(--bg-primary);}
  .cr-header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid var(--border-subtle);background:var(--bg-secondary);backdrop-filter:blur(12px);flex-shrink:0;min-height:48px;}
  @media(min-width:480px){.cr-header{padding:12px 20px;min-height:52px;}}
  .cr-header-left{display:flex;align-items:center;gap:8px;min-width:0;}
  @media(min-width:480px){.cr-header-left{gap:10px;}}
  .cr-header-icon{color:var(--text-secondary);flex-shrink:0;}
  .cr-header-name{font-size:14px;font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  @media(min-width:480px){.cr-header-name{font-size:15px;}}
  .cr-header-desc{font-size:10px;color:var(--text-muted);transition:color 0.3s;}
  @media(min-width:480px){.cr-header-desc{font-size:11px;}}
  .cr-header-desc.typing{color:var(--green);}
  .typing-dots{display:inline-flex;gap:2px;margin-left:2px;}
  .typing-dots span{width:3px;height:3px;border-radius:50%;background:var(--green);animation:typingBounce 1.4s infinite ease-in-out;}
  .typing-dots span:nth-child(1){animation-delay:0s;}.typing-dots span:nth-child(2){animation-delay:0.2s;}.typing-dots span:nth-child(3){animation-delay:0.4s;}
  @keyframes typingBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-4px)}}

  .cr-messages{flex:1;overflow-y:auto;padding:12px 14px;display:flex;flex-direction:column;gap:4px;}
  @media(min-width:480px){.cr-messages{padding:16px 20px;}}
  .cr-messages::-webkit-scrollbar{width:3px;}
  .cr-messages::-webkit-scrollbar-thumb{background:var(--border-medium);border-radius:2px;}
  .msg-group{display:flex;gap:8px;margin-bottom:14px;animation:msgIn 0.25s ease-out;cursor:pointer;padding:3px 4px;border-radius:10px;transition:background 0.2s;}
  @media(min-width:480px){.msg-group{gap:10px;margin-bottom:16px;padding:4px 6px;border-radius:12px;}}
  .msg-group:hover{background:var(--border-subtle);}
  @keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .msg-group.me{flex-direction:row-reverse;}
  .msg-avatar{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;flex-shrink:0;background:rgba(245,158,11,0.1);color:var(--amber);margin-top:2px;}
  @media(min-width:480px){.msg-avatar{width:36px;height:36px;font-size:14px;margin-top:4px;}}
  .msg-avatar.other{background:rgba(99,102,241,0.1);color:#818cf8;}
  .msg-content{max-width:75%;}
  @media(min-width:480px){.msg-content{max-width:65%;}}
  .msg-sender{font-size:10px;font-weight:600;color:var(--amber);margin-bottom:1px;}
  @media(min-width:480px){.msg-sender{font-size:11px;margin-bottom:2px;}}
  .msg-sender.other{color:#818cf8;}
  .msg-bubble{padding:8px 12px;border-radius:14px;font-size:12px;line-height:1.5;color:var(--text-primary);word-wrap:break-word;width:fit-content;max-width:100%;}
  @media(min-width:480px){.msg-bubble{padding:10px 14px;border-radius:16px;font-size:13px;}}
  .msg-bubble.me{background:linear-gradient(135deg,var(--amber),var(--orange));color:var(--text-inverse);border-bottom-right-radius:4px;margin-left:auto;}
  .msg-bubble.other{background:var(--bg-card);border:1px solid var(--border-subtle);border-bottom-left-radius:4px;}
  .msg-bubble.deleted{background:var(--bg-input)!important;color:var(--text-muted)!important;font-style:italic;border:1px dashed var(--border-subtle)!important;}
  .msg-time{font-size:9px;color:var(--text-muted);margin-top:2px;}
  @media(min-width:480px){.msg-time{font-size:10px;margin-top:3px;}}
  .msg-time.me{text-align:right;}

  .cr-input-area{padding:10px 14px;border-top:1px solid var(--border-subtle);flex-shrink:0;}
  @media(min-width:480px){.cr-input-area{padding:12px 20px;}}
  .cr-input-row{display:flex;align-items:center;gap:6px;}
  @media(min-width:480px){.cr-input-row{gap:8px;}}
  .cr-input{flex:1;padding:9px 12px;border-radius:10px;border:1px solid var(--border-medium);background:var(--bg-input);color:var(--text-primary);font-size:12px;font-family:'Inter',sans-serif;outline:none;resize:none;max-height:80px;}
  @media(min-width:480px){.cr-input{padding:10px 16px;border-radius:12px;font-size:13px;max-height:100px;}}
  .cr-input:focus{border-color:rgba(245,158,11,0.3);}
  .cr-input::placeholder{color:var(--text-muted);opacity:0.5;}
  .input-btn{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s ease;background:var(--bg-input);border:1px solid var(--border-medium);color:var(--text-muted);}
  @media(min-width:480px){.input-btn{width:38px;height:38px;border-radius:10px;}}
  .input-btn:hover{color:var(--amber);border-color:rgba(245,158,11,0.2);}
  .send-btn{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;background:linear-gradient(135deg,var(--amber),var(--orange));color:var(--text-inverse);transition:all 0.3s ease;}
  @media(min-width:480px){.send-btn{width:40px;height:40px;border-radius:12px;}}
  .send-btn:hover{transform:scale(1.05);}
  .send-btn:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
  .empty-chat{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-muted);gap:6px;padding:20px;}
  @keyframes spin{to{transform:rotate(360deg)}}
  .spinner{width:16px;height:16px;border:2px solid rgba(0,0,0,0.3);border-top-color:var(--text-inverse);border-radius:50%;animation:spin 0.6s linear infinite;}
  @media(min-width:480px){.spinner{width:18px;height:18px;}}
  .msg-image{max-width:200px;border-radius:10px;cursor:pointer;display:block;transition:transform 0.2s;}
  @media(min-width:480px){.msg-image{max-width:280px;border-radius:12px;}}
  .msg-image:hover{transform:scale(1.02);}
  .msg-file{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:10px;background:rgba(255,255,255,0.05);text-decoration:none;width:fit-content;transition:all 0.2s;}
  @media(min-width:480px){.msg-file{padding:10px 14px;border-radius:12px;}}
  .msg-file:hover{background:rgba(255,255,255,0.08);}
  .msg-file-name{font-size:11px;color:var(--text-primary);}
  @media(min-width:480px){.msg-file-name{font-size:12px;}}
  .msg-file-size{font-size:9px;color:var(--text-muted);}
  @media(min-width:480px){.msg-file-size{font-size:10px;}}
`;

interface Message {
  id: string; content: string; type: string; 
  fileUrl?: string; fileName?: string; fileSize?: string; 
  createdAt: string; deleted?: boolean;
  user: { id: string; name: string; image: string | null };
}

export function ChatRoom({ roomId, roomName, currentUserId, currentUserName }: {
  roomId: string; roomName: string; currentUserId: string; currentUserName: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [onlineCount] = useState(3);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; messageIds: string[]; allMine: boolean } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingEmitRef = useRef<number>(0);

  const [deletedForMe, setDeletedForMe] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      try { const stored = localStorage.getItem(`deleted-${roomId}`); return stored ? new Set(JSON.parse(stored)) : new Set(); }
      catch { return new Set(); }
    }
    return new Set();
  });

  useEffect(() => {
    fetch(`/api/rooms/${roomId}/chat`)
      .then((r) => r.json())
      .then((d) => { 
        const msgs = Array.isArray(d) ? d.filter((m: Message) => !deletedForMe.has(m.id)).map((m: Message) => ({ ...m, deleted: m.content === "This message was deleted" })) : [];
        setMessages(msgs); setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, [roomId]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!, authEndpoint: "/api/pusher/auth" });
    const ch = pusher.subscribe(`room-${roomId}`);
    ch.bind("new-message", (msg: Message) => setMessages((prev) => prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
    ch.bind("message-deleted", (data: { messageId: string }) => setMessages((prev) => prev.map((m) => m.id === data.messageId ? { ...m, deleted: true, content: "This message was deleted" } : m)));
    ch.bind("user-typing", (data: { userId: string; userName: string }) => {
      if (data.userId === currentUserId) return;
      setTypingUsers((prev) => prev.includes(data.userName) ? prev : [...prev, data.userName]);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setTypingUsers([]), 2500);
    });
    return () => { ch.unbind_all(); ch.unsubscribe(); pusher.disconnect(); };
  }, [roomId, currentUserId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const emitTyping = () => {
    const now = Date.now();
    if (now - typingEmitRef.current < 2000) return;
    typingEmitRef.current = now;
    fetch(`/api/rooms/${roomId}/typing`, { method: "POST" }).catch(() => {});
  };

  const sendMessage = async (content: string, type = "text", fileData?: { url?: string; name?: string; size?: string }) => {
    if (!content.trim() && type === "text") return;
    setSending(true);
    try {
      await fetch(`/api/rooms/${roomId}/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: content.trim(), type, fileUrl: fileData?.url || null, fileName: fileData?.name || null, fileSize: fileData?.size || null }) });
      setInput("");
    } catch { toast.error("Failed to send"); }
    setSending(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("File too large. Max 10MB."); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const up = await fetch("/api/upload", { method: "POST", body: fd });
      const upData = await up.json();
      if (!up.ok) throw new Error("Upload failed");
      const isImg = file.type.startsWith("image/");
      await sendMessage(isImg ? `📷 ${file.name}` : `📎 ${file.name}`, "file", { url: upData.url, name: file.name, size: upData.size });
      setUploading(false);
    } catch { toast.error("Upload failed"); setUploading(false); }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const deleteMessages = async (scope: "me" | "everyone") => {
    if (!contextMenu) return;
    const ids = contextMenu.messageIds;
    try {
      if (scope === "everyone") {
        await fetch(`/api/rooms/${roomId}/chat/delete`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messageIds: ids }) });
        setMessages((prev) => prev.map((m) => ids.includes(m.id) ? { ...m, deleted: true, content: "This message was deleted" } : m));
      } else {
        const newDeleted = new Set([...deletedForMe, ...ids]);
        setDeletedForMe(newDeleted);
        localStorage.setItem(`deleted-${roomId}`, JSON.stringify([...newDeleted]));
        setMessages((prev) => prev.filter((m) => !ids.includes(m.id)));
      }
      setContextMenu(null);
      toast.success(scope === "everyone" ? "Deleted for everyone" : "Deleted for you");
    } catch { toast.error("Failed to delete"); }
  };

  const formatTime = (d: string) => new Date(d).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  const groupedMessages = messages.reduce((acc, msg) => {
    const last = acc[acc.length - 1];
    if (last && last[0]?.user.id === msg.user.id) { last.push(msg); } else { acc.push([msg]); }
    return acc;
  }, [] as Message[][]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="cr-wrap" style={{ position: "relative" }}>
        {contextMenu && (
          <>
            <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => setContextMenu(null)} />
            <div style={{ position: "fixed", left: Math.min(contextMenu.x, typeof window !== "undefined" ? window.innerWidth - 190 : 190), top: Math.min(contextMenu.y, typeof window !== "undefined" ? window.innerHeight - 140 : 140), zIndex: 100, background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: "12px", padding: "4px", backdropFilter: "blur(20px)", minWidth: "170px", boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>
              {contextMenu.allMine && (
                <button onClick={() => deleteMessages("everyone")} style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 12px", borderRadius: "8px", border: "none", background: "none", color: "var(--red)", cursor: "pointer", fontSize: "12px", fontFamily: "'Inter', sans-serif" }}><Trash2 size={14} /> Delete for everyone</button>
              )}
              <button onClick={() => deleteMessages("me")} style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 12px", borderRadius: "8px", border: "none", background: "none", color: "var(--text-primary)", cursor: "pointer", fontSize: "12px", fontFamily: "'Inter', sans-serif" }}><Trash2 size={14} /> Delete for me</button>
              <div style={{ height: "1px", background: "var(--border-subtle)", margin: "2px 6px" }} />
              <button onClick={() => setContextMenu(null)} style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 12px", borderRadius: "8px", border: "none", background: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "12px", fontFamily: "'Inter', sans-serif" }}><X size={14} /> Cancel</button>
            </div>
          </>
        )}

        <div className="cr-header">
          <div className="cr-header-left">
            <Hash size={16} className="cr-header-icon" />
            <div style={{ minWidth: 0 }}>
              <p className="cr-header-name">{roomName}</p>
              <p className={`cr-header-desc ${typingUsers.length > 0 ? "typing" : ""}`}>
                {typingUsers.length > 0 ? <>{typingUsers.join(", ")} typing<span className="typing-dots"><span /><span /><span /></span></> : `${onlineCount} online`}
              </p>
            </div>
          </div>
          <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}><MoreVertical size={16} /></button>
        </div>

        {loading ? (
          <div className="empty-chat"><Loader2 size={22} className="spinner" style={{ borderTopColor: "var(--amber)", borderColor: "rgba(255,255,255,0.1)" }} /></div>
        ) : messages.length === 0 ? (
          <div className="empty-chat"><span style={{ fontSize: "40px", opacity: 0.25 }}>💬</span><p style={{ fontSize: "14px", fontWeight: 500 }}>No messages yet</p><p style={{ fontSize: "11px" }}>Start the conversation!</p></div>
        ) : (
          <div className="cr-messages" onClick={() => contextMenu && setContextMenu(null)}>
            {groupedMessages.map((group, gi) => {
              const first = group[0], isMe = first.user.id === currentUserId;
              return (
                <div key={gi} className={`msg-group ${isMe ? "me" : ""}`}
                  onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, messageIds: group.map((m) => m.id), allMine: group.every((m) => m.user.id === currentUserId) }); }}>
                  {!isMe && <div className="msg-avatar other">{first.user.name?.charAt(0) || "?"}</div>}
                  <div className="msg-content">
                    {!isMe && <p className="msg-sender other">{first.user.name}</p>}
                    {group.map((msg) => (
                      <div key={msg.id}>
                        {msg.fileUrl && (msg.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)/i) || msg.fileUrl.includes("ibb.co")) ? (
                          <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer"><img src={msg.fileUrl} alt={msg.fileName || "Image"} className="msg-image" /></a>
                        ) : msg.fileUrl ? (
                          <a href={msg.fileUrl} download={msg.fileName} className="msg-file" target="_blank" rel="noopener noreferrer">
                            <Paperclip size={14} style={{ color: "var(--amber)" }} /><div><p className="msg-file-name">{msg.fileName}</p><p className="msg-file-size">{msg.fileSize}</p></div>
                          </a>
                        ) : (
                          <div className={`msg-bubble ${isMe ? "me" : "other"} ${msg.deleted ? "deleted" : ""}`}>{msg.content}</div>
                        )}
                        <p className={`msg-time ${isMe ? "me" : ""}`}>{formatTime(msg.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                  {isMe && <div className="msg-avatar">{currentUserName?.charAt(0) || "Y"}</div>}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="cr-input-area">
          <div className="cr-input-row">
            <button className="input-btn" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 size={14} style={{ borderTopColor: "var(--amber)", animation: "spin 0.6s linear infinite" }} /> : <Image size={14} />}
            </button>
            <button className="input-btn" onClick={() => fileInputRef.current?.click()}><Paperclip size={14} /></button>
            <input ref={fileInputRef} type="file" onChange={handleFileUpload} style={{ display: "none" }} accept="image/*,.pdf,.doc,.docx,.txt,.zip" />
            <textarea className="cr-input" placeholder={`Message #${roomName}`} value={input}
              onChange={(e) => { setInput(e.target.value); emitTyping(); }}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }} rows={1} />
            <button className="send-btn" onClick={() => sendMessage(input)} disabled={sending || !input.trim()}>
              {sending ? <span className="spinner" /> : <Send size={14} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}