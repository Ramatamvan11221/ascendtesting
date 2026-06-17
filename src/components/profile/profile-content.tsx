"use client";

import { useRouter } from "next/navigation";
import { LogOut, Target, Flame, Star, Clock, Zap, Crown, TrendingUp, Shield } from "lucide-react";
import { toast } from "sonner";

const STYLES = `
  .pf-wrap{min-height:100vh;background:radial-gradient(ellipse at 50% 0%,rgba(245,158,11,0.04),transparent 60%),#070c14;padding:20px 14px;display:flex;align-items:center;justify-content:center;}
  @media(min-width:480px){.pf-wrap{padding:28px 20px;}}
  @media(min-width:768px){.pf-wrap{padding:40px 32px;}}
  .pf-inner{width:100%;max-width:560px;}
  .pf-card{border-radius:20px;background:rgba(15,22,36,0.55);border:1px solid rgba(255,255,255,0.05);backdrop-filter:blur(18px);padding:28px 20px;text-align:center;position:relative;overflow:hidden;}
  @media(min-width:480px){.pf-card{padding:36px 28px;border-radius:24px;}}
  @media(min-width:768px){.pf-card{padding:40px;}}
  .pf-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(245,158,11,0.4),rgba(249,115,22,0.3),transparent);}
  .pf-avatar{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,rgba(245,158,11,0.15),rgba(249,115,22,0.1));color:#f59e0b;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;margin:0 auto 12px;border:2px solid rgba(245,158,11,0.2);}
  @media(min-width:480px){.pf-avatar{width:80px;height:80px;font-size:32px;margin-bottom:16px;}}
  .pf-name{font-size:20px;font-weight:700;color:#edeff2;margin-bottom:2px;}
  @media(min-width:480px){.pf-name{font-size:24px;}}
  .pf-email{font-size:12px;color:#5a6478;margin-bottom:14px;}
  @media(min-width:480px){.pf-email{font-size:14px;margin-bottom:20px;}}
  .pf-goal{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:999px;background:rgba(245,158,11,0.08);color:#f59e0b;font-size:11px;border:1px solid rgba(245,158,11,0.15);margin-bottom:20px;}
  @media(min-width:480px){.pf-goal{font-size:13px;padding:6px 14px;margin-bottom:24px;}}

  .pf-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:24px;}
  @media(min-width:480px){.pf-stats{gap:12px;margin-bottom:28px;}}
  .pf-stat{padding:14px 8px;border-radius:12px;background:rgba(255,255,255,0.015);border:1px solid rgba(255,255,255,0.03);transition:all 0.2s;}
  @media(min-width:480px){.pf-stat{padding:16px 12px;border-radius:14px;}}
  .pf-stat:hover{border-color:rgba(245,158,11,0.1);background:rgba(255,255,255,0.02);}
  .pf-stat-value{font-size:18px;font-weight:700;}
  @media(min-width:480px){.pf-stat-value{font-size:22px;}}
  .pf-stat-label{font-size:9px;color:#5a6478;text-transform:uppercase;letter-spacing:0.06em;margin-top:3px;}
  @media(min-width:480px){.pf-stat-label{font-size:10px;margin-top:4px;}}

  .pf-extra{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:24px;}
  @media(min-width:480px){.pf-extra{gap:12px;margin-bottom:28px;}}
  .pf-extra-item{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:10px;background:rgba(255,255,255,0.015);border:1px solid rgba(255,255,255,0.03);font-size:11px;color:#9aa4b8;}
  @media(min-width:480px){.pf-extra-item{padding:12px 16px;border-radius:12px;font-size:12px;}}

  .pf-logout{padding:10px 28px;border-radius:10px;border:1px solid rgba(239,68,68,0.2);background:rgba(239,68,68,0.05);color:#ef4444;cursor:pointer;font-size:13px;font-weight:500;font-family:'Inter',sans-serif;display:flex;align-items:center;gap:6px;margin:0 auto;transition:all 0.3s;}
  @media(min-width:480px){.pf-logout{padding:12px 32px;border-radius:12px;font-size:14px;}}
  .pf-logout:hover{background:rgba(239,68,68,0.1);transform:scale(1.02);}
  .pf-joined{display:flex;align-items:center;gap:6px;color:#5a6478;font-size:11px;justify-content:center;margin-top:14px;}
  @media(min-width:480px){.pf-joined{font-size:13px;margin-top:16px;}}
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
      <div className="pf-wrap">
        <div className="pf-inner">
          <div className="pf-card">
            {/* Avatar */}
            <div className="pf-avatar">{user.name?.charAt(0) || "?"}</div>
            <h1 className="pf-name">{user.name}</h1>
            <p className="pf-email">{user.email}</p>

            {/* Goal */}
            {user.currentGoal && (
              <span className="pf-goal"><Target size={12} />{user.currentGoal}</span>
            )}

            {/* Stats */}
            <div className="pf-stats">
              <div className="pf-stat">
                <p className="pf-stat-value" style={{ color: "#f59e0b" }}>{user.streak}</p>
                <p className="pf-stat-label">Day Streak</p>
              </div>
              <div className="pf-stat">
                <p className="pf-stat-value" style={{ color: "#a78bfa" }}>{user.xp}</p>
                <p className="pf-stat-label">Total XP</p>
              </div>
              <div className="pf-stat">
                <p className="pf-stat-value" style={{ color: "#10b981" }}>{user.level}</p>
                <p className="pf-stat-label">Level</p>
              </div>
            </div>

            {/* Extra info */}
            <div className="pf-extra">
              <div className="pf-extra-item">
                <Flame size={14} style={{ color: "#f97316" }} />
                <span>Best Streak: <strong style={{ color: "#edeff2" }}>{user.longestStreak}</strong></span>
              </div>
              <div className="pf-extra-item">
                <Star size={14} style={{ color: "#f59e0b" }} />
                <span>Commitment: <strong style={{ color: "#edeff2" }}>{user.commitmentLevel}/10</strong></span>
              </div>
            </div>

            {/* Logout */}
            <button className="pf-logout" onClick={handleLogout}>
              <LogOut size={15} /> Logout
            </button>

            {/* Joined */}
            <div className="pf-joined">
              <Clock size={12} />
              Joined {new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}