"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Check, Trash2, Calendar, Target, TrendingUp, Flame, Zap, Sparkles, Clock } from "lucide-react";

const STYLES = `
  .dq-wrap{min-height:100vh;background:radial-gradient(ellipse at 50% 0%,rgba(245,158,11,0.04),transparent 60%),#070c14;padding:20px 14px;}
  @media(min-width:480px){.dq-wrap{padding:28px 20px;}}
  @media(min-width:768px){.dq-wrap{padding:32px;}}
  .dq-inner{max-width:900px;margin:0 auto;}
  .dq-header{margin-bottom:20px;}
  @media(min-width:480px){.dq-header{margin-bottom:28px;}}
  .dq-title-row{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;}
  .dq-title{font-size:24px;font-weight:700;color:#edeff2;letter-spacing:-0.02em;display:flex;align-items:center;gap:10px;}
  @media(min-width:480px){.dq-title{font-size:30px;}}
  .dq-date{font-size:11px;color:#5a6478;padding:5px 12px;border-radius:999px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.04);white-space:nowrap;cursor:pointer;transition:all 0.3s ease;}
  @media(min-width:480px){.dq-date{font-size:13px;padding:6px 14px;}}
  .dq-date:hover{border-color:rgba(245,158,11,0.2);background:rgba(245,158,11,0.04);}
  .dq-subtitle{font-size:13px;color:#5a6478;margin-top:4px;}
  .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:18px;}
  @media(min-width:480px){.stats-row{gap:12px;margin-bottom:24px;}}
  .stat-card{padding:14px 8px;border-radius:14px;background:rgba(15,22,36,0.5);border:1px solid rgba(255,255,255,0.04);backdrop-filter:blur(12px);text-align:center;transition:all 0.3s ease;}
  @media(min-width:480px){.stat-card{padding:18px 16px;border-radius:18px;}}
  .stat-card:hover{border-color:rgba(245,158,11,0.15);transform:translateY(-2px);}
  .stat-icon{margin-bottom:4px;display:flex;justify-content:center;}
  @media(min-width:480px){.stat-icon{margin-bottom:6px;}}
  .stat-value{font-size:20px;font-weight:700;letter-spacing:-0.03em;}
  @media(min-width:480px){.stat-value{font-size:26px;}}
  .stat-label{font-size:9px;color:#5a6478;text-transform:uppercase;letter-spacing:0.06em;margin-top:2px;}
  @media(min-width:480px){.stat-label{font-size:10px;margin-top:4px;}}
  
  .calendar-wrap{display:flex;gap:4px;margin-bottom:18px;overflow-x:auto;padding-bottom:6px;align-items:stretch;flex-wrap:nowrap;}
  @media(min-width:480px){.calendar-wrap{gap:6px;margin-bottom:24px;}}
  .cal-day{min-width:46px;padding:8px 4px 6px;border-radius:10px;text-align:center;cursor:pointer;border:1px solid rgba(255,255,255,0.04);background:rgba(15,22,36,0.4);transition:all 0.25s ease;flex-shrink:0;position:relative;}
  @media(min-width:480px){.cal-day{min-width:54px;padding:10px 6px 8px;border-radius:13px;}}
  .cal-day:hover{border-color:rgba(245,158,11,0.3);background:rgba(15,22,36,0.6);transform:translateY(-2px);}
  .cal-day.today{border-color:rgba(245,158,11,0.35);background:rgba(245,158,11,0.05);}
  .cal-day.selected{border-color:#f59e0b;background:rgba(245,158,11,0.08);box-shadow:0 0 20px rgba(245,158,11,0.05);}
  .cal-day-name{font-size:9px;color:#5a6478;text-transform:uppercase;letter-spacing:0.04em;font-weight:600;}
  @media(min-width:480px){.cal-day-name{font-size:10px;}}
  .cal-day-num{font-size:14px;font-weight:700;color:#edeff2;margin:2px 0;}
  @media(min-width:480px){.cal-day-num{font-size:17px;margin:3px 0;}}
  .cal-day.today .cal-day-num{color:#f59e0b;}
  .cal-day.selected .cal-day-num{color:#f59e0b;}
  
  /* Progress bar di bawah tanggal - GARIS */
  .cal-progress-wrap{width:100%;height:3px;border-radius:2px;background:rgba(255,255,255,0.06);margin-top:4px;overflow:hidden;}
  @media(min-width:480px){.cal-progress-wrap{height:4px;margin-top:5px;}}
  .cal-progress-fill{height:100%;border-radius:2px;transition:width 0.4s ease;background:linear-gradient(90deg,#f59e0b,#f97316);}
  .cal-progress-fill.complete{background:linear-gradient(90deg,#10b981,#34d399);}
  .cal-progress-fill.partial{background:linear-gradient(90deg,#f59e0b,#f97316);}

  .progress-section{margin-bottom:18px;padding:16px 18px;border-radius:14px;background:rgba(15,22,36,0.5);border:1px solid rgba(255,255,255,0.04);backdrop-filter:blur(12px);}
  @media(min-width:480px){.progress-section{margin-bottom:24px;padding:20px 24px;border-radius:18px;}}
  .progress-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
  @media(min-width:480px){.progress-header{margin-bottom:10px;}}
  .progress-title{font-size:12px;font-weight:600;color:#edeff2;display:flex;align-items:center;gap:6px;}
  @media(min-width:480px){.progress-title{font-size:13px;}}
  .progress-pct{font-size:13px;font-weight:700;color:#f59e0b;}
  @media(min-width:480px){.progress-pct{font-size:15px;}}
  .progress-bar{height:5px;border-radius:3px;background:rgba(255,255,255,0.04);overflow:hidden;}
  @media(min-width:480px){.progress-bar{height:6px;}}
  .progress-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#f59e0b,#f97316,#10b981);transition:width 0.6s cubic-bezier(0.22,0.61,0.36,1);}
  .progress-celebration{text-align:center;margin-top:8px;animation:celebrateIn 0.5s ease;}
  @keyframes celebrateIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
  .add-row{display:flex;gap:6px;margin-bottom:12px;}
  @media(min-width:480px){.add-row{gap:8px;margin-bottom:16px;}}
  .add-input{flex:1;padding:10px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);color:#edeff2;font-size:13px;outline:none;font-family:'Inter',sans-serif;transition:all 0.3s;}
  @media(min-width:480px){.add-input{padding:12px 16px;border-radius:12px;font-size:14px;}}
  .add-input:focus{border-color:rgba(245,158,11,0.3);box-shadow:0 0 0 4px rgba(245,158,11,0.04);}
  .add-input::placeholder{color:#3a4458;}
  .add-btn{padding:10px 16px;border-radius:10px;border:none;background:linear-gradient(135deg,#f59e0b,#f97316);color:#0a0a0a;font-size:13px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;display:flex;align-items:center;gap:5px;transition:all 0.3s;white-space:nowrap;}
  @media(min-width:480px){.add-btn{padding:12px 20px;border-radius:12px;font-size:14px;}}
  .add-btn:hover{transform:scale(1.03);box-shadow:0 8px 24px -8px rgba(245,158,11,0.3);}
  .add-btn:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
  .task-list{display:flex;flex-direction:column;gap:2px;}
  @media(min-width:480px){.task-list{gap:3px;}}
  .task-item{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.03);transition:all 0.25s;animation:taskIn 0.3s ease;}
  @media(min-width:480px){.task-item{gap:12px;padding:13px 16px;border-radius:12px;}}
  @keyframes taskIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
  .task-item:hover{background:rgba(255,255,255,0.012);}
  .task-check{width:20px;height:20px;border-radius:6px;border:2px solid rgba(255,255,255,0.1);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;flex-shrink:0;}
  @media(min-width:480px){.task-check{width:22px;height:22px;border-radius:7px;}}
  .task-check:hover{border-color:#f59e0b;}
  .task-check.done{background:#10b981;border-color:#10b981;}
  .task-text{font-size:12px;color:#edeff2;flex:1;transition:all 0.3s;}
  @media(min-width:480px){.task-text{font-size:13px;}}
  .task-text.done{color:#5a6478;text-decoration:line-through;}
  .task-time{font-size:9px;color:#4a5568;flex-shrink:0;}
  @media(min-width:480px){.task-time{font-size:10px;}}
  .task-del{background:none;border:none;color:#5a6478;cursor:pointer;padding:4px;border-radius:6px;transition:all 0.2s;}
  .task-del:hover{color:#ef4444;background:rgba(239,68,68,0.06);}
  .empty-tasks{text-align:center;padding:40px 16px;}
  @media(min-width:480px){.empty-tasks{padding:48px 20px;}}
  .empty-icon{opacity:0.15;margin-bottom:10px;}
  .spinner{width:14px;height:14px;border:2px solid rgba(0,0,0,0.3);border-top-color:#0a0a0a;border-radius:50%;animation:spin 0.6s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg)}}

  /* Scroll reveal */
  .sr{opacity:0;transform:translateY(20px);transition:all 0.6s cubic-bezier(0.22,0.61,0.36,1);}
  .sr.visible{opacity:1;transform:translateY(0);}
  .sr-d1{transition-delay:0.05s;}.sr-d2{transition-delay:0.1s;}.sr-d3{transition-delay:0.15s;}.sr-d4{transition-delay:0.2s;}
`;

interface Task { id: string; title: string; isCompleted: boolean; createdAt: string; }
interface DayData { date: string; dayName: string; dayNumber: number; completed: number; total: number; progress: number; }

// Helper: Convert UTC date to WIB date string
const toWIBDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Date(date.getTime() + (7 * 60 * 60 * 1000)).toISOString().split("T")[0];
};

// Helper: Get today's date in WIB
const getTodayWIB = () => {
  const now = new Date();
  return new Date(now.getTime() + (7 * 60 * 60 * 1000)).toISOString().split("T")[0];
};

export function DailyQuest({ tasks, calendarDays, todayStr }: { tasks: Task[]; calendarDays: DayData[]; todayStr: string; }) {
  const router = useRouter();
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);
  
  const effectiveToday = todayStr || getTodayWIB();
  const [selectedDate, setSelectedDate] = useState(effectiveToday);

  useEffect(() => {
    const newToday = todayStr || getTodayWIB();
    if (selectedDate === effectiveToday || !selectedDate) {
      setSelectedDate(newToday);
    }
  }, [todayStr]);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }); },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".sr").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [localTasks]);

  const filteredTasks = localTasks.filter((t) => {
    if (!t.createdAt) return false;
    const taskWIBDate = toWIBDate(t.createdAt);
    return taskWIBDate === selectedDate;
  });

  const todayCompleted = filteredTasks.filter((t) => t.isCompleted).length;
  const todayTotal = filteredTasks.length;
  const todayProgress = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;

  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const weeklyTasks = localTasks.filter((t) => new Date(t.createdAt) >= weekAgo);
  const weeklyCompleted = weeklyTasks.filter((t) => t.isCompleted).length;
  const weeklyTotal = weeklyTasks.length;
  const weeklyProgress = weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0;

  const isToday = selectedDate === effectiveToday;

  const getDayName = (dateStr: string) => {
    if (!dateStr) return "Today";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  const handleAdd = async () => {
    if (!title.trim() || adding) return;
    setAdding(true);
    try {
      const res = await fetch("/api/tasks", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ title: title.trim() }) 
      });
      const data = await res.json();
      if (!res.ok || !data.task) throw new Error(data.error || "Failed");
      
      const newTask: Task = { 
        id: data.task.id, 
        title: data.task.title, 
        isCompleted: false, 
        createdAt: new Date(Date.now() + (7 * 60 * 60 * 1000)).toISOString()
      };
      
      setLocalTasks((prev) => [newTask, ...prev]);
      setTitle("");
      
      if (!isToday) {
        setSelectedDate(effectiveToday);
      }
      
      toast.success("Task added! 🎯");
      router.refresh();
    } catch (error) {
      console.error("Add task error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add task");
    }
    setAdding(false);
  };

  const handleToggle = async (taskId: string) => {
    setLocalTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
    try { 
      await fetch(`/api/tasks/${taskId}/toggle`, { method: "POST" }); 
      router.refresh();
    } catch { 
      setLocalTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t)); 
      toast.error("Failed to toggle task");
    }
  };

  const handleDelete = async (taskId: string) => {
    setLocalTasks((prev) => prev.filter((t) => t.id !== taskId));
    try { 
      await fetch(`/api/tasks/${taskId}`, { method: "DELETE" }); 
      router.refresh();
    } catch { 
      toast.error("Failed to delete task"); 
      router.refresh();
    }
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  const getDateProgress = (date: string) => {
    const dayTasks = localTasks.filter((t) => {
      if (!t.createdAt) return false;
      return toWIBDate(t.createdAt) === date;
    });
    if (dayTasks.length === 0) return 0;
    const completed = dayTasks.filter((t) => t.isCompleted).length;
    return Math.round((completed / dayTasks.length) * 100);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="dq-wrap">
        <div className="dq-inner">
          <div className="dq-header sr">
            <div className="dq-title-row">
              <h1 className="dq-title"><Target size={24} style={{ color: "#f59e0b" }} />Daily Quest</h1>
              <span className="dq-date" onClick={() => setSelectedDate(effectiveToday)}>
                <Calendar size={12} style={{ marginRight: "5px", display: "inline" }} />
                {getDayName(selectedDate)}
              </span>
            </div>
            <p className="dq-subtitle">Small steps every day lead to big results.</p>
          </div>

          <div className="stats-row sr sr-d1">
            {[
              { icon: Target, color: "#f59e0b", value: `${todayProgress}%`, label: "Progress" },
              { icon: TrendingUp, color: "#10b981", value: `${weeklyProgress}%`, label: "This Week" },
              { icon: Check, color: "#a78bfa", value: weeklyCompleted, label: "Done" },
              { icon: Flame, color: "#f97316", value: weeklyTotal, label: "Total" },
            ].map((s, i) => (
              <div key={s.label} className="stat-card" style={{ borderTop: `2px solid ${s.color}30` }}>
                <div className="stat-icon"><s.icon size={18} style={{ color: s.color }} /></div>
                <p className="stat-value" style={{ color: s.color }}>{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="calendar-wrap sr sr-d2">
            {calendarDays.map((day) => {
              const progress = getDateProgress(day.date);
              const isComplete = progress === 100 && day.total > 0;
              const hasTask = day.total > 0;
              
              return (
                <div 
                  key={day.date} 
                  className={`cal-day ${day.date === effectiveToday ? "today" : ""} ${day.date === selectedDate ? "selected" : ""}`}
                  onClick={() => handleDateClick(day.date)}
                >
                  <p className="cal-day-name">{day.dayName}</p>
                  <p className="cal-day-num">{day.dayNumber}</p>
                  
                  {/* Progress bar - GARIS */}
                  <div className="cal-progress-wrap">
                    <div 
                      className={`cal-progress-fill ${isComplete ? "complete" : hasTask ? "partial" : ""}`}
                      style={{ 
                        width: hasTask ? `${progress}%` : '0%',
                        opacity: hasTask ? 1 : 0.2
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="progress-section sr sr-d3">
            <div className="progress-header">
              <p className="progress-title"><Zap size={14} style={{ color: "#f59e0b" }} />
                {isToday ? "Today's Progress" : `Progress for ${getDayName(selectedDate)}`}
              </p>
              <p className="progress-pct">{todayProgress}%</p>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${todayProgress}%` }} /></div>
            {todayProgress === 100 && todayTotal > 0 && (
              <div className="progress-celebration">
                <p style={{ color: "#10b981", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                  <Sparkles size={14} />All done! Amazing work!<Sparkles size={14} />
                </p>
              </div>
            )}
          </div>

          <div className="add-row sr sr-d4">
            <input 
              className="add-input" 
              placeholder="What do you want to achieve today?" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" && handleAdd()} 
            />
            <button 
              className="add-btn" 
              onClick={handleAdd} 
              disabled={adding || !title.trim()}
            >
              {adding ? <span className="spinner" /> : <Plus size={14} />}
              {adding ? "Adding..." : "Add Task"}
            </button>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="empty-tasks sr" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <Calendar size={40} style={{ opacity: 0.15, marginBottom: "10px" }} />
              <p style={{ fontSize: "14px", color: "#5a6478" }}>
                {isToday ? "No tasks for today. Start fresh!" : `No tasks for ${getDayName(selectedDate)}`}
              </p>
            </div>         
          ) : (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div className={`task-check ${task.isCompleted ? "done" : ""}`} onClick={() => handleToggle(task.id)}>
                    {task.isCompleted && <Check size={11} style={{ color: "#fff" }} />}
                  </div>
                  <span className={`task-text ${task.isCompleted ? "done" : ""}`}>{task.title}</span>
                  <span className="task-time"><Clock size={9} style={{ marginRight: "3px", display: "inline" }} />
                    {new Date(task.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" })}
                  </span>
                  <button className="task-del" onClick={() => handleDelete(task.id)}><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}