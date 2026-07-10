"use client";

import Link from "next/link";
import { Users, Hash, Crown, ArrowLeft, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { JoinButton } from "@/app/squads/[id]/join-button";

const STYLES = `
  .sland-wrap{min-height:100vh;background:radial-gradient(ellipse at 50% 30%,rgba(245,158,11,0.05),transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(249,115,22,0.03),transparent 50%),var(--bg-primary);display:flex;align-items:center;justify-content:center;padding:16px;position:relative;overflow:hidden;}
  @media(min-width:480px){.sland-wrap{padding:24px;}}
  @media(min-width:768px){.sland-wrap{padding:32px;}}
  .sland-orb{position:absolute;border-radius:50%;pointer-events:none;filter:blur(80px);opacity:0.06;}
  .sland-orb-1{width:300px;height:300px;background:var(--amber);top:-10%;left:-5%;animation:orbFloat1 15s ease-in-out infinite;}
  .sland-orb-2{width:220px;height:220px;background:var(--orange);bottom:-8%;right:-5%;animation:orbFloat2 18s ease-in-out infinite;}
  @media(min-width:480px){.sland-orb-1{width:400px;height:400px;}.sland-orb-2{width:300px;height:300px;}}
  @keyframes orbFloat1{0%,100%{transform:translate(0,0)}50%{transform:translate(40px,-30px)}}
  @keyframes orbFloat2{0%,100%{transform:translate(0,0)}50%{transform:translate(-30px,20px)}}

  .sland-card{max-width:520px;width:100%;text-align:center;padding:36px 20px;border-radius:24px;background:var(--bg-card);border:1px solid var(--border-subtle);backdrop-filter:blur(24px);position:relative;z-index:10;}
  @media(min-width:480px){.sland-card{padding:48px 36px;border-radius:28px;}}
  @media(min-width:768px){.sland-card{padding:56px 44px;}}
  .sland-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(245,158,11,0.4),rgba(249,115,22,0.3),transparent);border-radius:2px 2px 0 0;}

  .sland-icon-wrap{display:inline-block;position:relative;margin-bottom:20px;}
  @media(min-width:480px){.sland-icon-wrap{margin-bottom:24px;}}
  .sland-icon{width:64px;height:64px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:30px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.15);margin:0 auto;position:relative;z-index:2;transition:all 0.3s ease;}
  @media(min-width:480px){.sland-icon{width:80px;height:80px;border-radius:22px;font-size:38px;}}
  .sland-icon:hover{background:rgba(245,158,11,0.14);transform:scale(1.05);}
  .sland-icon-ring{position:absolute;inset:-4px;border-radius:20px;border:2px solid rgba(245,158,11,0.1);animation:ringPulse 3s ease-in-out infinite;}
  @media(min-width:480px){.sland-icon-ring{inset:-6px;border-radius:26px;}}
  @keyframes ringPulse{0%,100%{transform:scale(1);opacity:0.4}50%{transform:scale(1.1);opacity:0.1}}

  .sland-name{font-size:24px;font-weight:700;color:var(--text-primary);letter-spacing:-0.02em;margin-bottom:8px;}
  @media(min-width:480px){.sland-name{font-size:32px;letter-spacing:-0.03em;}}
  .sland-badges{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:16px;}
  @media(min-width:480px){.sland-badges{margin-bottom:20px;}}
  .sland-badge{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:999px;font-size:10px;font-weight:600;letter-spacing:0.03em;}
  @media(min-width:480px){.sland-badge{font-size:11px;padding:6px 14px;}}
  .badge-category{background:rgba(245,158,11,0.08);color:var(--amber);border:1px solid rgba(245,158,11,0.15);}
  .badge-owner{background:rgba(249,115,22,0.06);color:var(--orange);border:1px solid rgba(249,115,22,0.12);}

  .sland-goal{display:flex;align-items:center;gap:6px;justify-content:center;font-size:13px;color:var(--text-secondary);margin-bottom:12px;font-weight:500;}
  @media(min-width:480px){.sland-goal{font-size:15px;}}
  .sland-desc{font-size:13px;color:var(--text-muted);line-height:1.7;margin-bottom:24px;max-width:420px;margin-left:auto;margin-right:auto;}
  @media(min-width:480px){.sland-desc{font-size:14px;margin-bottom:28px;}}

  .stats-row{display:flex;justify-content:center;gap:24px;margin-bottom:24px;padding:16px 0;border-top:1px solid var(--border-subtle);border-bottom:1px solid var(--border-subtle);}
  @media(min-width:480px){.stats-row{gap:40px;margin-bottom:32px;padding:20px 0;}}
  .stat-item{text-align:center;}
  .stat-value{font-size:20px;font-weight:700;color:var(--text-primary);letter-spacing:-0.02em;}
  @media(min-width:480px){.stat-value{font-size:24px;}}
  .stat-label{font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-top:3px;font-weight:500;}
  @media(min-width:480px){.stat-label{font-size:10px;}}
  .stat-icon-row{display:flex;justify-content:center;gap:3px;margin-top:5px;}
  .stat-avatar{width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;color:#fff;}
  @media(min-width:480px){.stat-avatar{width:20px;height:20px;font-size:9px;}}

  .sland-join{margin-bottom:20px;}
  @media(min-width:480px){.sland-join{margin-bottom:24px;}}
  .sland-back{display:inline-flex;align-items:center;gap:5px;color:var(--text-muted);font-size:12px;text-decoration:none;transition:color 0.3s;}
  @media(min-width:480px){.sland-back{font-size:13px;}}
  .sland-back:hover{color:var(--text-secondary);}

  .sland-join-btn{display:inline-flex;padding:12px 28px;border-radius:12px;background:linear-gradient(135deg,var(--amber),var(--orange));color:var(--text-inverse);font-size:14px;font-weight:600;text-decoration:none;box-shadow:0 12px 30px -10px rgba(245,158,11,0.35);transition:all 0.3s ease;}
  .sland-join-btn:hover{transform:scale(1.03);}
`;

const AVATAR_COLORS = ["#f59e0b","#f97316","#10b981","#8b5cf6","#06b6d4","#ef4444","#ec4899","#6366f1"];

export function SquadLanding({
  squadId, squadName, squadIcon, squadCategory, squadGoal,
  squadDescription, memberCount, roomCount, ownerName, isLoggedIn,
}: {
  squadId: string; squadName: string; squadIcon: string; squadCategory: string;
  squadGoal: string; squadDescription: string; memberCount: number;
  roomCount: number; ownerName: string; isLoggedIn: boolean;
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="sland-wrap">
        <div className="sland-orb sland-orb-1" />
        <div className="sland-orb sland-orb-2" />

        <motion.div className="sland-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}>
          <div className="sland-icon-wrap">
            <div className="sland-icon">{squadIcon}</div>
            <div className="sland-icon-ring" />
          </div>

          <h1 className="sland-name">{squadName}</h1>

          <div className="sland-badges">
            <span className="sland-badge badge-category"><Target size={10} />{squadCategory}</span>
            <span className="sland-badge badge-owner"><Crown size={10} />{ownerName}</span>
          </div>

          <p className="sland-goal"><Sparkles size={13} style={{ color: "var(--amber)" }} />{squadGoal}</p>
          {squadDescription && <p className="sland-desc">{squadDescription}</p>}

          <div className="stats-row">
            <div className="stat-item">
              <p className="stat-value">{memberCount}</p>
              <p className="stat-label">Members</p>
              <div className="stat-icon-row">
                {Array.from({ length: Math.min(memberCount, 5) }).map((_, i) => (
                  <div key={i} className="stat-avatar" style={{ background: AVATAR_COLORS[i] }}>{String.fromCharCode(65 + i)}</div>
                ))}
              </div>
            </div>
            <div className="stat-item">
              <p className="stat-value">{roomCount}</p>
              <p className="stat-label">Rooms</p>
              <div style={{ display: "flex", justifyContent: "center", gap: "3px", marginTop: "5px" }}>
                {Array.from({ length: Math.min(roomCount, 4) }).map((_, i) => (
                  <Hash key={i} size={9} style={{ color: "var(--amber)", opacity: 0.5 }} />
                ))}
              </div>
            </div>
            <div className="stat-item">
              <p className="stat-value"><Crown size={16} style={{ display: "inline", color: "var(--amber)" }} /></p>
              <p className="stat-label">Owner</p>
              <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "3px" }}>{ownerName.split(" ")[0]}</p>
            </div>
          </div>

          <div className="sland-join">
            {isLoggedIn ? (
              <JoinButton squadId={squadId} />
            ) : (
              <Link href="/login" className="sland-join-btn">
                <Sparkles size={14} style={{ marginRight: "6px" }} />Sign in to Join
              </Link>
            )}
          </div>

          <Link href="/squads" className="sland-back"><ArrowLeft size={13} /> Back to Discover</Link>
        </motion.div>
      </div>
    </>
  );
}