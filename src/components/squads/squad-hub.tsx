"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Target, Users, LogOut, ChevronLeft, ChevronRight, Trash2, Shield, CheckSquare, Bell, Crown, MessageCircle, BookOpen, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ChatRoom } from "@/components/rooms/chat-room";
import { StudyRoom } from "@/components/rooms/study-room-v2";
import { SquadTasks } from "@/components/squads/squad-tasks";
import { LoadingScreen } from "@/components/ui/loading-screen";

const STYLES = `
  .hub-root{display:flex;height:100%;width:100%;}
  .hub-sidebar{height:100%;position:relative;z-index:1;flex-shrink:0;display:flex;flex-direction:column;background:rgba(13,18,28,0.92);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);border-right:1px solid rgba(255,255,255,0.04);transition:width 0.35s cubic-bezier(0.22,0.61,0.36,1);width:220px;}
  .hub-sidebar.collapsed{width:72px;}
  @media(max-width:1023px){.hub-sidebar{position:fixed;top:0;left:0;bottom:0;z-index:50;width:260px;transform:translateX(-100%);}.hub-sidebar.mobile-open{transform:translateX(0);box-shadow:20px 0 60px rgba(0,0,0,0.5);}}
  .hub-sb-header{display:flex;align-items:center;justify-content:space-between;padding:18px;border-bottom:1px solid rgba(255,255,255,0.04);min-height:64px;}
  .hub-sb-title-wrap{display:flex;align-items:center;gap:10px;overflow:hidden;}
  .hub-sb-logo{width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,#f59e0b,#f97316);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 8px 20px -8px rgba(245,158,11,0.3);}
  .hub-sb-title{font-weight:700;color:#edeff2;font-size:17px;letter-spacing:0.03em;white-space:nowrap;}
  .hub-sb-collapse{background:none;border:none;color:#5a6478;cursor:pointer;padding:6px;border-radius:8px;transition:all 0.3s;display:flex;align-items:center;justify-content:center;}
  .hub-sb-collapse:hover{color:#f59e0b;background:rgba(245,158,11,0.06);}
  .hub-collapse-icon{transition:transform 0.35s ease;}
  .hub-collapse-icon.flipped{transform:rotate(180deg);}
  .hub-sb-nav{flex:1;padding:14px 10px;overflow-y:auto;display:flex;flex-direction:column;gap:3px;}
  .hub-sb-section-title{font-size:10px;font-weight:600;color:#5a6478;text-transform:uppercase;letter-spacing:0.1em;padding:8px 14px 4px;}
  .hub-sb-item{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:12px;font-size:13px;font-weight:500;color:#9aa4b8;transition:all 0.3s ease;position:relative;white-space:nowrap;border:none;background:none;width:100%;text-align:left;font-family:'Inter',sans-serif;cursor:pointer;}
  .hub-sb-item:hover{color:#edeff2;background:rgba(255,255,255,0.02);}
  .hub-sb-item.active{color:#f59e0b;background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.12);box-shadow:0 0 20px rgba(245,158,11,0.04);}
  .hub-sb-item.active::before{content:'';position:absolute;left:0;top:10px;bottom:10px;width:2px;background:#f59e0b;border-radius:0 2px 2px 0;}
  .hub-sb-item.danger{color:#5a6478;}
  .hub-sb-item.danger:hover{color:#ef4444;background:rgba(239,68,68,0.04);}
  .hub-sb-icon{flex-shrink:0;}
  .hub-sidebar.collapsed .hub-sb-item{justify-content:center;padding:10px;}
  .hub-sidebar.collapsed .hub-sb-item::before{display:none;}
  .notif-badge{background:#ef4444;color:#fff;font-size:10px;padding:2px 6px;border-radius:999px;font-weight:600;margin-left:auto;}
  .hub-sidebar.collapsed .notif-badge{position:absolute;top:4px;right:4px;margin-left:0;}
  .hub-sb-bottom{padding:14px 10px;border-top:1px solid rgba(255,255,255,0.04);display:flex;flex-direction:column;gap:6px;margin-top:auto;}
  .hub-sb-leave{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:12px;border:none;background:none;cursor:pointer;font-size:13px;font-weight:400;color:#5a6478;transition:all 0.3s;width:100%;font-family:'Inter',sans-serif;}
  .hub-sb-leave:hover{color:#ef4444;background:rgba(239,68,68,0.04);}
  .hub-sidebar.collapsed .hub-sb-leave{justify-content:center;padding:10px;}
  .hub-main{flex:1;min-width:0;overflow-y:auto;background:#0a0f18;display:flex;flex-direction:column;}
  .mobile-toggle{position:fixed;bottom:24px;left:16px;z-index:35;width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#f59e0b,#f97316);border:none;color:#0a0a0a;cursor:pointer;display:none;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(245,158,11,0.3);}
  @media(max-width:1023px){.mobile-toggle{display:flex;}}
  .mobile-toggle:hover{transform:scale(1.06);}
  .mobile-overlay{position:fixed;inset:0;z-index:40;background:rgba(0,0,0,0.5);}
  @media(min-width:1024px){.mobile-overlay{display:none;}}
  
  .hub-header{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.04);background:rgba(10,15,24,0.8);backdrop-filter:blur(12px);flex-shrink:0;}
  .hub-header-name{font-size:15px;font-weight:600;color:#edeff2;}
  .members-grid{display:grid;grid-template-columns:1fr;gap:4px;padding:10px 12px;}
  @media(min-width:600px){.members-grid{grid-template-columns:1fr 1fr;gap:6px;padding:12px 16px;}}
  .member-card{display:flex;align-items:center;gap:10px;padding:11px 13px;border-radius:12px;border:1px solid rgba(255,255,255,0.03);transition:all 0.25s;background:rgba(18,25,40,0.4);backdrop-filter:blur(10px);}
  .member-card:hover{background:rgba(22,30,46,0.5);border-color:rgba(255,255,255,0.06);}
  .member-avatar{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;background:rgba(245,158,11,0.1);color:#f59e0b;flex-shrink:0;}
  .member-info{flex:1;min-width:0;}
  .member-name{font-size:13px;font-weight:600;color:#edeff2;display:flex;align-items:center;gap:6px;}
  .member-role{font-size:9px;font-weight:600;padding:2px 6px;border-radius:999px;}
  .member-role.owner{background:rgba(245,158,11,0.12);color:#f59e0b;}
  .member-role.mod{background:rgba(99,102,241,0.12);color:#818cf8;}
  .member-goal{font-size:10px;color:#5a6478;margin-top:1px;}
  .notif-list{display:flex;flex-direction:column;gap:2px;padding:10px 12px;}
  .notif-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;border:1px solid rgba(255,255,255,0.02);background:rgba(18,25,40,0.3);backdrop-filter:blur(10px);}
  .notif-icon{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;font-weight:700;}
  .notif-icon.join{background:rgba(16,185,129,0.1);color:#10b981;}
  .notif-text{font-size:12px;color:#edeff2;flex:1;}
  .notif-time{font-size:10px;color:#5a6478;flex-shrink:0;}
  .pagination-row{display:flex;align-items:center;justify-content:center;gap:4px;padding:10px;border-top:1px solid rgba(255,255,255,0.04);}
  .page-btn{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.04);color:#5a6478;font-size:11px;}
  .page-btn:hover{color:#f59e0b;border-color:rgba(245,158,11,0.3);}
  .page-btn:disabled{opacity:0.3;cursor:not-allowed;}
  .page-btn.active{background:rgba(245,158,11,0.08);border-color:rgba(245,158,11,0.3);color:#f59e0b;}
  .page-info{font-size:11px;color:#5a6478;margin:0 8px;}
  .empty-state{text-align:center;padding:60px 20px;color:#5a6478;}
  
  .welcome-wrap{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;text-align:center;}
  .welcome-icon{font-size:56px;margin-bottom:16px;opacity:0.6;}
  .welcome-title{font-size:22px;font-weight:700;color:#edeff2;margin-bottom:8px;}
  .welcome-desc{font-size:13px;color:#5a6478;max-width:400px;line-height:1.6;margin-bottom:24px;}
  .welcome-btn{padding:14px 32px;border-radius:14px;border:none;cursor:pointer;background:linear-gradient(135deg,#f59e0b,#f97316);color:#0a0a0a;font-size:14px;font-weight:600;font-family:'Inter',sans-serif;box-shadow:0 12px 30px -8px rgba(245,158,11,0.3);display:flex;align-items:center;gap:8px;transition:all 0.3s;}
  .welcome-btn:hover{transform:scale(1.03);}
  
  .modal-overlay{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;padding:16px;}
  .modal-card{width:100%;max-width:400px;border-radius:18px;background:rgba(15,22,36,0.95);border:1px solid rgba(255,255,255,0.06);backdrop-filter:blur(20px);padding:24px 20px;}
  .modal-title{font-size:18px;font-weight:700;color:#edeff2;margin-bottom:16px;}
  .modal-input{width:100%;padding:11px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);color:#edeff2;font-size:13px;outline:none;font-family:'Inter',sans-serif;margin-bottom:12px;}
  .modal-input:focus{border-color:rgba(245,158,11,0.4);}
  .modal-type-row{display:flex;gap:8px;margin-bottom:16px;}
  .modal-type-opt{flex:1;padding:14px 8px;border-radius:10px;border:2px solid rgba(255,255,255,0.05);background:rgba(255,255,255,0.015);cursor:pointer;text-align:center;transition:all 0.2s;}
  .modal-type-opt:hover{border-color:rgba(245,158,11,0.3);}
  .modal-type-opt.sel{border-color:rgba(245,158,11,0.5);background:rgba(245,158,11,0.06);}
  .modal-actions{display:flex;gap:8px;justify-content:flex-end;}
  .modal-btn{padding:10px 20px;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.2s;}
  .modal-btn-cancel{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);color:#9aa4b8;}
  .modal-btn-create{background:linear-gradient(135deg,#f59e0b,#f97316);border:none;color:#0a0a0a;}
  .modal-btn-create:hover{transform:scale(1.03);}
  .modal-btn-create:disabled{opacity:0.4;cursor:not-allowed;}
`;

interface Room { id: string; name: string; type: string; order: number; }
interface Member { id: string; name: string; image: string | null; currentGoal: string | null; streak: number; role: string; }
type ViewType = "welcome" | "chat" | "study" | "tasks" | "members" | "notifications";

export function SquadHub({
  squadId, squadName, squadIcon, squadGoal, squadCategory, squadDescription,
  memberCount, createdAt, ownerName, isMember, isOwner, isModerator,
  currentUserId, currentUserName, rooms: initialRooms, members,
  activeRoomId: initialActiveRoomId, activeView: initialActiveView,
}: {
  squadId: string; squadName: string; squadIcon: string; squadGoal: string;
  squadCategory: string; squadDescription: string; memberCount: number;
  createdAt: string; ownerName: string; isMember: boolean; isOwner: boolean;
  isModerator: boolean; currentUserId: string; currentUserName: string;
  rooms: Room[]; members: Member[];
  activeRoomId?: string; activeView?: string;
}) {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>((initialActiveView as ViewType) || "welcome");
  const [activeRoomId, setActiveRoomId] = useState<string | null>(initialActiveRoomId || null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomType, setNewRoomType] = useState("CHAT");
  const [creating, setCreating] = useState(false);
  const [localMembers, setLocalMembers] = useState<Member[]>(members);
  const [notifications, setNotifications] = useState<{ id: string; text: string; time: string; type: string }[]>([]);
  const [memberPage, setMemberPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const MEMBERS_PER_PAGE = 20;

  useEffect(() => { setRooms(initialRooms); setLocalMembers(members); }, [initialRooms, members]);
  useEffect(() => { fetch(`/api/squads/${squadId}/notifications`).then(r => r.json()).then(d => setNotifications(Array.isArray(d) ? d : [])).catch(() => {}); }, [squadId]);

  const activeRoom = rooms.find((r) => r.id === activeRoomId);
  const canManage = isOwner || isModerator;
  const totalMemberPages = Math.ceil(localMembers.length / MEMBERS_PER_PAGE);
  const paginatedMembers = localMembers.slice(memberPage * MEMBERS_PER_PAGE, (memberPage + 1) * MEMBERS_PER_PAGE);

  const handleViewChange = (view: string, roomId?: string) => {
    setLoading(true);
    setTimeout(() => {
      setActiveView(view as ViewType);
      if (roomId) { const exists = rooms.some((r) => r.id === roomId); if (exists) setActiveRoomId(roomId); else if (rooms.length > 0) { setActiveRoomId(rooms[0].id); setActiveView(rooms[0].type === "CHAT" ? "chat" : "study"); } else setActiveView("welcome"); }
      setLoading(false);
    }, 300);
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim() || creating) return;
    setCreating(true);
    try {
      const res = await fetch(`/api/squads/${squadId}/rooms`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newRoomName.trim(), type: newRoomType }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRooms([...rooms, data.room]); setNewRoomName(""); setShowCreateModal(false);
      setActiveRoomId(data.room.id); setActiveView(data.room.type === "CHAT" ? "chat" : "study");
      toast.success("Room created!"); router.refresh();
    } catch { toast.error("Failed"); }
    setCreating(false);
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm("Delete this room? All messages will be lost.")) return;
    setLoading(true);
    try {
      await fetch(`/api/squads/${squadId}/rooms/${roomId}`, { method: "DELETE" });
      const remaining = rooms.filter((r) => r.id !== roomId);
      setRooms(remaining);
      toast.success("Room deleted");
      setTimeout(() => {
        if (activeRoomId === roomId) {
          if (remaining.length > 0) { setActiveRoomId(remaining[0].id); setActiveView(remaining[0].type === "CHAT" ? "chat" : "study"); }
          else { setActiveRoomId(null); setActiveView("welcome"); }
        }
        setLoading(false);
      }, 400);
      router.refresh();
    } catch { toast.error("Failed"); setLoading(false); }
  };

  const handleKick = async (userId: string) => { try { await fetch(`/api/squads/${squadId}/members/${userId}`, { method: "DELETE" }); setLocalMembers((prev) => prev.filter((m) => m.id !== userId)); toast.success("Member removed"); router.refresh(); } catch { toast.error("Failed"); } };
  const handlePromote = async (userId: string, role: string) => { try { await fetch(`/api/squads/${squadId}/members/${userId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role }) }); setLocalMembers((prev) => prev.map((m) => m.id === userId ? { ...m, role } : m)); toast.success("Role updated"); router.refresh(); } catch { toast.error("Failed"); } };

  const handleDeleteSquad = async () => {
    if (!confirm("DELETE this squad permanently? This action CANNOT be undone. All rooms, messages, and data will be lost.")) return;
    setLoading(true);
    try {
      await fetch(`/api/squads/${squadId}`, { method: "DELETE" });
      toast.success("Squad deleted");
      router.push("/squads");
    } catch { toast.error("Failed to delete squad"); setLoading(false); }
  };

  const handleLeaveSquad = async () => {
    if (!confirm("Leave this squad?")) return;
    setLoading(true);
    try {
      await fetch(`/api/squads/${squadId}/leave`, { method: "POST" });
      toast.success("Left squad");
      router.push("/squads");
    } catch { toast.error("Failed to leave squad"); setLoading(false); }
  };

  const renderContent = () => {
    if (activeView === "welcome" || rooms.length === 0) return (
      <div className="welcome-wrap"><div className="welcome-icon">{squadIcon}</div><h2 className="welcome-title">Welcome to {squadName}</h2><p className="welcome-desc">This is your squad&apos;s home base. Create your first room to start collaborating with your team. Chat rooms for discussions, Study rooms for focused work sessions.</p>{canManage ? <button className="welcome-btn" onClick={() => setShowCreateModal(true)}><Plus size={18} /> Create Your First Room</button> : <p style={{ color: "#5a6478", fontSize: "13px" }}>Ask the owner to create a room.</p>}</div>
    );
    if (activeView === "chat" && activeRoom) return <ChatRoom roomId={activeRoom.id} roomName={activeRoom.name} currentUserId={currentUserId} currentUserName={currentUserName} />;
    if (activeView === "study" && activeRoom) return <StudyRoom roomId={activeRoom.id} roomName={activeRoom.name} currentUserId={currentUserId} currentUserName={currentUserName} isOwner={isOwner} squadId={squadId} />;
    if (activeView === "tasks") return <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}><div className="hub-header"><Target size={18} style={{ color: "#f59e0b" }} /><span className="hub-header-name">Squad Tasks</span></div><div style={{ padding: "20px" }}><SquadTasks squadId={squadId} isMember={isMember} /></div></div>;
    if (activeView === "members") return (
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        <div className="hub-header"><Users size={18} style={{ color: "#f59e0b" }} /><span className="hub-header-name">Members ({localMembers.length})</span></div>
        <div className="members-grid">
          {paginatedMembers.map((m) => (
            <div key={m.id} className="member-card">
              <div className="member-avatar">{m.name?.charAt(0) || "?"}</div>
              <div className="member-info">
                <p className="member-name">{m.name}{m.role === "OWNER" && <span className="member-role owner"><Crown size={9} />Owner</span>}{m.role === "MODERATOR" && <span className="member-role mod"><Shield size={9} />Mod</span>}</p>
                {m.currentGoal && <p className="member-goal">{m.currentGoal}</p>}
              </div>
              {canManage && m.id !== currentUserId && (
                <div style={{ display: "flex", gap: "3px", flexShrink: 0 }}>
                  {isOwner && m.role !== "MODERATOR" && <button className="page-btn" onClick={() => handlePromote(m.id, "MODERATOR")} style={{ fontSize: "9px", padding: "3px 6px" }}><Shield size={9} /></button>}
                  {isOwner && m.role === "MODERATOR" && <button className="page-btn" onClick={() => handlePromote(m.id, "MEMBER")} style={{ fontSize: "9px", padding: "3px 6px" }}>Demote</button>}
                  <button className="page-btn" onClick={() => handleKick(m.id)} style={{ fontSize: "9px", padding: "3px 6px", color: "#ef4444" }}><Trash2 size={9} /></button>
                </div>
              )}
            </div>
          ))}
        </div>
        {totalMemberPages > 1 && (
          <div className="pagination-row">
            <button className="page-btn" onClick={() => setMemberPage(Math.max(0, memberPage - 1))} disabled={memberPage === 0}><ChevronLeft size={14} /></button>
            {Array.from({ length: Math.min(totalMemberPages, 5) }, (_, i) => { const s = Math.max(0, Math.min(memberPage - 2, totalMemberPages - 5)); const p = s + i; if (p >= totalMemberPages) return null; return <button key={p} className={`page-btn ${memberPage === p ? "active" : ""}`} onClick={() => setMemberPage(p)}>{p + 1}</button>; })}
            <span className="page-info">{memberPage + 1} of {totalMemberPages}</span>
            <button className="page-btn" onClick={() => setMemberPage(Math.min(totalMemberPages - 1, memberPage + 1))} disabled={memberPage === totalMemberPages - 1}><ChevronRight size={14} /></button>
          </div>
        )}
      </div>
    );
    if (activeView === "notifications") return (
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        <div className="hub-header"><Bell size={18} style={{ color: "#f59e0b" }} /><span className="hub-header-name">Notifications</span></div>
        <div style={{ flex: 1, overflow: "auto" }}>
          {notifications.length === 0 ? <div className="empty-state"><Bell size={44} style={{ opacity: 0.12, marginBottom: "12px" }} /><p style={{ fontSize: "15px", fontWeight: 500 }}>No notifications yet</p></div> :
            <div className="notif-list">{notifications.map((n) => <div key={n.id} className="notif-item"><div className={`notif-icon ${n.type || "join"}`}>{n.type === "join" ? "+" : "i"}</div><p className="notif-text">{n.text}</p><span className="notif-time">{n.time}</span></div>)}</div>
          }
        </div>
      </div>
    );
    return <div className="welcome-wrap"><div className="welcome-icon">{squadIcon}</div><h2 className="welcome-title">{squadName}</h2><p className="welcome-desc">{squadGoal}</p>{canManage && <button className="welcome-btn" onClick={() => setShowCreateModal(true)}><Plus size={18} />Create Room</button>}</div>;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <AnimatePresence>{mobileOpen && <motion.div className="mobile-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />}</AnimatePresence>
      {loading && <LoadingScreen text="Loading..." />}

      {showCreateModal && (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowCreateModal(false)}>
          <motion.div className="modal-card" initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title"><Sparkles size={16} style={{ color: "#f59e0b", marginRight: "6px", display: "inline" }} />Create Room</h3>
            <input className="modal-input" placeholder="Room name..." value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} autoFocus />
            <div className="modal-type-row">
              <div 
                className={`modal-type-opt ${newRoomType === "CHAT" ? "sel" : ""}`} 
                onClick={() => setNewRoomType("CHAT")}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                <MessageCircle size={24} style={{ color: newRoomType === "CHAT" ? "#f59e0b" : "#5a6478", marginBottom: "6px" }} />
                <div style={{ fontSize: "11px", fontWeight: 600, color: "#edeff2" }}>Chat Room</div>
              </div>
                    
              <div 
                className={`modal-type-opt ${newRoomType === "STUDY" ? "sel" : ""}`} 
                onClick={() => setNewRoomType("STUDY")}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                <BookOpen size={24} style={{ color: newRoomType === "STUDY" ? "#f59e0b" : "#5a6478", marginBottom: "6px" }} />
                <div style={{ fontSize: "11px", fontWeight: 600, color: "#edeff2" }}>Study Room</div>
              </div>
            </div>
            <div className="modal-actions"><button className="modal-btn modal-btn-cancel" onClick={() => setShowCreateModal(false)}>Cancel</button><button className="modal-btn modal-btn-create" onClick={handleCreateRoom} disabled={creating || !newRoomName.trim()}>{creating ? "Creating..." : "Create"}</button></div>
          </motion.div>
        </motion.div>
      )}

      <div className="hub-root">
        <aside className={`hub-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
          <div className="hub-sb-header">
            <div className="hub-sb-title-wrap"><div className="hub-sb-logo"><Crown size={15} style={{ color: "#0a0a0a" }} /></div>{!collapsed && <span className="hub-sb-title">{squadName}</span>}</div>
            <button className="hub-sb-collapse mobile-close" onClick={() => setMobileOpen(false)}><ChevronLeft size={16} /></button>
            <button className="hub-sb-collapse desktop-collapse" onClick={() => setCollapsed(!collapsed)}><ChevronLeft size={16} className={`hub-collapse-icon ${collapsed ? 'flipped' : ''}`} /></button>
          </div>
          <nav className="hub-sb-nav">
            <p className="hub-sb-section-title">Rooms</p>
            {rooms.map((room) => (
              <button key={room.id} className={`hub-sb-item ${activeRoomId === room.id ? "active" : ""}`} onClick={() => { setActiveRoomId(room.id); setActiveView(room.type === "CHAT" ? "chat" : "study"); setMobileOpen(false); }}>
                {room.type === "CHAT" ? <MessageCircle size={19} className="hub-sb-icon" /> : <BookOpen size={19} className="hub-sb-icon" />}{!collapsed && <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{room.name}</span>}
                {canManage && !collapsed && <span onClick={(e) => { e.stopPropagation(); handleDeleteRoom(room.id); }} style={{ marginLeft: "auto", color: "#5a6478", cursor: "pointer", fontSize: "14px", opacity: 0, transition: "opacity 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.opacity = "1"} onMouseLeave={(e) => e.currentTarget.style.opacity = "0"}>🗑️</span>}
              </button>
            ))}
            {canManage && <button className="hub-sb-item" onClick={() => { setShowCreateModal(true); setMobileOpen(false); }}><Plus size={19} className="hub-sb-icon" />{!collapsed && <span>Add Room</span>}</button>}
            
            <p className="hub-sb-section-title" style={{ marginTop: "4px" }}>Squad</p>
            
            <button className={`hub-sb-item ${activeView === "tasks" ? "active" : ""}`} onClick={() => { setActiveView("tasks"); setMobileOpen(false); }}>
              <CheckSquare size={19} className="hub-sb-icon" />
              {!collapsed && <span>Squad Tasks</span>}
            </button>
            
            <button className={`hub-sb-item ${activeView === "members" ? "active" : ""}`} onClick={() => { setActiveView("members"); setMobileOpen(false); }}>
              <Users size={19} className="hub-sb-icon" />
              {!collapsed && <span>Members</span>}
            </button>
            
            <button className={`hub-sb-item ${activeView === "notifications" ? "active" : ""}`} onClick={() => { setActiveView("notifications"); setMobileOpen(false); }}>
              <Bell size={19} className="hub-sb-icon" />
              {!collapsed && <span>Notifications</span>}
              {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
            </button>
          </nav>
          
          <div className="hub-sb-bottom">
            {isOwner ? (
              <>
                <button 
                  className="hub-sb-leave" 
                  onClick={handleDeleteSquad}
                  style={{ color: "#ef4444" }}
                >
                  <Trash2 size={17} />
                  {!collapsed && <span>Delete Squad</span>}
                </button>
                <div style={{ height: "1px", background: "rgba(255,255,255,0.04)", margin: "4px 0" }} />
              </>
            ) : (
              <button className="hub-sb-leave" onClick={handleLeaveSquad}>
                <LogOut size={17} />
                {!collapsed && <span>Leave Squad</span>}
              </button>
            )}
          </div>
        </aside>
        
        <main className={`hub-main ${collapsed ? 'sidebar-collapsed' : ''}`}>{renderContent()}</main>
        
        <motion.button className="mobile-toggle" onClick={() => setMobileOpen(true)} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><ChevronRight size={20} /></motion.button>
      </div>
      <style>{`@media(min-width:1024px){.mobile-toggle{display:none!important;}.mobile-close{display:none!important;}.hub-sidebar.mobile-open{transform:translateX(0)!important;}}@media(max-width:1023px){.desktop-collapse{display:none!important;}}`}</style>
    </>
  );
}