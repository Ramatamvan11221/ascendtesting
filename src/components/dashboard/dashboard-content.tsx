"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Users, Target, Plus, ArrowRight, Compass, Map, Sparkles, CheckSquare, Zap, Flame, Star, TrendingUp } from "lucide-react";
import { CheckInButton } from "@/components/gamification/check-in-button";

const STYLES = `
  .dash-wrap { min-height: 100vh; background: radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.04), transparent 60%), var(--bg-primary); padding: 24px 16px; position: relative; }
  @media (min-width: 480px) { .dash-wrap { padding: 28px 20px; } }
  @media (min-width: 768px) { .dash-wrap { padding: 32px 28px; } }
  @media (min-width: 1024px) { .dash-wrap { padding: 32px; } }
  .dash-inner { max-width: 1100px; margin: 0 auto; }

  .welcome-name { font-size: clamp(22px, 4vw, 34px); font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em; }
  .welcome-goal { font-size: 13px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; margin-top: 4px; flex-wrap: wrap; }

  .badge { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 999px; font-size: 11px; font-weight: 500; letter-spacing: 0.02em; white-space: nowrap; }
  .badge-streak { background: rgba(245,158,11,0.12); color: #fbbf24; border: 1px solid rgba(245,158,11,0.25); }
  .badge-best { background: rgba(249,115,22,0.1); color: #fb923c; border: 1px solid rgba(249,115,22,0.2); }
  .badge-commit { background: rgba(245,158,11,0.08); color: var(--amber); border: 1px solid rgba(245,158,11,0.18); }

  .checkin-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin: 20px 0 24px; }
  @media (min-width: 480px) { .checkin-row { margin: 24px 0 28px; } }

  /* Quick Actions */
  .qa-grid { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
  @media (min-width: 480px) { .qa-grid { flex-direction: row; flex-wrap: wrap; } }
  .qa-card {
    display: flex; align-items: center; gap: 14px; padding: 16px 18px;
    border-radius: 16px; text-decoration: none; cursor: pointer;
    background: var(--bg-card); border: 1px solid var(--border-subtle);
    transition: all 0.35s cubic-bezier(0.22,0.61,0.36,1);
    backdrop-filter: blur(16px); flex: 1; min-width: 0;
  }
  @media (min-width: 480px) { .qa-card { padding: 18px 22px; border-radius: 18px; } }
  .qa-card:hover { border-color: rgba(245,158,11,0.3); background: var(--bg-card-hover); transform: translateY(-3px); box-shadow: 0 16px 40px -16px rgba(0,0,0,0.4); }
  .qa-icon {
    width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center;
    justify-content: center; flex-shrink: 0; transition: all 0.35s ease;
    background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.1);
  }
  @media (min-width: 480px) { .qa-icon { width: 46px; height: 46px; border-radius: 14px; } }
  .qa-card:hover .qa-icon { transform: scale(1.06); background: rgba(245,158,11,0.12); border-color: rgba(245,158,11,0.2); }
  .qa-label { font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 1px; }
  @media (min-width: 480px) { .qa-label { font-size: 14px; } }
  .qa-sub { font-size: 11px; color: var(--text-muted); }

  /* Stats */
  .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 24px; }
  @media (min-width: 480px) { .stats-row { gap: 12px; margin-bottom: 24px; } }
  .stat-card {
    text-align: center; padding: 18px 10px; border-radius: 16px;
    background: var(--bg-card); border: 1px solid var(--border-subtle);
    backdrop-filter: blur(14px); transition: all 0.35s ease;
  }
  @media (min-width: 480px) { 
  .stat-card { padding: 24px 16px 24px 16px; border-radius: 20px; } }
  .stat-card:hover { border-color: rgba(245,158,11,0.2); transform: translateY(-2px); }
  .stat-value { font-size: clamp(24px, 4vw, 36px); font-weight: 700; letter-spacing: -0.03em; margin-top: -20px; }
  .stat-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 4px; font-weight: 500; }
  @media (min-width: 480px) { .stat-label { font-size: 11px; } }

  /* Squad */
  .squad-section { border-radius: 18px; background: var(--bg-card); border: 1px solid var(--border-subtle); backdrop-filter: blur(14px); overflow: hidden; }
  @media (min-width: 480px) { .squad-section { border-radius: 22px; } }
  .squad-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; border-bottom: 1px solid var(--border-subtle); }
  @media (min-width: 480px) { .squad-header { padding: 20px 24px; } }
  .squad-title { font-size: 15px; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 8px; }
  @media (min-width: 480px) { .squad-title { font-size: 17px; } }
  .squad-create { display: flex; align-items: center; gap: 5px; padding: 7px 14px; border-radius: 10px; background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.15); color: var(--amber); text-decoration: none; font-size: 12px; font-weight: 500; transition: all 0.3s; white-space: nowrap; }
  .squad-create:hover { background: rgba(245,158,11,0.14); border-color: rgba(245,158,11,0.3); }

  .squad-list { display: flex; flex-direction: column; }
  @media (min-width: 640px) { .squad-list { display: grid; grid-template-columns: 1fr 1fr; } }
  .squad-card { display: flex; align-items: center; gap: 12px; padding: 14px 18px; text-decoration: none; cursor: pointer; transition: all 0.25s; position: relative; border-bottom: 1px solid var(--border-subtle); }
  @media (min-width: 480px) { .squad-card { padding: 18px 24px; } }
  @media (min-width: 640px) { .squad-card { border-right: 1px solid var(--border-subtle); } .squad-card:nth-child(even) { border-right: none; } }
  .squad-card:last-child, .squad-card:nth-last-child(2):nth-child(odd) { border-bottom: none; }
  .squad-card:hover { background: rgba(255,255,255,0.015); }
  .squad-card::before { content: ''; position: absolute; left: 0; top: 20%; bottom: 20%; width: 2px; background: var(--amber); opacity: 0; border-radius: 0 2px 2px 0; transition: opacity 0.3s; }
  .squad-card:hover::before { opacity: 1; }
  .squad-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.08); transition: all 0.3s; text-align: center; line-height: 1; margin: auto; }
  @media (min-width: 480px) { .squad-icon { width: 46px; height: 46px; border-radius: 14px; font-size: 22px; } }
  .squad-card:hover .squad-icon { background: rgba(245,158,11,0.12); border-color: rgba(245,158,11,0.2); }
  .squad-name { font-size: 13px; font-weight: 600; color: var(--text-primary); }
  @media (min-width: 480px) { .squad-name { font-size: 14px; } }
  .squad-goal { font-size: 11px; color: var(--text-muted); margin-top: 1px; }
  .squad-meta { font-size: 10px; color: var(--text-muted); display: flex; align-items: center; gap: 4px; margin-top: 3px; }
  .squad-arrow { color: var(--text-muted); transition: all 0.3s; flex-shrink: 0; margin-left: auto; }
  .squad-card:hover .squad-arrow { color: var(--amber); transform: translateX(3px); }

  .empty-wrap { text-align: center; padding: 40px 20px; }
  @media (min-width: 480px) { .empty-wrap { padding: 56px 24px; } }
  .empty-icon { color: var(--text-muted); margin-bottom: 12px; }
  .empty-text { font-size: 13px; color: var(--text-muted); margin-bottom: 16px; }
  .empty-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; border-radius: 10px; border: 1px solid rgba(245,158,11,0.2); color: var(--amber); text-decoration: none; font-size: 12px; font-weight: 500; transition: all 0.3s; background: rgba(245,158,11,0.04); }
  .empty-btn:hover { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.4); }

  /* Scroll reveal */
  .sr { opacity: 0; transform: translateY(20px); transition: all 0.6s cubic-bezier(0.22,0.61,0.36,1); }
  .sr.visible { opacity: 1; transform: translateY(0); }
  .sr-d1 { transition-delay: 0.05s; } .sr-d2 { transition-delay: 0.1s; } .sr-d3 { transition-delay: 0.15s; } .sr-d4 { transition-delay: 0.2s; }
`;

interface SquadData { id: string; name: string; icon: string; memberCount: number; goal: string; }

export function DashboardContent({
  userName, currentGoal, commitmentLevel, streak, longestStreak,
  xp, level, lastCheckIn, roadmapCount, hasFutureSelf,
  taskCount, completedTaskCount, mySquads,
}: {
  userName: string; currentGoal: string; commitmentLevel: number;
  streak: number; longestStreak: number; xp: number; level: number;
  lastCheckIn: string | null; roadmapCount: number; hasFutureSelf: boolean;
  taskCount: number; completedTaskCount: number; mySquads: SquadData[];
}) {
  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }); },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
    );
    document.querySelectorAll(".sr").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const quickActions = [
    { href: "/roadmap", icon: Map, color: "var(--amber)", label: "Dream Map", sub: roadmapCount > 0 ? `${roadmapCount} steps` : "Generate" },
    { href: "/future-self", icon: Sparkles, color: "var(--orange)", label: "Future Self", sub: hasFutureSelf ? "View letter" : "Generate" },
    { href: "/tasks", icon: CheckSquare, color: "var(--amber)", label: "Daily Quest", sub: taskCount > 0 ? `${completedTaskCount}/${taskCount} done` : "Add tasks" },
    { href: "/squads", icon: Compass, color: "var(--orange)", label: "Discover", sub: "Find your people" },
  ];

  const stats = [
    { value: streak, label: "Day Streak", color: "var(--amber)", icon: Flame },
    { value: xp, label: "Total XP", color: "var(--orange)", icon: Zap },
    { value: level, label: "Level", color: "#fbbf24", icon: TrendingUp },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="dash-wrap">
        <div className="dash-inner">
          {/* Welcome + Check-in */}
          <div className="sr" style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 className="welcome-name">Welcome back, <span style={{ color: "var(--amber)" }}>{userName?.split(" ")[0]}</span></h1>
                {currentGoal && (
                  <p className="welcome-goal">
                    <Target size={14} style={{ color: "var(--amber)" }} />{currentGoal}
                    {commitmentLevel >= 7 && <span className="badge badge-commit"><Star size={11} /> Highly Committed</span>}
                  </p>
                )}
                {streak > 0 && (
                  <span className="badge badge-streak" style={{ marginTop: "8px", display: "inline-flex" }}>
                    <Flame size={13} /> {streak} day streak
                  </span>
                )}
              </div>
              <div style={{ flexShrink: 0 }}>
                <CheckInButton hasCheckedIn={lastCheckIn ? new Date(lastCheckIn).toDateString() === new Date().toDateString() : false} streak={streak} />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="qa-grid sr sr-d2">
            {quickActions.map((qa) => (
              <Link key={qa.href} href={qa.href} className="qa-card">
                <div className="qa-icon"><qa.icon size={20} style={{ color: qa.color }} /></div>
                <div style={{ flex: 1, minWidth: 0 }}><p className="qa-label">{qa.label}</p><p className="qa-sub">{qa.sub}</p></div>
                <ArrowRight size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="stats-row sr sr-d3">
            {stats.map((st) => (
              <div key={st.label} className="stat-card">
                <st.icon size={20} style={{ color: st.color, marginBottom: "10px", marginTop: "-6" }} />
                <p className="stat-value" style={{ color: st.color }}>{st.value}</p>
                <p className="stat-label">{st.label}</p>
              </div>
            ))}
          </div>

          {/* Squads */}
          <div className="squad-section sr sr-d4">
            <div className="squad-header">
              <p className="squad-title"><Users size={18} style={{ color: "var(--amber)" }} />My Squads</p>
              <Link href="/squads/create" className="squad-create"><Plus size={14} /> Create Squad</Link>
            </div>
            {mySquads.length > 0 ? (
              <div className="squad-list">
                {mySquads.map((squad) => (
                  <Link key={squad.id} href={`/squads/${squad.id}`} className="squad-card">
                    <div className="squad-icon">{squad.icon}</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p className="squad-name">{squad.name}</p>
                      <p className="squad-goal">{squad.goal}</p>
                      <p className="squad-meta"><Users size={11} />{squad.memberCount} members</p>
                    </div>
                    <ArrowRight size={15} className="squad-arrow" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty-wrap">
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                  <Users size={40} style={{ color: "var(--text-muted)" }} />
                </div>
                  <p className="empty-text">You haven&apos;t joined any squad yet</p>
                  <Link href="/squads" className="empty-btn">
                <Compass size={13} /> Discover Squads
              </Link>
            </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}