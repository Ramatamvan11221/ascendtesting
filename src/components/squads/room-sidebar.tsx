"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Trash2, ChevronLeft, ChevronRight, CheckSquare, Users, Bell, LogOut, Crown, MessageCircle, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { LoadingScreen } from "@/components/ui/loading-screen";

const STYLES = `
  .room-sb { 
    width: 220px; 
    height: 100%; 
    flex-shrink: 0; 
    background: rgba(10,15,24,0.9); 
    border-right: 1px solid rgba(255,255,255,0.04); 
    backdrop-filter: blur(30px); 
    -webkit-backdrop-filter: blur(30px);
    display: flex; 
    flex-direction: column; 
    transition: width 0.35s cubic-bezier(0.22,0.61,0.36,1); 
    overflow: hidden; 
    position: relative;
    z-index: 1;
  }
  .room-sb.collapsed { width: 72px; }
  
  @media (max-width: 1023px) {
    .room-sb { 
      position: fixed; 
      top: 0; 
      left: 0; 
      bottom: 0; 
      width: 280px; 
      transform: translateX(-100%); 
      z-index: 50;
      transition: transform 0.35s cubic-bezier(0.22,0.61,0.36,1);
    }
    .room-sb.mobile-shown { 
      transform: translateX(0); 
      box-shadow: 20px 0 60px rgba(0,0,0,0.5); 
    }
    .room-sb.collapsed { width: 280px; }
  }

  .room-sb-header { 
    padding: 18px 18px; 
    border-bottom: 1px solid rgba(255,255,255,0.04); 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    min-height: 64px;
  }
  .room-sb-title { 
    font-size: 17px; 
    font-weight: 700; 
    color: #edeff2; 
    overflow: hidden; 
    text-overflow: ellipsis; 
    white-space: nowrap; 
    letter-spacing: 0.03em;
  }
  .room-sb-actions { display: flex; gap: 4px; }
  .room-sb-btn { 
    background: none; 
    border: none; 
    color: #5a6478; 
    cursor: pointer; 
    padding: 6px; 
    border-radius: 8px; 
    transition: all 0.3s ease; 
    display: flex; 
    align-items: center;
    justify-content: center;
  }
  .room-sb-btn:hover { color: #f59e0b; background: rgba(245,158,11,0.06); }
  
  .room-sb-list { 
    flex: 1; 
    overflow-y: auto; 
    padding: 14px 10px; 
    display: flex; 
    flex-direction: column; 
    gap: 3px; 
  }
  .room-sb-item {
    display: flex; 
    align-items: center; 
    gap: 12px; 
    padding: 10px 14px; 
    border-radius: 12px;
    color: #9aa4b8; 
    cursor: pointer; 
    font-size: 13px; 
    font-weight: 500;
    transition: all 0.3s ease; 
    text-decoration: none; 
    white-space: nowrap; 
    border: none; 
    background: none; 
    width: 100%; 
    text-align: left; 
    font-family: 'Inter', sans-serif;
    position: relative;
  }
  .room-sb-item:hover { color: #edeff2; background: rgba(255,255,255,0.02); }
  .room-sb-item.active { 
    color: #f59e0b; 
    background: rgba(245,158,11,0.06); 
    border: 1px solid rgba(245,158,11,0.12);
    box-shadow: 0 0 20px rgba(245,158,11,0.04);
  }
  .room-sb-item.active::before {
    content: ''; 
    position: absolute; 
    left: 0; 
    top: 10px; 
    bottom: 10px;
    width: 2px; 
    background: #f59e0b; 
    border-radius: 0 2px 2px 0;
  }
  .room-sb-item.danger { color: #5a6478; }
  .room-sb-item.danger:hover { color: #ef4444; background: rgba(239,68,68,0.04); }
  .room-sb-icon { flex-shrink: 0; }
  .room-sb-name { flex: 1; overflow: hidden; text-overflow: ellipsis; }
  .room-sb-del { 
    opacity: 0; 
    color: #5a6478; 
    cursor: pointer; 
    flex-shrink: 0; 
  }
  .room-sb-item:hover .room-sb-del { opacity: 1; }
  .room-sb-del:hover { color: #ef4444; }
  .notif-badge { 
    margin-left: auto; 
    background: #ef4444; 
    color: #fff; 
    font-size: 10px; 
    padding: 2px 6px; 
    border-radius: 999px; 
    font-weight: 600; 
    min-width: 18px; 
    text-align: center; 
  }

  .room-sb.collapsed .room-sb-item { justify-content: center; padding: 10px; }
  .room-sb.collapsed .room-sb-item::before { display: none; }
  .room-sb.collapsed .notif-badge { position: absolute; top: 4px; right: 4px; margin-left: 0; }

  .create-inline { 
    padding: 10px 12px; 
    border-bottom: 1px solid rgba(255,255,255,0.04); 
    display: flex; 
    flex-direction: column; 
    gap: 6px; 
  }
  .create-input { 
    width: 100%; 
    padding: 8px 10px; 
    border-radius: 8px; 
    border: 1px solid rgba(255,255,255,0.06); 
    background: rgba(255,255,255,0.02); 
    color: #edeff2; 
    font-size: 12px; 
    outline: none; 
    font-family: 'Inter', sans-serif; 
  }
  .create-input:focus { border-color: rgba(245,158,11,0.4); }
  .create-input::placeholder { color: #3a4458; }
  .type-row { display: flex; gap: 4px; }
  .type-opt { 
    flex: 1; 
    padding: 6px 8px; 
    border-radius: 7px; 
    border: 1px solid rgba(255,255,255,0.05); 
    background: rgba(255,255,255,0.015); 
    color: #5a6478; 
    cursor: pointer; 
    font-size: 10px; 
    font-weight: 500; 
    text-align: center; 
    transition: all 0.2s; 
    font-family: 'Inter', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
  .type-opt:hover { border-color: rgba(245,158,11,0.3); color: #9aa4b8; }
  .type-opt.sel { border-color: rgba(245,158,11,0.5); background: rgba(245,158,11,0.08); color: #f59e0b; }
  .create-submit { 
    width: 100%; 
    padding: 8px; 
    border-radius: 8px; 
    border: none; 
    background: linear-gradient(135deg, #f59e0b, #f97316); 
    color: #0a0a0a; 
    font-size: 12px; 
    font-weight: 600; 
    cursor: pointer; 
    font-family: 'Inter', sans-serif; 
  }
  .create-submit:disabled { opacity: 0.4; cursor: not-allowed; }

  .section-label { 
    font-size: 10px; 
    font-weight: 600; 
    color: #5a6478; 
    text-transform: uppercase; 
    letter-spacing: 0.1em; 
    padding: 8px 14px 4px; 
  }

  .room-sb-bottom { 
    padding: 14px 10px; 
    border-top: 1px solid rgba(255,255,255,0.04); 
    display: flex; 
    flex-direction: column; 
    gap: 6px; 
  }
  .room-sb.collapsed .room-sb-bottom .room-sb-item { justify-content: center; }

  .mobile-overlay { 
    position: fixed; 
    inset: 0; 
    z-index: 40; 
    background: rgba(0,0,0,0.5); 
  }

  /* TOGGLE BUTTON - di kiri tengah */
  .sidebar-toggle {
    position: fixed;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    z-index: 35;
    width: 28px;
    height: 56px;
    background: rgba(245,158,11,0.12);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(245,158,11,0.2);
    border-left: none;
    border-radius: 0 10px 10px 0;
    color: #f59e0b;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    padding: 0;
  }
  .sidebar-toggle:hover {
    background: rgba(245,158,11,0.2);
    width: 32px;
  }
  .sidebar-toggle svg {
    width: 16px;
    height: 16px;
  }
  
  /* Hanya tampil di mobile */
  @media(max-width:1023px) { 
    .sidebar-toggle { 
      display: flex; 
    } 
  }

  @media(min-width:1024px){ 
    .mobile-close{display:none!important;} 
  }
  @media(max-width:1023px){ 
    .desktop-collapse{display:none!important;} 
  }

  /* Animasi slide untuk toggle button */
  .sidebar-toggle.hidden {
    transform: translateY(-50%) translateX(-100%);
    opacity: 0;
    pointer-events: none;
  }
`;

interface Room { id: string; name: string; type: string; order: number; }

export function RoomSidebar({
  squadId, squadName, rooms: initialRooms, isOwner, currentRoomId,
  collapsed, onToggle, onViewChange, activeView, notificationCount,
  onLeaveSquad,
}: {
  squadId: string; squadName: string; rooms: Room[]; isOwner: boolean;
  currentRoomId?: string; collapsed: boolean; onToggle: () => void;
  onViewChange: (view: string, roomId?: string) => void;
  activeView: string; notificationCount: number;
  onLeaveSquad: () => void;
}) {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("CHAT");
  const [creating, setCreating] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Untuk swipe detection
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  useEffect(() => { setRooms(initialRooms); }, [initialRooms]);

  // Handle swipe dari kiri
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX.current;
      const diffY = touchEndY - touchStartY.current;

      // Swipe dari kiri ke kanan (lebih dari 50px) dan bukan swipe vertikal
      if (diffX > 50 && Math.abs(diffX) > Math.abs(diffY) && touchStartX.current < 30) {
        setMobileOpen(true);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const handleCreate = async () => {
    if (!newName.trim() || creating) return;
    setCreating(true);
    try {
      const res = await fetch(`/api/squads/${squadId}/rooms`, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ name: newName.trim(), type: newType }) 
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRooms([...rooms, data.room]);
      setNewName("");
      setShowCreate(false);
      toast.success("Room created!");
      router.refresh();
    } catch { 
      toast.error("Failed"); 
    }
    setCreating(false);
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm("Delete this room? All messages will be lost.")) return;
    setLoading(true);
    try {
      await fetch(`/api/squads/${squadId}/rooms/${roomId}`, { method: "DELETE" });
    const remaining = rooms.filter((r) => r.id !== roomId);
    setRooms(remaining);
    toast.success("Room deleted");
    
    if (currentRoomId === roomId) {
      setTimeout(() => {
        if (remaining.length > 0) {
          onViewChange(remaining[0].type === "CHAT" ? "chat" : "study", remaining[0].id);
          } else {
            onViewChange("welcome");
          }
          setLoading(false);
        }, 500);
      } else {
        setLoading(false);
      }
      router.refresh();
    } catch { toast.error("Failed"); setLoading(false); }
  };

  const isRoomActive = (roomId: string) => {
    return currentRoomId === roomId && (activeView === "chat" || activeView === "study");
  };

  const isSquadActionActive = (view: string) => {
    return activeView === view;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      {loading && <LoadingScreen text="Deleting room..." />}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            className="mobile-overlay" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setMobileOpen(false)} 
          />
        )}
      </AnimatePresence>

      <div className={`room-sb ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-shown' : ''}`}>
        <div className="room-sb-header">
          <span className="room-sb-title">{squadName}</span>
          <div className="room-sb-actions">
            {isOwner && (
              <button className="room-sb-btn" onClick={() => setShowCreate(!showCreate)}>
                {showCreate ? <X size={16} /> : <Plus size={16} />}
              </button>
            )}
            <button className="room-sb-btn mobile-close" onClick={() => setMobileOpen(false)}>
              <ChevronLeft size={16} />
            </button>
            <button className="room-sb-btn desktop-collapse" onClick={onToggle}>
              <ChevronLeft size={16} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.35s ease' }} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showCreate && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }} 
              className="create-inline"
            >
              <input 
                className="create-input" 
                placeholder="Room name" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                autoFocus 
                onKeyDown={(e) => e.key === "Enter" && handleCreate()} 
              />
              <div className="type-row">
                <button 
                  className={`type-opt ${newType === "CHAT" ? "sel" : ""}`} 
                  onClick={() => setNewType("CHAT")}
                >
                  <MessageCircle size={14} /> Chat
                </button>
                <button 
                  className={`type-opt ${newType === "STUDY" ? "sel" : ""}`} 
                  onClick={() => setNewType("STUDY")}
                >
                  <BookOpen size={14} /> Study
                </button>
              </div>
              <button 
                className="create-submit" 
                onClick={handleCreate} 
                disabled={creating || !newName.trim()}
              >
                Create
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="room-sb-list" style={{ flex: "none" }}>
          <p className="section-label">Rooms</p>
          {rooms.map((room) => {
            const isActive = isRoomActive(room.id);
            return (
              <button 
                key={room.id} 
                className={`room-sb-item ${isActive ? "active" : ""}`}
                onClick={() => {
                  onViewChange(room.type === "CHAT" ? "chat" : "study", room.id);
                  setMobileOpen(false);
                }}
              >
                <span className="room-sb-icon">
                  {room.type === "CHAT" ? <MessageCircle size={19} /> : <BookOpen size={19} />}
                </span>
                {!collapsed && <span className="room-sb-name">{room.name}</span>}
                {isOwner && !collapsed && (
                  <span 
                    className="room-sb-del" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleDelete(room.id); 
                    }}
                  >
                    <Trash2 size={12} />
                  </span>
                )}
              </button>
            );
          })}
          {rooms.length === 0 && !collapsed && (
            <p style={{ fontSize: "12px", color: "#3a4458", padding: "4px 14px" }}>No rooms yet</p>
          )}
        </div>

        <div className="room-sb-list">
          <p className="section-label">Squad</p>
          <button 
            className={`room-sb-item ${isSquadActionActive("tasks") ? "active" : ""}`} 
            onClick={() => {
              onViewChange("tasks");
              setMobileOpen(false);
            }}
          >
            <CheckSquare size={19} /> 
            {!collapsed && <span>Squad Tasks</span>}
          </button>
          <button 
            className={`room-sb-item ${isSquadActionActive("members") ? "active" : ""}`} 
            onClick={() => {
              onViewChange("members");
              setMobileOpen(false);
            }}
          >
            <Users size={19} /> 
            {!collapsed && <span>Members</span>}
          </button>
          <button 
            className={`room-sb-item ${isSquadActionActive("notifications") ? "active" : ""}`} 
            onClick={() => {
              onViewChange("notifications");
              setMobileOpen(false);
            }}
          >
            <Bell size={19} /> 
            {!collapsed && <span>Notifications</span>}
            {notificationCount > 0 && <span className="notif-badge">{notificationCount}</span>}
          </button>
        </div>

        <div className="room-sb-bottom">
          <button className="room-sb-item danger" onClick={onLeaveSquad}>
            <LogOut size={17} /> 
            {!collapsed && <span>Leave Squad</span>}
          </button>
        </div>
      </div>

      {/* Toggle Button - di kiri tengah */}
      <motion.button 
        className={`sidebar-toggle ${mobileOpen ? 'hidden' : ''}`}
        onClick={() => setMobileOpen(true)}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ChevronRight size={16} />
      </motion.button>
    </>
  );
}