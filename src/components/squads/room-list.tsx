"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  Mic, Video, BookOpen, Plus, X, Hash, Loader2, Settings, Users, ChevronRight
} from "lucide-react";

const STYLES = `
  .room-list-wrap { display: flex; flex-direction: column; height: 100%; }
  
  .room-header { padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .room-header-title { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
  .room-title { font-size: 11px; font-weight: 600; color: #5a6478; text-transform: uppercase; letter-spacing: 0.12em; display: flex; align-items: center; gap: 8px; }
  
  .room-add-btn {
    background: none; border: none; color: #5a6478; cursor: pointer;
    padding: 4px 6px; border-radius: 6px; transition: all 0.25s ease;
    display: flex; align-items: center; justify-content: center;
  }
  .room-add-btn:hover { color: #f59e0b; background: rgba(245,158,11,0.08); }

  /* Create form */
  .create-form { overflow: hidden; }
  .create-inner { padding: 0 16px 12px; display: flex; flex-direction: column; gap: 8px; }
  .create-input {
    width: 100%; padding: 9px 14px; border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02);
    color: #edeff2; font-size: 13px; font-family: 'Inter', sans-serif; outline: none;
    transition: all 0.3s ease;
  }
  .create-input:focus { border-color: rgba(245,158,11,0.4); box-shadow: 0 0 0 3px rgba(245,158,11,0.04); }
  .create-input::placeholder { color: #3a4458; }

  .type-row { display: flex; gap: 4px; flex-wrap: wrap; }
  .type-btn {
    padding: 5px 10px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.05);
    background: rgba(255,255,255,0.015); cursor: pointer;
    font-size: 11px; font-weight: 500; color: #5a6478;
    transition: all 0.25s ease; display: flex; align-items: center; gap: 4px;
    font-family: 'Inter', sans-serif;
  }
  .type-btn:hover { border-color: rgba(245,158,11,0.3); color: #9aa4b8; }
  .type-btn.active { border-color: rgba(245,158,11,0.4); background: rgba(245,158,11,0.08); color: #f59e0b; }

  .create-submit {
    width: 100%; padding: 8px; border-radius: 10px;
    background: linear-gradient(135deg, #f59e0b, #f97316);
    color: #0a0a0a; font-size: 12px; font-weight: 600;
    border: none; cursor: pointer; font-family: 'Inter', sans-serif;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: all 0.3s ease;
  }
  .create-submit:hover { transform: scale(1.02); }
  .create-submit:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  /* Room items */
  .room-list { flex: 1; overflow-y: auto; padding: 6px 8px; display: flex; flex-direction: column; gap: 2px; }
  .room-item {
    display: flex; align-items: center; gap: 10px; padding: 9px 12px;
    border-radius: 10px; cursor: pointer; transition: all 0.25s ease;
    color: #9aa4b8; font-size: 13px; font-weight: 400;
    border: 1px solid transparent; position: relative;
  }
  .room-item:hover { color: #edeff2; background: rgba(255,255,255,0.02); }
  .room-item.active { color: #f59e0b; background: rgba(245,158,11,0.05); border-color: rgba(245,158,11,0.1); }
  .room-item.active::before { content: ''; position: absolute; left: 0; top: 6px; bottom: 6px; width: 2px; background: #f59e0b; border-radius: 0 2px 2px 0; }
  .room-icon { flex-shrink: 0; }
  .room-name { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  
  .live-badge {
    padding: 2px 7px; border-radius: 999px; font-size: 9px; font-weight: 600;
    background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.15);
    letter-spacing: 0.04em; flex-shrink: 0;
  }

  .empty-rooms { text-align: center; padding: 32px 16px; font-size: 12px; color: #3a4458; }

  .room-footer { padding: 10px 8px; border-top: 1px solid rgba(255,255,255,0.04); }
  .settings-btn {
    display: flex; align-items: center; gap: 8px; padding: 8px 12px;
    border-radius: 10px; background: none; border: none; cursor: pointer;
    width: 100%; font-size: 12px; color: #5a6478; font-family: 'Inter', sans-serif;
    transition: all 0.25s ease;
  }
  .settings-btn:hover { color: #9aa4b8; background: rgba(255,255,255,0.02); }
`;

interface Room {
  id: string;
  name: string;
  type: string;
  order: number;
  _count?: { roomMessages: number };
}

const ROOM_TYPES = [
  { type: "CHAT", icon: Hash, label: "Chat", color: "#9aa4b8" },
  { type: "VOICE", icon: Mic, label: "Voice", color: "#10b981" },
  { type: "VIDEO", icon: Video, label: "Video", color: "#3b82f6" },
  { type: "STUDY", icon: BookOpen, label: "Study", color: "#f59e0b" },
];

export function RoomList({ 
  squadId, 
  isOwner, 
  initialRooms = [] 
}: { 
  squadId: string; 
  isOwner: boolean;
  initialRooms: Room[];
}) {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomType, setNewRoomType] = useState("CHAT");
  const [creating, setCreating] = useState(false);

  const handleCreateRoom = async () => {
    if (!newRoomName.trim() || creating) return;
    setCreating(true);
    try {
      const res = await fetch(`/api/squads/${squadId}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newRoomName.trim(), type: newRoomType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setRooms([...rooms, data.room]);
      setNewRoomName("");
      setShowCreate(false);
      toast.success("Room created!");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create room";
      toast.error(message);
    }
    setCreating(false);
  };

  const getRoomIcon = (type: string) => ROOM_TYPES.find((r) => r.type === type)?.icon || Hash;
  const getRoomColor = (type: string) => ROOM_TYPES.find((r) => r.type === type)?.color || "#9aa4b8";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="room-list-wrap">
        {/* Header */}
        <div className="room-header">
          <div className="room-header-title">
            <p className="room-title"><Users size={14} /> Rooms</p>
            {isOwner && (
              <button className="room-add-btn" onClick={() => setShowCreate(!showCreate)}>
                {showCreate ? <X size={16} /> : <Plus size={16} />}
              </button>
            )}
          </div>

          {/* Create Form */}
          <AnimatePresence>
            {showCreate && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="create-form"
              >
                <div className="create-inner">
                  <input
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="Room name..."
                    className="create-input"
                    onKeyDown={(e) => e.key === "Enter" && handleCreateRoom()}
                    autoFocus
                  />
                  <div className="type-row">
                    {ROOM_TYPES.map((rt) => (
                      <button
                        key={rt.type}
                        onClick={() => setNewRoomType(rt.type)}
                        className={`type-btn ${newRoomType === rt.type ? "active" : ""}`}
                      >
                        <rt.icon size={12} /> {rt.label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleCreateRoom}
                    disabled={!newRoomName.trim() || creating}
                    className="create-submit"
                  >
                    {creating ? <Loader2 size={14} className="spin" /> : "Create Room"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Room List */}
        <div className="room-list">
          {rooms.length === 0 && !showCreate && (
            <p className="empty-rooms">No rooms yet</p>
          )}
          <AnimatePresence>
            {rooms.map((room, index) => {
              const Icon = getRoomIcon(room.type);
              const color = getRoomColor(room.type);

              return (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => {
                    setActiveRoomId(room.id);
                    router.push(`/squads/${squadId}/rooms/${room.id}`);
                  }}
                  className={`room-item ${activeRoomId === room.id ? "active" : ""}`}
                >
                  <Icon size={15} className="room-icon" style={{ color }} />
                  <span className="room-name">{room.name}</span>
                  {room.type === "STUDY" && <span className="live-badge">LIVE</span>}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="room-footer">
          <button className="settings-btn">
            <Settings size={14} /> Squad Settings
          </button>
        </div>
      </div>
      <style>{`.spin { animation: spin 0.6s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}