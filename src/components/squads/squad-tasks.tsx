"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Check, Trash2, Target, TrendingUp, Flame, Zap, Sparkles } from "lucide-react";

const STYLES = `
  .st-wrap{background:transparent;}
  .stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:16px;}
  @media(min-width:480px){.stats-row{gap:10px;margin-bottom:20px;}}
  .stat-card{padding:14px 8px;border-radius:14px;background:var(--bg-card);border:1px solid var(--border-subtle);backdrop-filter:blur(12px);text-align:center;transition:all 0.3s ease;}
  @media(min-width:480px){.stat-card{padding:16px 14px;border-radius:16px;}}
  .stat-card:hover{border-color:rgba(245,158,11,0.15);transform:translateY(-2px);}
  .stat-icon{margin-bottom:4px;display:flex;justify-content:center;}
  .stat-value{font-size:18px;font-weight:700;letter-spacing:-0.03em;}
  @media(min-width:480px){.stat-value{font-size:24px;}}
  .stat-label{font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-top:2px;}
  @media(min-width:480px){.stat-label{font-size:10px;}}

  .progress-section{margin-bottom:16px;padding:14px 16px;border-radius:14px;background:var(--bg-card);border:1px solid var(--border-subtle);backdrop-filter:blur(12px);}
  @media(min-width:480px){.progress-section{margin-bottom:20px;padding:18px 22px;border-radius:16px;}}
  .progress-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;}
  .progress-title{font-size:12px;font-weight:600;color:var(--text-primary);display:flex;align-items:center;gap:6px;}
  .progress-pct{font-size:13px;font-weight:700;color:var(--amber);}
  .progress-bar{height:5px;border-radius:3px;background:var(--border-medium);overflow:hidden;}
  @media(min-width:480px){.progress-bar{height:6px;}}
  .progress-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--amber),var(--orange),var(--green));transition:width 0.6s cubic-bezier(0.22,0.61,0.36,1);}
  .progress-celebration{text-align:center;margin-top:8px;animation:celebrateIn 0.5s ease;}
  @keyframes celebrateIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}

  .add-row{display:flex;gap:6px;margin-bottom:12px;}
  @media(min-width:480px){.add-row{gap:8px;margin-bottom:14px;}}
  .add-input{flex:1;padding:10px 14px;border-radius:10px;border:1px solid var(--border-medium);background:var(--bg-input);color:var(--text-primary);font-size:13px;outline:none;font-family:'Inter',sans-serif;transition:all 0.3s;}
  .add-input:focus{border-color:rgba(245,158,11,0.3);box-shadow:0 0 0 4px rgba(245,158,11,0.04);}
  .add-input::placeholder{color:var(--text-muted);opacity:0.5;}
  .add-btn{padding:10px 16px;border-radius:10px;border:none;background:linear-gradient(135deg,var(--amber),var(--orange));color:var(--text-inverse);font-size:13px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;display:flex;align-items:center;gap:5px;transition:all 0.3s;white-space:nowrap;}
  .add-btn:hover{transform:scale(1.03);box-shadow:0 8px 24px -8px rgba(245,158,11,0.3);}
  .add-btn:disabled{opacity:0.4;cursor:not-allowed;transform:none;}

  .task-list{display:flex;flex-direction:column;gap:2px;}
  @media(min-width:480px){.task-list{gap:3px;}}
  .task-item{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:10px;border:1px solid var(--border-subtle);transition:all 0.25s;animation:taskIn 0.3s ease;}
  @media(min-width:480px){.task-item{gap:12px;padding:13px 16px;border-radius:12px;}}
  @keyframes taskIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
  .task-item:hover{background:rgba(255,255,255,0.012);}
  .task-check{width:20px;height:20px;border-radius:6px;border:2px solid var(--border-medium);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;flex-shrink:0;}
  @media(min-width:480px){.task-check{width:22px;height:22px;border-radius:7px;}}
  .task-check:hover{border-color:var(--amber);}
  .task-check.done{background:var(--green);border-color:var(--green);}
  .task-text{font-size:12px;color:var(--text-primary);flex:1;transition:all 0.3s;}
  @media(min-width:480px){.task-text{font-size:13px;}}
  .task-text.done{color:var(--text-muted);text-decoration:line-through;}
  .task-del{opacity:1;background:none;border:none;color:var(--red);cursor:pointer;padding:4px;border-radius:6px;transition:all 0.2s;}
  .task-del:hover{background:rgba(239,68,68,0.08);}
  .empty-tasks{text-align:center;padding:32px 16px;color:var(--text-muted);font-size:13px;}
  @media(min-width:480px){.empty-tasks{padding:40px 20px;}}
  .spinner{width:14px;height:14px;border:2px solid rgba(0,0,0,0.3);border-top-color:var(--text-inverse);border-radius:50%;animation:spin 0.6s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg)}}
  .sr{opacity:0;transform:translateY(16px);transition:all 0.5s cubic-bezier(0.22,0.61,0.36,1);}
  .sr.visible{opacity:1;transform:translateY(0);}
  .sr-d1{transition-delay:0.04s;}.sr-d2{transition-delay:0.08s;}.sr-d3{transition-delay:0.12s;}
`;

interface Task { id: string; title: string; isCompleted: boolean; }

export function SquadTasks({ squadId, isMember }: { squadId: string; isMember: boolean }) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTasks = () => {
    fetch(`/api/squads/${squadId}/tasks`)
      .then((r) => r.json())
      .then((d) => { setTasks(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchTasks(); }, [squadId]);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }); },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".sr").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [tasks]);

  const handleAdd = async () => {
    if (!title.trim() || adding) return;
    setAdding(true);
    try {
      const res = await fetch(`/api/squads/${squadId}/tasks`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: title.trim() }) });
      const data = await res.json();
      if (!res.ok || !data.task) throw new Error("Failed");
      setTasks((prev) => [data.task, ...prev]);
      setTitle("");
      toast.success("Task added!");
      router.refresh();
    } catch { toast.error("Failed to add task"); }
    setAdding(false);
  };

  const handleToggle = async (taskId: string) => {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
    try { await fetch(`/api/squads/${squadId}/tasks/${taskId}/toggle`, { method: "POST" }); router.refresh(); }
    catch { setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t)); toast.error("Failed"); }
  };

  const handleDelete = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try { await fetch(`/api/squads/${squadId}/tasks/${taskId}`, { method: "DELETE" }); toast.success("Task deleted"); router.refresh(); }
    catch { toast.error("Failed"); router.refresh(); }
  };

  const completed = tasks.filter((t) => t.isCompleted).length;
  const total = tasks.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (loading) return <div className="empty-tasks"><span className="spinner" /></div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="st-wrap">
        {/* Stats */}
        <div className="stats-row sr sr-d1">
          {[
            { icon: Target, color: "var(--amber)", value: `${progress}%`, label: "Progress" },
            { icon: Check, color: "var(--green)", value: completed, label: "Done" },
            { icon: Flame, color: "var(--orange)", value: total, label: "Total" },
          ].map((s) => (
            <div key={s.label} className="stat-card" style={{ borderTop: `2px solid ${s.color}30` }}>
              <div className="stat-icon"><s.icon size={16} style={{ color: s.color }} /></div>
              <p className="stat-value" style={{ color: s.color }}>{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        {total > 0 && (
          <div className="progress-section sr sr-d2">
            <div className="progress-header">
              <p className="progress-title"><Zap size={13} style={{ color: "var(--amber)" }} />Squad Progress</p>
              <p className="progress-pct">{progress}%</p>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            {progress === 100 && total > 0 && (
              <div className="progress-celebration">
                <p style={{ color: "var(--green)", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                  <Sparkles size={14} />All tasks completed! Amazing!<Sparkles size={14} />
                </p>
              </div>
            )}
          </div>
        )}

        {/* Add Task */}
        {isMember && (
          <div className="add-row sr sr-d3">
            <input className="add-input" placeholder="Add a squad task..." value={title}
              onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} />
            <button className="add-btn" onClick={handleAdd} disabled={adding || !title.trim()}>
              {adding ? <span className="spinner" /> : <Plus size={14} />}Add
            </button>
          </div>
        )}

                {/* Task List */}
        {tasks.length === 0 ? (
          <div className="empty-tasks sr" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Target size={36} style={{ opacity: 0.12, marginBottom: "8px" }} />
            <p>No tasks yet. Add one!</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task.id} className="task-item">
                <div className={`task-check ${task.isCompleted ? "done" : ""}`} onClick={() => isMember && handleToggle(task.id)}>
                  {task.isCompleted && <Check size={11} style={{ color: "#fff" }} />}
                </div>
                <span className={`task-text ${task.isCompleted ? "done" : ""}`}>{task.title}</span>
                {isMember && (
                  <button className="task-del" onClick={() => handleDelete(task.id)}><Trash2 size={13} /></button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}