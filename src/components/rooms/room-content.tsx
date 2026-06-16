"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RoomSidebar } from "@/components/squads/room-sidebar";
import { ChatRoom } from "@/components/rooms/chat-room";
import { StudyRoom } from "@/components/rooms/study-room-v2";
import { SquadTasks } from "@/components/squads/squad-tasks";
import { Users, Bell, Target, ChevronLeft, ChevronRight, Crown, Shield } from "lucide-react";
import { toast } from "sonner";
import { LoadingScreen } from "@/components/ui/loading-screen";

const STYLES = `
  .rc-header{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.04);background:rgba(10,15,24,0.8);backdrop-filter:blur(12px);flex-shrink:0;}
  @media(min-width:480px){.rc-header{padding:14px 24px;}}
  .rc-header-name{font-size:15px;font-weight:600;color:#edeff2;}

  .members-wrap{flex:1;overflow-y:auto;}
  .members-subheader{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.04);flex-wrap:wrap;gap:8px;}
  @media(min-width:480px){.members-subheader{padding:14px 20px;}}
  .members-count{font-size:12px;color:#5a6478;font-weight:500;display:flex;align-items:center;gap:6px;}
  .members-grid{display:grid;grid-template-columns:1fr;gap:4px;padding:10px 12px;}
  @media(min-width:600px){.members-grid{grid-template-columns:1fr 1fr;gap:6px;padding:12px 16px;}}
  @media(min-width:900px){.members-grid{grid-template-columns:1fr 1fr;gap:8px;padding:16px 20px;}}
  .member-card{display:flex;align-items:center;gap:10px;padding:11px 13px;border-radius:12px;border:1px solid rgba(255,255,255,0.03);transition:all 0.25s;background:rgba(18,25,40,0.4);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);}
  @media(min-width:480px){.member-card{padding:13px 16px;border-radius:14px;}}
  .member-card:hover{background:rgba(22,30,46,0.5);border-color:rgba(255,255,255,0.06);transform:translateY(-1px);}
  .member-avatar{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;background:rgba(245,158,11,0.1);color:#f59e0b;flex-shrink:0;border:2px solid transparent;transition:all 0.2s;}
  @media(min-width:480px){.member-avatar{width:42px;height:42px;font-size:15px;}}
  .member-card:hover .member-avatar{border-color:rgba(245,158,11,0.2);}
  .member-info{flex:1;min-width:0;}
  .member-name{font-size:13px;font-weight:600;color:#edeff2;display:flex;align-items:center;gap:6px;}
  @media(min-width:480px){.member-name{font-size:14px;}}
  .member-role{font-size:9px;font-weight:600;padding:2px 6px;border-radius:999px;white-space:nowrap;}
  .member-role.owner{background:rgba(245,158,11,0.12);color:#f59e0b;}
  .member-role.mod{background:rgba(99,102,241,0.12);color:#818cf8;}
  .member-goal{font-size:10px;color:#5a6478;margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}

  .notif-wrap{flex:1;overflow-y:auto;}
  .notif-list{display:flex;flex-direction:column;gap:2px;padding:10px 12px;}
  @media(min-width:480px){.notif-list{padding:12px 16px;}}
  .notif-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;border:1px solid rgba(255,255,255,0.02);transition:all 0.2s;background:rgba(18,25,40,0.3);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);}
  @media(min-width:480px){.notif-item{padding:12px 14px;border-radius:12px;}}
  .notif-item:hover{background:rgba(22,30,46,0.4);}
  .notif-icon{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;font-weight:700;}
  @media(min-width:480px){.notif-icon{width:38px;height:38px;font-size:16px;}}
  .notif-icon.join{background:rgba(16,185,129,0.1);color:#10b981;}
  .notif-icon.leave{background:rgba(239,68,68,0.1);color:#ef4444;}
  .notif-icon.system{background:rgba(245,158,11,0.1);color:#f59e0b;}
  .notif-text{font-size:12px;color:#edeff2;flex:1;}
  @media(min-width:480px){.notif-text{font-size:13px;}}
  .notif-time{font-size:10px;color:#5a6478;flex-shrink:0;}

  .empty-state{text-align:center;padding:60px 20px;color:#5a6478;}

  .pagination-row{display:flex;align-items:center;justify-content:center;gap:4px;padding:10px;border-top:1px solid rgba(255,255,255,0.04);}
  .page-btn{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.04);color:#5a6478;font-family:'Inter',sans-serif;font-size:11px;}
  .page-btn:hover{color:#f59e0b;border-color:rgba(245,158,11,0.3);}
  .page-btn:disabled{opacity:0.3;cursor:not-allowed;}
  .page-btn.active{background:rgba(245,158,11,0.08);border-color:rgba(245,158,11,0.3);color:#f59e0b;}
  .page-info{font-size:11px;color:#5a6478;margin:0 8px;}
`;

interface Room { id: string; name: string; type: string; order: number; }
interface Member { id: string; name: string; image: string | null; currentGoal: string | null; streak: number; role: string; }

export function RoomContent({ squadId, squadName, rooms, isOwner, room, currentUserId, currentUserName, members }: {
  squadId: string; squadName: string; rooms: Room[]; isOwner: boolean;
  room: Room; currentUserId: string; currentUserName: string; members: Member[];
}) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<string>(room.type === "CHAT" ? "chat" : "study");
  const [activeRoomId, setActiveRoomId] = useState<string>(room.id);
  const [notifications, setNotifications] = useState<{ id: string; text: string; time: string; type: string }[]>([]);
  const [localMembers, setLocalMembers] = useState<Member[]>(members);
  const [memberPage, setMemberPage] = useState(0);
  const MEMBERS_PER_PAGE = 20;
  const [loading, setLoading] = useState(false);

  useEffect(() => { setLocalMembers(members); }, [members]);
  useEffect(() => {
    fetch(`/api/squads/${squadId}/notifications`).then((r) => r.json()).then((d) => {
      const data = Array.isArray(d) ? d : [];
      setNotifications(data.map((n: any) => ({ ...n, type: n.type || "system" })));
    }).catch(() => {});
  }, [squadId]);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || room;
  const totalMemberPages = Math.ceil(localMembers.length / MEMBERS_PER_PAGE);
  const paginatedMembers = localMembers.slice(memberPage * MEMBERS_PER_PAGE, (memberPage + 1) * MEMBERS_PER_PAGE);

  // Di handleViewChange:
  const handleViewChange = (view: string, roomId?: string) => {
    setLoading(true);
    setTimeout(() => {
      setActiveView(view);
      if (roomId) {
        const roomExists = rooms.some((r) => r.id === roomId);
        if (roomExists) setActiveRoomId(roomId);
        else if (rooms.length > 0) {
          setActiveRoomId(rooms[0].id);
          setActiveView(rooms[0].type === "CHAT" ? "chat" : "study");
        } else setActiveView("welcome");
      }
      setLoading(false);
    }, 400);
  };

  const handleLeaveSquad = async () => {
    if (isOwner) { if (!confirm("Owner leaving will DELETE this squad. Continue?")) return; try { await fetch(`/api/squads/${squadId}`, { method: "DELETE" }); toast.success("Squad deleted"); router.push("/squads"); } catch { toast.error("Failed"); } return; }
    if (!confirm("Leave this squad?")) return;
    try { await fetch(`/api/squads/${squadId}/leave`, { method: "POST" }); toast.success("Left squad"); router.push("/squads"); } catch { toast.error("Failed"); }
  };

  const renderMain = () => {
    if (activeView === "chat") return <ChatRoom roomId={activeRoom.id} roomName={activeRoom.name} currentUserId={currentUserId} currentUserName={currentUserName} />;
    if (activeView === "study") return <StudyRoom roomId={activeRoom.id} roomName={activeRoom.name} currentUserId={currentUserId} currentUserName={currentUserName} isOwner={isOwner} squadId={squadId} />;
    if (activeView === "tasks") return (
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        <div className="rc-header"><Target size={18} style={{ color: "#f59e0b" }} /><span className="rc-header-name">Squad Tasks</span></div>
        <div style={{ padding: "20px" }}><SquadTasks squadId={squadId} isMember={true} /></div>
      </div>
    );
    if (activeView === "members") return (
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        <div className="rc-header"><Users size={18} style={{ color: "#f59e0b" }} /><span className="rc-header-name">Members</span></div>
        <div className="members-subheader">
          <span className="members-count"><Users size={13} style={{ color: "#f59e0b" }} />{localMembers.length} members</span>
        </div>
        <div className="members-grid">
          {paginatedMembers.map((m) => (
            <div key={m.id} className="member-card">
              <div className="member-avatar">{m.name?.charAt(0) || "?"}</div>
              <div className="member-info">
                <p className="member-name">
                  {m.name}
                  {m.role === "OWNER" && <span className="member-role owner">Owner</span>}
                  {m.role === "MODERATOR" && <span className="member-role mod">Mod</span>}
                </p>
                {m.currentGoal && <p className="member-goal">{m.currentGoal}</p>}
              </div>
            </div>
          ))}
        </div>
        {totalMemberPages > 1 && (
          <div className="pagination-row">
            <button className="page-btn" onClick={() => setMemberPage(Math.max(0, memberPage - 1))} disabled={memberPage === 0}><ChevronLeft size={14} /></button>
            {Array.from({ length: Math.min(totalMemberPages, 5) }, (_, i) => {
              const start = Math.max(0, Math.min(memberPage - 2, totalMemberPages - 5));
              const pageNum = start + i;
              if (pageNum >= totalMemberPages) return null;
              return <button key={pageNum} className={`page-btn ${memberPage === pageNum ? "active" : ""}`} onClick={() => setMemberPage(pageNum)}>{pageNum + 1}</button>;
            })}
            <span className="page-info">{memberPage + 1} of {totalMemberPages}</span>
            <button className="page-btn" onClick={() => setMemberPage(Math.min(totalMemberPages - 1, memberPage + 1))} disabled={memberPage === totalMemberPages - 1}><ChevronRight size={14} /></button>
          </div>
        )}
      </div>
    );
    if (activeView === "notifications") return (
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        <div className="rc-header"><Bell size={18} style={{ color: "#f59e0b" }} /><span className="rc-header-name">Notifications</span></div>
        <div className="notif-wrap">
          {notifications.length === 0 ? (
            <div className="empty-state"><Bell size={44} style={{ opacity: 0.12, marginBottom: "12px" }} /><p style={{ fontSize: "15px", fontWeight: 500 }}>No notifications yet</p><p style={{ fontSize: "12px", marginTop: "4px" }}>Activity will appear here</p></div>
          ) : (
            <div className="notif-list">
              {notifications.map((n) => (
                <div key={n.id} className="notif-item">
                  <div className={`notif-icon ${n.type || "system"}`}>{n.type === "join" ? "+" : n.type === "leave" ? "−" : "i"}</div>
                  <p className="notif-text">{n.text}</p>
                  <span className="notif-time">{n.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
    return null;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      {loading && <LoadingScreen text="Switching view..." />}
      <div style={{ display: "flex", height: "100%", width: "100%" }}>
        <RoomSidebar squadId={squadId} squadName={squadName} rooms={rooms} isOwner={isOwner} currentRoomId={activeRoomId} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} onViewChange={handleViewChange} activeView={activeView} notificationCount={notifications.length} onLeaveSquad={handleLeaveSquad} />
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100%", background: "#0a0f18" }}>{renderMain()}</div>
      </div>
    </>
  );
}