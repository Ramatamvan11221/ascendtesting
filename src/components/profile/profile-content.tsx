"use client";

import { useRouter } from "next/navigation";
import { LogOut, Zap, Target, Flame, Star, Clock, Mail, User } from "lucide-react";
import { toast } from "sonner";

const STYLES = `
  .profile-wrap { min-height: 100vh; background: #070c14; padding: 40px; }
  .profile-inner { max-width: 600px; margin: 0 auto; }
  .profile-card { border-radius: 24px; background: rgba(15,22,36,0.5); border: 1px solid rgba(255,255,255,0.05); backdrop-filter: blur(18px); padding: 40px; text-align: center; }
  .profile-avatar { width: 80px; height: 80px; border-radius: 50%; background: rgba(245,158,11,0.1); color: #f59e0b; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 700; margin: 0 auto 16px; }
  .profile-name { font-size: 24px; font-weight: 700; color: #edeff2; }
  .profile-email { font-size: 14px; color: #5a6478; margin-bottom: 20px; }
  .profile-goal { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 999px; background: rgba(245,158,11,0.08); color: #f59e0b; font-size: 13px; border: 1px solid rgba(245,158,11,0.15); margin-bottom: 24px; }
  
  .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 28px; }
  .stat-item { padding: 16px; border-radius: 14px; background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.03); }
  .stat-value { font-size: 22px; font-weight: 700; }
  .stat-label { font-size: 10px; color: #5a6478; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 4px; }
  
  .logout-btn { padding: 12px 32px; border-radius: 12px; border: 1px solid rgba(239,68,68,0.2); background: rgba(239,68,68,0.05); color: #ef4444; cursor: pointer; font-size: 14px; font-weight: 500; font-family: 'Inter', sans-serif; display: flex; align-items: center; gap: 8px; margin: 0 auto; transition: all 0.3s; }
  .logout-btn:hover { background: rgba(239,68,68,0.1); }
  .info-row { display: flex; align-items: center; gap: 8px; color: #5a6478; font-size: 13px; justify-content: center; margin-top: 16px; }
`;

interface UserData {
  name: string; email: string; image: string | null; currentGoal: string | null;
  commitmentLevel: number; xp: number; level: number; streak: number;
  longestStreak: number; createdAt: Date;
}

export function ProfileContent({ user }: { user: UserData }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out");
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="profile-wrap">
        <div className="profile-inner">
          <div className="profile-card">
            <div className="profile-avatar">{user.name?.charAt(0) || "?"}</div>
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email">{user.email}</p>
            {user.currentGoal && (
              <span className="profile-goal"><Target size={13} /> {user.currentGoal}</span>
            )}

            <div className="stats-grid">
              <div className="stat-item">
                <p className="stat-value" style={{ color: "#f59e0b" }}>{user.streak}</p>
                <p className="stat-label">Day Streak</p>
              </div>
              <div className="stat-item">
                <p className="stat-value" style={{ color: "#a78bfa" }}>{user.xp}</p>
                <p className="stat-label">Total XP</p>
              </div>
              <div className="stat-item">
                <p className="stat-value" style={{ color: "#10b981" }}>{user.level}</p>
                <p className="stat-label">Level</p>
              </div>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>

            <div className="info-row">
              <Clock size={13} /> Joined {new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}