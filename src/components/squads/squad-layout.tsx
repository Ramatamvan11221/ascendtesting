"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Hash, BookOpen, Plus, X, ChevronRight, ChevronLeft, Loader2, Trash2, Settings, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const STYLES = `
  .squad-layout-root { display: flex; height: 100vh; overflow: hidden; background: var(--bg-primary); }
  
  /* Sidebar ASCEND — Leftmost */
  .ascend-sidebar {
    width: 220px; height: 100vh; flex-shrink: 0;
    background: var(--bg-secondary); border-right: 1px solid var(--border-subtle);
    backdrop-filter: blur(20px); display: flex; flex-direction: column;
    transition: width 0.3s ease;
  }
  .ascend-sidebar.collapsed { width: 56px; }

  /* Room List Sidebar — Second */
  .room-sidebar {
    width: 240px; height: 100vh; flex-shrink: 0;
    background: var(--bg-tertiary); border-right: 1px solid var(--border-subtle);
    backdrop-filter: blur(16px); display: flex; flex-direction: column;
    transition: width 0.3s ease; overflow: hidden;
  }
  .room-sidebar.collapsed { width: 0; border-right: none; }

  /* Main Content */
  .main-area { flex: 1; min-width: 0; display: flex; flex-direction: column; height: 100vh; }

  /* ASCEND Sidebar Items */
  .ascend-header { padding: 14px; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; gap: 10px; }
  .ascend-logo { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, var(--amber), var(--orange)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ascend-nav { flex: 1; padding: 8px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
  .ascend-nav-item {
    display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 10px;
    color: var(--text-secondary); text-decoration: none; font-size: 13px; font-weight: 500;
    transition: all 0.2s ease; white-space: nowrap;
  }
  .ascend-nav-item:hover { color: var(--text-primary); background: var(--border-subtle); }
  .ascend-nav-item.active { color: var(--amber); background: rgba(245,158,11,0.06); }

  /* Room Sidebar */
  .room-header { padding: 14px; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; }
  .room-header-title { font-size: 13px; font-weight: 600; color: var(--text-primary); }
  .room-list { flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 2px; }
  .room-item {
    display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px;
    color: var(--text-secondary); cursor: pointer; font-size: 13px; transition: all 0.2s ease;
    text-decoration: none;
  }
  .room-item:hover { color: var(--text-primary); background: var(--border-subtle); }
  .room-item.active { color: var(--amber); background: rgba(245,158,11,0.06); }
  .room-icon { flex-shrink: 0; }
  .room-name { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .room-delete { opacity: 0; transition: opacity 0.2s; color: var(--text-muted); cursor: pointer; flex-shrink: 0; }
  .room-item:hover .room-delete { opacity: 1; }
  .room-delete:hover { color: var(--red); }

  /* Create form */
  .create-form { padding: 12px; border-bottom: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 8px; }
  .create-input {
    width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-medium);
    background: var(--bg-input); color: var(--text-primary); font-size: 12px; outline: none;
    font-family: 'Inter', sans-serif;
  }
  .create-input:focus { border-color: rgba(245,158,11,0.4); }
  .create-input::placeholder { color: var(--text-muted); opacity: 0.5; }
  .type-btns { display: flex; gap: 6px; }
  .type-btn {
    flex: 1; padding: 7px 10px; border-radius: 7px; border: 1px solid var(--border-medium);
    background: var(--bg-input); color: var(--text-muted); cursor: pointer;
    font-size: 11px; font-weight: 500; text-align: center; transition: all 0.2s ease;
    font-family: 'Inter', sans-serif;
  }
  .type-btn:hover { border-color: rgba(245,158,11,0.3); color: var(--text-secondary); }
  .type-btn.active { border-color: rgba(245,158,11,0.5); background: rgba(245,158,11,0.08); color: var(--amber); }
  .create-btn {
    width: 100%; padding: 8px; border-radius: 8px; border: none;
    background: linear-gradient(135deg, var(--amber), var(--orange)); color: var(--text-inverse);
    font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;
    font-family: 'Inter', sans-serif;
  }
  .create-btn:hover { transform: scale(1.02); }
  .create-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(0,0,0,0.3); border-top-color: var(--text-inverse); border-radius: 50%; animation: spin 0.6s linear infinite; margin: 0 auto; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Toggle button for room sidebar */
  .room-toggle-btn {
    background: var(--bg-tertiary); border: 1px solid var(--border-subtle);
    border-left: none; border-radius: 0 8px 8px 0;
    color: var(--text-muted); cursor: pointer; padding: 10px 6px;
    align-self: center; height: fit-content;
    transition: all 0.3s ease;
  }
  .room-toggle-btn:hover { color: var(--amber); background: var(--bg-card); }
`;

interface Room {
  id: string;
  name: string;
  type: string;
  order: number;
}

const ASCEND_NAV = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Daily Quest", href: "/tasks", icon: "✅" },
  { name: "Dream Map", href: "/roadmap", icon: "🗺️" },
  { name: "Discover", href: "/squads", icon: "🔍" },
];

export function SquadLayout({
  children,
  squadId,
  squadName,
  rooms: initialRooms,
  isOwner,
  currentRoomId,
}: {
  children: React.ReactNode;
  squadId: string;
  squadName: string;
  rooms: Room[];
  isOwner: boolean;
  currentRoomId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ascendCollapsed, setAscendCollapsed] = useState(false);
  const [roomCollapsed, setRoomCollapsed] = useState(false);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("CHAT");
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!newName.trim() || creating) return;
    setCreating(true);
    try {
      const res = await fetch(`/api/squads/${squadId}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), type: newType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRooms([...rooms, data.room]);
      setNewName("");
      setShowCreate(false);
      toast.success("Room created!");
      router.refresh();
    } catch {
      toast.error("Failed to create room");
    }
    setCreating(false);
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm("Delete this room?")) return;
    try {
      await fetch(`/api/squads/${squadId}/rooms/${roomId}`, { method: "DELETE" });
      setRooms(rooms.filter((r) => r.id !== roomId));
      toast.success("Room deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete room");
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="squad-layout-root">
        {/* ASCEND Sidebar */}
        <div className={`ascend-sidebar ${ascendCollapsed ? "collapsed" : ""}`}>
          <div className="ascend-header">
            <div className="ascend-logo">
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-inverse)" }}>A</span>
            </div>
            {!ascendCollapsed && <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "15px" }}>ASCEND</span>}
          </div>
          <nav className="ascend-nav">
            {ASCEND_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`ascend-nav-item ${pathname === item.href ? "active" : ""}`}
              >
                <span>{item.icon}</span>
                {!ascendCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* Room Sidebar */}
        <div className={`room-sidebar ${roomCollapsed ? "collapsed" : ""}`}>
          {!roomCollapsed && (
            <>
              <div className="room-header">
                <span className="room-header-title">{squadName}</span>
                <div style={{ display: "flex", gap: "4px" }}>
                  {isOwner && (
                    <button
                      onClick={() => setShowCreate(!showCreate)}
                      style={{ background: "none", border: "none", color: showCreate ? "var(--red)" : "var(--text-muted)", cursor: "pointer", padding: "4px" }}
                    >
                      {showCreate ? <X size={16} /> : <Plus size={16} />}
                    </button>
                  )}
                  <button
                    onClick={() => setRoomCollapsed(true)}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                </div>
              </div>

              {/* Create form */}
              <AnimatePresence>
                {showCreate && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="create-form"
                  >
                    <input
                      className="create-input"
                      placeholder="Room name..."
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    />
                    <div className="type-btns">
                      <button className={`type-btn ${newType === "CHAT" ? "active" : ""}`} onClick={() => setNewType("CHAT")}>
                        💬 Chat
                      </button>
                      <button className={`type-btn ${newType === "STUDY" ? "active" : ""}`} onClick={() => setNewType("STUDY")}>
                        📚 Study
                      </button>
                    </div>
                    <button className="create-btn" onClick={handleCreate} disabled={creating || !newName.trim()}>
                      {creating ? <span className="spinner-sm" /> : "Create"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Room list */}
              <div className="room-list">
                {rooms.map((room) => (
                  <Link
                    key={room.id}
                    href={`/squads/${squadId}/rooms/${room.id}`}
                    className={`room-item ${currentRoomId === room.id ? "active" : ""}`}
                  >
                    <span className="room-icon">{room.type === "STUDY" ? "📚" : "💬"}</span>
                    <span className="room-name">{room.name}</span>
                    {isOwner && (
                      <span className="room-delete" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(room.id); }}>
                        <Trash2 size={12} />
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Toggle room sidebar button (when collapsed) */}
        {roomCollapsed && (
          <button
            onClick={() => setRoomCollapsed(false)}
            className="room-toggle-btn"
          >
            <ChevronRight size={16} />
          </button>
        )}

        {/* Main Content */}
        <div className="main-area">{children}</div>
      </div>
    </>
  );
}