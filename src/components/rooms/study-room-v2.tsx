"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Timer, Coffee, Zap, ChevronLeft, ChevronRight, LogIn, LogOut, BookOpen, Users } from "lucide-react";
import Pusher from "pusher-js";

const STYLES = `
  .sr-wrap{display:flex;flex-direction:column;height:100%;background:#0a0f18;}
  .sr-header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.04);background:rgba(10,15,24,0.8);backdrop-filter:blur(12px);flex-shrink:0;flex-wrap:wrap;gap:10px;}
  @media(min-width:480px){.sr-header{padding:14px 24px;}}
  .sr-header-left{display:flex;align-items:center;gap:10px;min-width:0;}
  .sr-header-icon{color:#f59e0b;flex-shrink:0;}
  .sr-header-name{font-size:14px;font-weight:600;color:#edeff2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  @media(min-width:480px){.sr-header-name{font-size:16px;}}
  .sr-header-count{font-size:11px;color:#5a6478;}
  @media(min-width:480px){.sr-header-count{font-size:12px;}}
  .sr-header-right{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}

  .join-btn{padding:8px 16px;border-radius:10px;font-size:12px;font-weight:600;border:none;cursor:pointer;font-family:'Inter',sans-serif;background:linear-gradient(135deg,#10b981,#059669);color:#fff;display:flex;align-items:center;gap:6px;box-shadow:0 6px 18px -6px rgba(16,185,129,0.25);transition:all 0.3s ease;white-space:nowrap;}
  @media(min-width:480px){.join-btn{padding:9px 20px;border-radius:12px;font-size:13px;}}
  .join-btn:hover{transform:scale(1.03);}
  .join-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
  .leave-btn{padding:8px 16px;border-radius:10px;font-size:12px;font-weight:600;border:1px solid rgba(239,68,68,0.2);cursor:pointer;font-family:'Inter',sans-serif;background:rgba(239,68,68,0.08);color:#ef4444;display:flex;align-items:center;gap:6px;transition:all 0.3s ease;white-space:nowrap;}
  @media(min-width:480px){.leave-btn{padding:9px 20px;border-radius:12px;font-size:13px;}}
  .leave-btn:hover{background:rgba(239,68,68,0.16);}
  .leave-btn:disabled{opacity:0.5;cursor:not-allowed;}

  .mode-selector{display:flex;gap:4px;}
  @media(min-width:480px){.mode-selector{gap:6px;}}
  .mode-btn{padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);color:#5a6478;cursor:pointer;font-size:11px;font-weight:500;transition:all 0.2s ease;display:flex;align-items:center;gap:4px;font-family:'Inter',sans-serif;white-space:nowrap;}
  @media(min-width:480px){.mode-btn{padding:7px 14px;border-radius:10px;font-size:12px;}}
  .mode-btn:hover{border-color:rgba(245,158,11,0.3);color:#9aa4b8;}
  .mode-btn.active-focus{border-color:rgba(16,185,129,0.5);background:rgba(16,185,129,0.08);color:#10b981;}
  .mode-btn.active-idle{border-color:rgba(245,158,11,0.5);background:rgba(245,158,11,0.08);color:#f59e0b;}
  .mode-btn.active-rest{border-color:rgba(99,102,241,0.5);background:rgba(99,102,241,0.08);color:#818cf8;}

  .notes-input{padding:7px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);color:#edeff2;font-size:11px;width:140px;outline:none;font-family:'Inter',sans-serif;}
  @media(min-width:480px){.notes-input{padding:8px 14px;border-radius:10px;font-size:12px;width:180px;}}
  .notes-input:focus{border-color:rgba(245,158,11,0.3);}
  .notes-input::placeholder{color:#3a4458;}

  .sr-grid-area{flex:1;overflow-y:auto;padding:16px 12px;}
  @media(min-width:480px){.sr-grid-area{padding:24px;}}
  .sr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;max-width:1000px;margin:0 auto;}
  @media(min-width:480px){.sr-grid{grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;}}
  @media(min-width:768px){.sr-grid{grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;}}

  .p-card{padding:18px 12px;border-radius:16px;text-align:center;border:2px solid rgba(255,255,255,0.04);transition:all 0.3s ease;background:rgba(15,20,30,0.5);backdrop-filter:blur(10px);display:flex;flex-direction:column;align-items:center;gap:8px;}
  @media(min-width:480px){.p-card{padding:22px 16px;border-radius:18px;gap:10px;}}
  @media(min-width:768px){.p-card{padding:24px 18px;border-radius:20px;}}
  .p-card:hover{border-color:rgba(255,255,255,0.08);}
  .p-card.focus{border-color:rgba(16,185,129,0.4);background:rgba(16,185,129,0.03);}
  .p-card.idle{border-color:rgba(245,158,11,0.3);background:rgba(245,158,11,0.02);}
  .p-card.rest{border-color:rgba(99,102,241,0.3);background:rgba(99,102,241,0.02);}
  .p-card.is-you{border-color:rgba(245,158,11,0.4);background:rgba(245,158,11,0.04);}

  .p-avatar{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;background:rgba(245,158,11,0.1);color:#f59e0b;border:3px solid transparent;transition:all 0.3s ease;}
  @media(min-width:480px){.p-avatar{width:54px;height:54px;font-size:20px;}}
  @media(min-width:768px){.p-avatar{width:60px;height:60px;font-size:22px;}}
  .p-card.focus .p-avatar,.p-card.focus.is-you .p-avatar{border-color:#10b981;box-shadow:0 0 16px rgba(16,185,129,0.12);}
  .p-card.idle .p-avatar,.p-card.idle.is-you .p-avatar{border-color:#f59e0b;box-shadow:0 0 16px rgba(245,158,11,0.08);}
  .p-card.rest .p-avatar,.p-card.rest.is-you .p-avatar{border-color:#818cf8;box-shadow:0 0 16px rgba(129,140,248,0.08);}

  .p-name{font-size:12px;font-weight:600;color:#edeff2;}
  @media(min-width:480px){.p-name{font-size:13px;}}
  @media(min-width:768px){.p-name{font-size:14px;}}
  .p-mode{padding:3px 10px;border-radius:999px;font-size:9px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;}
  @media(min-width:480px){.p-mode{padding:4px 12px;font-size:10px;}}
  .p-mode.focus{background:rgba(16,185,129,0.12);color:#10b981;}
  .p-mode.idle{background:rgba(245,158,11,0.12);color:#f59e0b;}
  .p-mode.rest{background:rgba(99,102,241,0.12);color:#818cf8;}

  .p-time{font-size:11px;color:#5a6478;display:flex;align-items:center;gap:3px;font-weight:500;}
  @media(min-width:480px){.p-time{font-size:12px;}}
  .p-note{font-size:10px;color:#6a7280;font-style:italic;max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  @media(min-width:480px){.p-note{font-size:11px;max-width:160px;}}

  .pagination{display:flex;align-items:center;justify-content:center;gap:4px;padding:10px;border-top:1px solid rgba(255,255,255,0.04);flex-shrink:0;}
  @media(min-width:480px){.pagination{gap:6px;padding:14px;}}
  .page-btn{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s ease;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.04);color:#5a6478;font-family:'Inter',sans-serif;font-size:12px;}
  @media(min-width:480px){.page-btn{width:32px;height:32px;border-radius:8px;}}
  .page-btn:hover{color:#f59e0b;border-color:rgba(245,158,11,0.3);}
  .page-btn:disabled{opacity:0.3;cursor:not-allowed;}
  .page-btn.active{background:rgba(245,158,11,0.08);border-color:rgba(245,158,11,0.3);color:#f59e0b;}

  .empty-study{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#5a6478;gap:10px;padding:20px;}
`;

interface Participant { userId: string; userName: string; mode: string; note: string; duration: number; }

const MODES = [
  { value: "FOCUS", label: "Focus", icon: Zap, colorClass: "focus" },
  { value: "IDLE", label: "Idle", icon: Coffee, colorClass: "idle" },
  { value: "REST", label: "Rest", icon: Timer, colorClass: "rest" },
];

export function StudyRoom({ roomId, roomName, currentUserId, currentUserName, isOwner, squadId }: {
  roomId: string; roomName: string; currentUserId: string; currentUserName: string; isOwner: boolean; squadId: string;
}) {
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [mode, setMode] = useState("FOCUS");
  const [note, setNote] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [page, setPage] = useState(0);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const perPage = 8;
  const joinInProgress = useRef(false);

  useEffect(() => {
    fetch(`/api/rooms/${roomId}/study`).then((r) => r.json()).then((d) => {
      const data = Array.isArray(d) ? d : [];
      setParticipants(data);
      const isIn = data.some((p: Participant) => p.userId === currentUserId);
      if (isIn) { 
        setJoined(true); 
        const me = data.find((p: Participant) => p.userId === currentUserId); 
        if (me) { setMode(me.mode || "FOCUS"); setNote(me.note || ""); setTimer(me.duration || 0); } 
      }
    }).catch(() => {});
  }, [roomId, currentUserId]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!, authEndpoint: "/api/pusher/auth" });
    const ch = pusher.subscribe(`study-${roomId}`);
    
    ch.bind("user-joined", (p: Participant) => {
      setParticipants((prev) => {
        // Prevent duplicate: if user already exists, update instead of add
        const exists = prev.some((x) => x.userId === p.userId);
        if (exists) {
          return prev.map((x) => x.userId === p.userId ? p : x);
        }
        return [...prev, p];
      });
    });
    
    ch.bind("user-left", (data: { userId: string }) => {
      setParticipants((prev) => prev.filter((x) => x.userId !== data.userId));
    });
    
    ch.bind("mode-changed", (data: { userId: string; mode: string }) => {
      setParticipants((prev) => prev.map((p) => p.userId === data.userId ? { ...p, mode: data.mode } : p));
      if (data.userId === currentUserId) setMode(data.mode);
    });
    
    ch.bind("note-changed", (data: { userId: string; note: string }) => {
      setParticipants((prev) => prev.map((p) => p.userId === data.userId ? { ...p, note: data.note } : p));
    });
    
    return () => { ch.unbind_all(); ch.unsubscribe(); pusher.disconnect(); };
  }, [roomId, currentUserId]);

  useEffect(() => { 
    if (joined) { 
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000); 
    } 
    return () => { 
      if (timerRef.current) clearInterval(timerRef.current); 
    }; 
  }, [joined]);

  const joinStudy = async () => {
    // Prevent multiple clicks
    if (joining || joined || joinInProgress.current) return;
    
    joinInProgress.current = true;
    setJoining(true);
    
    try {
      const res = await fetch(`/api/rooms/${roomId}/study`, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ action: "start" }) 
      });
      
      if (!res.ok) throw new Error("Failed to join");
      
      setJoined(true);
      setTimer(0);
      toast.success("Joined study room!");
    } catch {
      toast.error("Failed to join");
    } finally {
      setJoining(false);
      joinInProgress.current = false;
    }
  };

  const leaveStudy = async () => {
    if (leaving || !joined) return;
    
    setLeaving(true);
    
    try {
      const res = await fetch(`/api/rooms/${roomId}/study`, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ action: "stop" }) 
      });
      
      if (!res.ok) throw new Error("Failed to leave");
      
      setJoined(false);
      if (timerRef.current) clearInterval(timerRef.current);
      toast.success(`Study session ended! ${formatDuration(timer)}`);
    } catch {
      toast.error("Failed to leave");
    } finally {
      setLeaving(false);
    }
  };

  const changeMode = async (newMode: string) => { 
    setMode(newMode); 
    try { await fetch(`/api/rooms/${roomId}/study/mode`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: newMode }) }); } catch {} 
  };
  
  const changeNote = async (newNote: string) => { 
    setNote(newNote); 
    try { await fetch(`/api/rooms/${roomId}/study/note`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note: newNote }) }); } catch {} 
  };

  const formatDuration = (s: number) => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return h > 0 ? `${h}h ${m}m` : `${m}m`; };

  const totalPages = Math.ceil(participants.length / perPage);
  const paginated = participants.slice(page * perPage, (page + 1) * perPage);

  // Filter out duplicates based on userId
  const uniqueParticipants = participants.filter((p, index, self) => 
    index === self.findIndex((t) => t.userId === p.userId)
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="sr-wrap">
        <div className="sr-header">
          <div className="sr-header-left">
            <BookOpen size={20} className="sr-header-icon" />
            <div style={{ minWidth: 0 }}>
              <p className="sr-header-name">{roomName}</p>
              <p className="sr-header-count">{uniqueParticipants.length} studying</p>
            </div>
          </div>
          <div className="sr-header-right">
            {joined && (
              <>
                <div className="mode-selector">
                  {MODES.map((m) => { const Icon = m.icon; return (
                    <button key={m.value} className={`mode-btn ${mode === m.value ? `active-${m.colorClass}` : ""}`} onClick={() => changeMode(m.value)}><Icon size={12} />{m.label}</button>
                  );})}
                </div>
                <input className="notes-input" placeholder="Studying..." value={note} onChange={(e) => changeNote(e.target.value)} />
              </>
            )}
            {!joined ? (
              <button className="join-btn" onClick={joinStudy} disabled={joining}>
                {joining ? (
                  <span className="spinner" style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                ) : (
                  <LogIn size={14} />
                )}
                {joining ? "Joining..." : "Join Study"}
              </button>
            ) : (
              <button className="leave-btn" onClick={leaveStudy} disabled={leaving}>
                {leaving ? (
                  <span className="spinner" style={{ width: 14, height: 14, border: "2px solid rgba(239,68,68,0.3)", borderTopColor: "#ef4444", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                ) : (
                  <LogOut size={14} />
                )}
                {leaving ? "Leaving..." : "Leave"}
              </button>
            )}
          </div>
        </div>

        {uniqueParticipants.length === 0 && !joined ? (
          <div className="empty-study">
            <BookOpen size={48} style={{ opacity: 0.2 }} />
            <p style={{ fontSize: "15px", fontWeight: 500 }}>No one studying yet</p>
            <p style={{ fontSize: "12px" }}>Click Join Study to start!</p>
          </div>
        ) : (
          <div className="sr-grid-area">
            <div className="sr-grid">
              {joined && (
                <div className={`p-card is-you ${mode.toLowerCase()}`}>
                  <div className="p-avatar">{currentUserName?.charAt(0) || "Y"}</div>
                  <p className="p-name">{currentUserName} (You)</p>
                  <span className={`p-mode ${mode.toLowerCase()}`}>{MODES.find((m) => m.value === mode)?.label}</span>
                  <p className="p-time"><Timer size={12} />{formatDuration(timer)}</p>
                  {note && <p className="p-note">{note}</p>}
                </div>
              )}
              {paginated.filter((p) => p.userId !== currentUserId).map((p) => (
                <div key={p.userId} className={`p-card ${p.mode.toLowerCase()}`}>
                  <div className="p-avatar">{p.userName?.charAt(0) || "?"}</div>
                  <p className="p-name">{p.userName}</p>
                  <span className={`p-mode ${p.mode.toLowerCase()}`}>{p.mode}</span>
                  <p className="p-time"><Timer size={12} />{formatDuration(p.duration)}</p>
                  {p.note && <p className="p-note">{p.note}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}><ChevronLeft size={14} /></button>
            {Array.from({ length: totalPages }, (_, i) => (<button key={i} className={`page-btn ${page === i ? "active" : ""}`} onClick={() => setPage(i)}>{i + 1}</button>))}
            <button className="page-btn" onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page === totalPages - 1}><ChevronRight size={14} /></button>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
      ` }} />
    </>
  );
}