"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Flag, Zap, Star, PartyPopper, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

const STYLES = `
  .rm-wrap{min-height:100vh;background:radial-gradient(ellipse at 50% 0%,rgba(245,158,11,0.04),transparent 60%),var(--bg-primary);padding:20px 14px;position:relative;}
  @media(min-width:480px){.rm-wrap{padding:28px 20px;}}
  @media(min-width:768px){.rm-wrap{padding:40px 32px;}}
  .rm-inner{max-width:850px;margin:0 auto;}
  .rm-header{text-align:center;margin-bottom:32px;}
  @media(min-width:480px){.rm-header{margin-bottom:48px;}}
  .rm-icon{width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,var(--amber),var(--orange));display:flex;align-items:center;justify-content:center;margin:0 auto 16px;box-shadow:0 14px 36px -14px rgba(245,158,11,0.4);}
  @media(min-width:480px){.rm-icon{width:64px;height:64px;border-radius:20px;margin-bottom:20px;}}
  .rm-title{font-size:26px;font-weight:700;color:var(--text-primary);margin-bottom:4px;letter-spacing:-0.02em;}
  @media(min-width:480px){.rm-title{font-size:30px;}}
  .rm-sub{font-size:13px;color:var(--text-muted);}
  @media(min-width:480px){.rm-sub{font-size:14px;}}
  .rm-progress{display:flex;align-items:center;gap:8px;justify-content:center;margin-top:12px;font-size:12px;color:var(--amber);font-weight:600;}
  @media(min-width:480px){.rm-progress{font-size:13px;margin-top:16px;}}

  /* Timeline */
  .timeline{position:relative;padding:0 0 40px 32px;}
  @media(min-width:768px){.timeline{padding:0 0 40px;}}
  .timeline::before{content:'';position:absolute;left:14px;top:0;bottom:0;width:2px;background:var(--border-medium);z-index:0;border-radius:1px;}
  @media(min-width:768px){.timeline::before{left:50%;transform:translateX(-50%);}}

  .tl-row{display:flex;align-items:flex-start;position:relative;z-index:1;margin-bottom:4px;}
  @media(min-width:768px){.tl-row{min-height:70px;align-items:center;}}
  @media(min-width:768px){.tl-row.left{justify-content:flex-start;padding-right:52%;}}
  @media(min-width:768px){.tl-row.right{justify-content:flex-end;padding-left:58%;}}

  /* Dots */
  .tl-dot{position:absolute;left:-22px;top:22px;width:10px;height:10px;border-radius:50%;z-index:2;border:2px solid var(--border-medium);background:var(--bg-secondary);transition:all 0.3s ease;}
  @media(min-width:480px){.tl-dot{left:-24px;top:24px;width:14px;height:14px;}}
  @media(min-width:768px){.tl-dot{left:50%;top:50%;transform:translate(-50%,-50%);}}
  .tl-dot.completed{background:var(--green);border-color:var(--green);box-shadow:0 0 12px rgba(16,185,129,0.3);}
  @media(min-width:768px){.tl-dot.completed{box-shadow:0 0 16px rgba(16,185,129,0.3);}}
  .tl-dot.start{background:var(--amber);border-color:var(--amber);box-shadow:0 0 16px rgba(245,158,11,0.3);width:12px;height:12px;top:0;left: 9px;position:absolute;}
  @media(min-width:480px){.tl-dot.start{width:18px;height:18px;top:-2px;left: 6px;}}
  @media(min-width:768px){.tl-dot.start{left:50%;top:-7px;transform:translateX(-50%);}}
  .tl-dot.finish{background:var(--amber);border-color:var(--amber);box-shadow:0 0 16px rgba(245,158,11,0.35);width:14px;height:14px;animation:finishPulse 2s ease-in-out infinite;position:relative;left:-24px;margin-top:12px;}
  @media(min-width:480px){.tl-dot.finish{width:20px;height:20px;left:-28px;}}
  @media(min-width:768px){.tl-dot.finish{left:50%;transform:translateX(-50%);margin-top:16px;}}
  @keyframes finishPulse{0%,100%{box-shadow:0 0 16px rgba(245,158,11,0.35)}50%{box-shadow:0 0 32px rgba(245,158,11,0.6)}}

  .tl-card{width:100%;padding:14px 16px;border-radius:14px;border:1px solid var(--border-subtle);background:var(--bg-card);backdrop-filter:blur(12px);cursor:pointer;transition:all 0.3s ease;display:flex;align-items:center;gap:12px;}
  @media(min-width:480px){.tl-card{padding:16px 20px;border-radius:16px;}}
  @media(min-width:768px){.tl-card{width:350px;}}
  .tl-card:hover{border-color:rgba(245,158,11,0.25);background:var(--bg-card-hover);transform:translateX(4px);box-shadow:0 8px 24px rgba(0,0,0,0.2);}
  @media(min-width:768px){.tl-card:hover{transform:translateY(-3px);box-shadow:0 12px 30px rgba(0,0,0,0.3);}}
  .tl-card.completed{border-color:rgba(16,185,129,0.2);background:rgba(16,185,129,0.02);}
  .tl-circle{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:2px solid var(--border-medium);transition:all 0.3s ease;background:var(--bg-input);}
  @media(min-width:480px){.tl-circle{width:40px;height:40px;}}
  .tl-card:hover .tl-circle{border-color:var(--amber);}
  .tl-card.completed .tl-circle{background:var(--green);border-color:var(--green);}
  .tl-num{font-size:11px;font-weight:700;color:var(--text-muted);}
  @media(min-width:480px){.tl-num{font-size:13px;}}
  .tl-card.completed .tl-num{color:#fff;}
  .tl-info{flex:1;min-width:0;}
  .tl-title{font-size:12px;font-weight:500;color:var(--text-primary);line-height:1.5;}
  @media(min-width:480px){.tl-title{font-size:13px;}}
  .tl-card.completed .tl-title{color:var(--text-muted);text-decoration:line-through;}

  .tl-label{font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;color:var(--amber);padding-left:2px;}
  @media(min-width:480px){.tl-label{font-size:10px;}}
  @media(min-width:768px){.tl-label{position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap;padding-left:0;}}
  .tl-label.start{margin-bottom:4px;}
  @media(min-width:768px){.tl-label.start{top:-24px;margin-bottom:0;}}
  .tl-label.finish{margin-top:8px;}
  @media(min-width:768px){.tl-label.finish{bottom:-24px;margin-top:0;}}

  /* Celebration */
  .celebration-overlay{position:fixed;inset:0;z-index:200;background:var(--bg-overlay);display:flex;align-items:center;justify-content:center;padding:16px;}
  .celebration-card{background:var(--bg-card);border:1px solid rgba(245,158,11,0.2);border-radius:20px;padding:36px 24px;text-align:center;max-width:440px;width:100%;backdrop-filter:blur(20px);position:relative;overflow:hidden;}
  @media(min-width:480px){.celebration-card{padding:48px 40px;border-radius:24px;}}
  .celebration-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--amber),var(--orange),var(--green),var(--amber),transparent);}
  .celebration-icon{font-size:48px;margin-bottom:12px;animation:bounce 0.6s ease infinite alternate;}
  @media(min-width:480px){.celebration-icon{font-size:64px;margin-bottom:16px;}}
  @keyframes bounce{from{transform:translateY(0)}to{transform:translateY(-8px)}}
  .celebration-title{font-size:22px;font-weight:700;color:var(--text-primary);margin-bottom:6px;}
  @media(min-width:480px){.celebration-title{font-size:28px;}}
  .celebration-sub{font-size:13px;color:var(--text-muted);margin-bottom:20px;line-height:1.6;}
  @media(min-width:480px){.celebration-sub{font-size:14px;margin-bottom:24px;}}
  .celebration-btn{padding:10px 28px;border-radius:10px;border:none;cursor:pointer;background:linear-gradient(135deg,var(--amber),var(--orange));color:var(--text-inverse);font-size:13px;font-weight:600;font-family:'Inter',sans-serif;}
  @media(min-width:480px){.celebration-btn{padding:12px 32px;border-radius:12px;font-size:14px;}}
  .celebration-close{position:absolute;top:12px;right:12px;background:none;border:none;color:var(--text-muted);cursor:pointer;}
  .confetti-piece{position:fixed;z-index:201;pointer-events:none;animation:confettiFall linear forwards;}
  @keyframes confettiFall{0%{transform:translateY(-100vh) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}

  .empty-state{text-align:center;padding:60px 16px;}
  @media(min-width:480px){.empty-state{padding:80px 20px;}}
  .generate-btn{padding:12px 24px;border-radius:12px;border:none;cursor:pointer;background:linear-gradient(135deg,var(--amber),var(--orange));color:var(--text-inverse);font-size:13px;font-weight:600;font-family:'Inter',sans-serif;transition:all 0.3s ease;box-shadow:0 12px 30px -10px rgba(245,158,11,0.3);display:inline-flex;align-items:center;gap:6px;}
  @media(min-width:480px){.generate-btn{padding:14px 36px;border-radius:14px;font-size:15px;}}
  .generate-btn:hover{transform:scale(1.04);}
  .generate-btn:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
  .spinner{width:14px;height:14px;border:2px solid rgba(0,0,0,0.3);border-top-color:var(--text-inverse);border-radius:50%;animation:spin 0.6s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg)}}

  .sr{opacity:0;transform:translateY(20px);transition:all 0.6s cubic-bezier(0.22,0.61,0.36,1);}
  .sr.visible{opacity:1;transform:translateY(0);}
  .sr-d1{transition-delay:0.05s;}.sr-d2{transition-delay:0.1s;}
`;

const CONFETTI_COLORS = ["#f59e0b","#f97316","#10b981","#fbbf24","#ef4444","#8b5cf6","#06b6d4","#ec4899"];

function generateConfetti() {
  return Array.from({ length: 40 }, (_, i) => ({
    id: i, color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: (i * 19 + 5) % 100, delay: (i * 0.025) % 1.2,
    size: 5 + (i % 7), duration: 2 + (i % 3) * 0.4,
  }));
}

function CelebrationModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="celebration-overlay" onClick={onClose}>
      {generateConfetti().map((c) => (
        <div key={c.id} className="confetti-piece" style={{ left: `${c.left}%`, width: `${c.size}px`, height: `${c.size * 0.6}px`, background: c.color, borderRadius: "2px", animationDuration: `${c.duration}s`, animationDelay: `${c.delay}s` }} />
      ))}
      <div className="celebration-card" onClick={(e) => e.stopPropagation()}>
        <button className="celebration-close" onClick={onClose}><X size={16} /></button>
        <div className="celebration-icon">🏆</div>
        <h2 className="celebration-title">Congratulations!</h2>
        <p className="celebration-sub">You&apos;ve completed every milestone. Keep ascending!</p>
        <button className="celebration-btn" onClick={onClose}>Continue</button>
      </div>
    </div>
  );
}

interface RoadmapNode { id: string; title: string; order: number; isCompleted: boolean; }

export function RoadmapView({ nodes = [], goal = "" }: { nodes: RoadmapNode[]; goal?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }); },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".sr").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [nodes]);

  const handleToggle = async (nodeId: string) => {
    setCompletingId(nodeId);
    try { await fetch(`/api/roadmap/${nodeId}/toggle`, { method: "POST" }); router.refresh(); }
    catch { toast.error("Failed"); }
    setCompletingId(null);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try { await fetch("/api/ai/generate-roadmap", { method: "POST" }); router.refresh(); }
    catch { toast.error("Failed"); }
    setLoading(false);
  };

  const completed = nodes.filter((n) => n.isCompleted).length;
  const total = nodes.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const allDone = total > 0 && completed === total;

  if (nodes.length === 0) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div className="rm-wrap"><div className="rm-inner">
          <div className="empty-state sr">
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>🗺️</p>
            <p style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>Your Dream Map Awaits</p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>Generate an AI-powered roadmap with 15-20 detailed steps.</p>
            <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
              {loading ? <span className="spinner" /> : <Zap size={16} />}{loading ? "Generating..." : "Generate My Roadmap"}
            </button>
          </div>
        </div></div>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <AnimatePresence>{showCelebration && <CelebrationModal onClose={() => setShowCelebration(false)} />}</AnimatePresence>

      <div className="rm-wrap"><div className="rm-inner">
        <div className="rm-header sr">
          <div className="rm-icon"><Flag size={22} style={{ color: "var(--text-inverse)" }} /></div>
          <h1 className="rm-title">Dream Map</h1>
          <p className="rm-sub">{goal || "Your journey to success"}</p>
          <div className="rm-progress">
            <Star size={14} />{completed} of {total} milestones ({progress}%)
            {allDone && <button onClick={() => setShowCelebration(true)} style={{ background: "none", border: "none", color: "var(--amber)", cursor: "pointer", fontSize: "18px" }}><PartyPopper size={18} /></button>}
          </div>
        </div>

        <div className="timeline">
          <p className="tl-label start">START</p>
          <div className="tl-dot start" />

          {nodes.map((node, i) => (
            <div key={node.id} className={`tl-row ${i % 2 === 0 ? "left" : "right"}`}>
              <div className={`tl-dot ${node.isCompleted ? "completed" : ""}`} />
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }} onClick={() => handleToggle(node.id)} style={{ width: "100%" }}>
                <div className={`tl-card ${node.isCompleted ? "completed" : ""}`}>
                  <div className="tl-circle">
                    {node.isCompleted ? <Check size={14} style={{ color: "#fff" }} /> : completingId === node.id ? <span className="spinner" /> : <span className="tl-num">{i + 1}</span>}
                  </div>
                  <div className="tl-info"><p className="tl-title">{node.title}</p></div>
                </div>
              </motion.div>
            </div>
          ))}

          <div className="tl-dot finish" />
          <p className="tl-label finish">FINISH</p>
        </div>

        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
            {loading ? <span className="spinner" /> : <Zap size={14} />}{loading ? "Generating..." : "Regenerate Roadmap"}
          </button>
        </div>
      </div></div>
    </>
  );
}