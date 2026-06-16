"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import { toast } from "sonner";

const STYLES = `
  :root {
    --bg-deep: #070c14;
    --text: #edeff2;
    --text-secondary: #9aa4b8;
    --text-muted: #5a6478;
    --accent: #f59e0b;
    --border: rgba(255,255,255,0.05);
  }
  .create-wrap { min-height: 100vh; background: var(--bg-deep); padding: 32px; display: flex; align-items: center; justify-content: center; }
  .create-card { width: 100%; max-width: 460px; border-radius: 22px; background: rgba(15,22,36,0.55); border: 1px solid var(--border); backdrop-filter: blur(18px); padding: 36px; }
  .back-link { display: inline-flex; align-items: center; gap: 6px; color: #5a6478; text-decoration: none; font-size: 13px; margin-bottom: 28px; transition: color 0.3s; }
  .back-link:hover { color: #f59e0b; }
  .form-title { font-size: 24px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
  .form-sub { font-size: 13px; color: var(--text-muted); margin-bottom: 28px; }
  .form-group { margin-bottom: 18px; }
  .form-label { font-size: 11px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block; letter-spacing: 0.06em; text-transform: uppercase; }
  .form-input {
    width: 100%; padding: 12px 16px; border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02);
    color: var(--text); font-size: 14px; font-family: 'Inter', sans-serif; outline: none;
    transition: all 0.3s ease;
  }
  .form-input:focus { border-color: rgba(245,158,11,0.4); box-shadow: 0 0 0 4px rgba(245,158,11,0.04); }
  .form-input::placeholder { color: #3a4458; }
  .type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .type-opt {
    padding: 16px; border-radius: 14px; border: 2px solid rgba(255,255,255,0.05);
    background: rgba(255,255,255,0.015); cursor: pointer; text-align: center;
    transition: all 0.25s ease; display: flex; flex-direction: column; align-items: center; gap: 6px;
  }
  .type-opt:hover { border-color: rgba(245,158,11,0.3); background: rgba(245,158,11,0.03); }
  .type-opt.sel { border-color: rgba(245,158,11,0.5); background: rgba(245,158,11,0.08); }
  .type-icon { font-size: 28px; }
  .type-label { font-size: 13px; font-weight: 600; color: #edeff2; }
  .type-desc { font-size: 10px; color: #5a6478; }
  .submit-btn {
    width: 100%; padding: 14px; border-radius: 14px; margin-top: 8px;
    background: linear-gradient(135deg, #f59e0b, #f97316);
    color: #0a0a0a; font-size: 15px; font-weight: 600;
    border: none; cursor: pointer; font-family: 'Inter', sans-serif;
    transition: all 0.3s ease;
  }
  .submit-btn:hover { transform: scale(1.02); box-shadow: 0 16px 40px -12px rgba(245,158,11,0.4); }
  .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .spinner { width: 18px; height: 18px; border: 2px solid rgba(0,0,0,0.3); border-top-color: #0a0a0a; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 6px; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export default function CreateRoomPage() {
  const router = useRouter();
  const params = useParams();
  const squadId = params.id as string;

  const [name, setName] = useState("");
  const [type, setType] = useState("CHAT");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/squads/${squadId}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success("Room created!");
      router.push(`/squads/${squadId}`);
      router.refresh();
    } catch {
      toast.error("Failed to create room");
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="create-wrap">
        <div className="create-card">
          <Link href={`/squads/${squadId}`} className="back-link"><ArrowLeft size={14} /> Back to Squad</Link>
          <h1 className="form-title">Create Room</h1>
          <p className="form-sub">Add a new room to your squad</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Room Name</label>
              <input className="form-input" placeholder="e.g., general-chat" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
            </div>

            <div className="form-group">
              <label className="form-label">Room Type</label>
              <div className="type-grid">
                <div className={`type-opt ${type === "CHAT" ? "sel" : ""}`} onClick={() => setType("CHAT")}>
                  <span className="type-icon">💬</span>
                  <span className="type-label">Chat Room</span>
                  <span className="type-desc">Text discussions</span>
                </div>
                <div className={`type-opt ${type === "STUDY" ? "sel" : ""}`} onClick={() => setType("STUDY")}>
                  <span className="type-icon">📚</span>
                  <span className="type-label">Study Room</span>
                  <span className="type-desc">Focus together</span>
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading || !name.trim()}>
              {loading && <span className="spinner" />}
              {loading ? "Creating..." : "Create Room"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}