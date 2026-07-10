"use client";

import { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Mail, Target, Star, TrendingUp, Quote } from "lucide-react";
import { toast } from "sonner";

const STYLES = `
  .fs-wrap { min-height:100vh;background:radial-gradient(ellipse at 50% 0%,rgba(245,158,11,0.06),transparent 60%),var(--bg-primary);padding:24px 14px;position:relative;overflow:hidden; }
  @media(min-width:480px){ .fs-wrap{padding:32px 20px;} }
  @media(min-width:768px){ .fs-wrap{padding:40px 32px;} }
  .fs-wrap::before{content:'';position:absolute;top:-30%;left:-20%;width:140%;height:160%;background:radial-gradient(ellipse at 30% 40%,rgba(245,158,11,0.03),transparent 60%),radial-gradient(ellipse at 70% 60%,rgba(249,115,22,0.02),transparent 60%);animation:fsAmbient 20s ease-in-out infinite;pointer-events:none;}
  @keyframes fsAmbient{0%,100%{transform:scale(1) translate(0,0)}50%{transform:scale(1.08) translate(-1%,1%)}}
  .fs-inner{max-width:750px;margin:0 auto;position:relative;z-index:10;}
  .fs-header{text-align:center;margin-bottom:32px;}
  @media(min-width:480px){ .fs-header{margin-bottom:48px;} }
  .fs-icon-wrap{display:inline-block;position:relative;margin-bottom:20px;}
  .fs-icon{width:56px;height:56px;border-radius:18px;background:linear-gradient(135deg,var(--amber),var(--orange));display:flex;align-items:center;justify-content:center;box-shadow:0 16px 40px -12px rgba(245,158,11,0.45);position:relative;z-index:2;}
  @media(min-width:480px){ .fs-icon{width:72px;height:72px;border-radius:24px;box-shadow:0 24px 60px -20px rgba(245,158,11,0.5);} }
  .fs-icon-ring{position:absolute;inset:-6px;border-radius:22px;border:2px solid rgba(245,158,11,0.2);animation:fsRingPulse 3s ease-in-out infinite;}
  @media(min-width:480px){ .fs-icon-ring{inset:-8px;border-radius:30px;} }
  @keyframes fsRingPulse{0%,100%{transform:scale(1);opacity:0.5}50%{transform:scale(1.15);opacity:0.1}}
  .fs-title{font-size:clamp(24px,5vw,34px);font-weight:700;color:var(--text-primary);letter-spacing:-0.03em;margin-bottom:6px;}
  .fs-subtitle{font-size:13px;color:var(--text-muted);display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;}
  @media(min-width:480px){ .fs-subtitle{font-size:14px;} }
  .fs-goal-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:999px;background:rgba(245,158,11,0.08);color:#fbbf24;font-size:11px;border:1px solid rgba(245,158,11,0.15);white-space:nowrap;}

  .letter-card{border-radius:20px;background:var(--bg-card);border:1px solid var(--border-subtle);backdrop-filter:blur(20px);padding:24px 20px;margin-bottom:20px;position:relative;overflow:hidden;transition:all 0.4s ease;}
  @media(min-width:480px){ .letter-card{padding:36px 40px;border-radius:24px;margin-bottom:28px;} }
  .letter-card:hover{border-color:rgba(245,158,11,0.15);box-shadow:0 20px 60px -30px rgba(245,158,11,0.08);}
  .letter-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--amber),var(--orange),#fbbf24,transparent);}
  .letter-card::after{content:'';position:absolute;top:-50%;right:-20%;width:200px;height:200px;background:radial-gradient(circle,rgba(245,158,11,0.04),transparent 70%);border-radius:50%;pointer-events:none;}
  .letter-quote-icon{color:var(--amber);opacity:0.25;margin-bottom:10px;}
  .letter-text{font-family:'Playfair Display',Georgia,serif;font-size:16px;font-style:italic;color:var(--text-primary);line-height:1.8;position:relative;z-index:1;}
  @media(min-width:480px){ .letter-text{font-size:18px;line-height:1.9;} }
  .letter-from{font-size:12px;color:#fbbf24;margin-top:14px;font-weight:500;display:flex;align-items:center;gap:8px;}
  @media(min-width:480px){ .letter-from{font-size:13px;margin-top:18px;} }
  .letter-from-line{flex:1;height:1px;background:rgba(245,158,11,0.15);}

  .quote-card{border-radius:16px;background:var(--bg-card);border:1px solid var(--border-subtle);padding:16px 20px;margin-bottom:20px;position:relative;transition:all 0.3s ease;}
  @media(min-width:480px){ .quote-card{padding:20px 28px;border-radius:20px;margin-bottom:28px;} }
  .quote-card:hover{border-color:rgba(245,158,11,0.08);}
  .quote-text{font-size:14px;color:var(--text-secondary);font-style:italic;line-height:1.7;}
  @media(min-width:480px){ .quote-text{font-size:15px;line-height:1.8;} }
  .quote-author{font-size:12px;color:#fbbf24;font-weight:500;margin-top:8px;display:flex;align-items:center;gap:6px;}
  @media(min-width:480px){ .quote-author{font-size:13px;margin-top:10px;} }
  .quote-author-line{flex:1;height:1px;background:rgba(245,158,11,0.08);}

  .steps-card{border-radius:20px;background:var(--bg-card);border:1px solid var(--border-subtle);backdrop-filter:blur(20px);padding:24px 20px;transition:all 0.4s ease;}
  @media(min-width:480px){ .steps-card{padding:36px 40px;border-radius:24px;} }
  .steps-card:hover{border-color:rgba(245,158,11,0.15);}
  .steps-header{display:flex;align-items:center;gap:10px;margin-bottom:20px;}
  @media(min-width:480px){ .steps-header{gap:12px;margin-bottom:28px;} }
  .steps-icon-wrap{width:38px;height:38px;border-radius:12px;background:rgba(245,158,11,0.08);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  @media(min-width:480px){ .steps-icon-wrap{width:44px;height:44px;border-radius:14px;} }
  .steps-title{font-size:15px;font-weight:600;color:var(--text-primary);}
  @media(min-width:480px){ .steps-title{font-size:17px;} }
  .steps-subtitle{font-size:11px;color:var(--text-muted);}
  @media(min-width:480px){ .steps-subtitle{font-size:12px;} }

  .step-item{display:flex;gap:12px;padding:14px 0;border-bottom:1px solid var(--border-subtle);align-items:flex-start;transition:all 0.3s ease;cursor:default;}
  @media(min-width:480px){ .step-item{gap:16px;padding:18px 0;} }
  .step-item:last-child{border-bottom:none;}
  .step-item:hover{transform:translateX(5px);}
  .step-item:hover .step-num{background:rgba(245,158,11,0.2);box-shadow:0 0 16px rgba(245,158,11,0.12);}
  .step-num{width:30px;height:30px;border-radius:10px;background:rgba(245,158,11,0.08);color:#fbbf24;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;transition:all 0.3s ease;}
  @media(min-width:480px){ .step-num{width:36px;height:36px;border-radius:12px;font-size:14px;} }
  .step-content{flex:1;}
  .step-text{font-size:13px;color:var(--text-secondary);line-height:1.6;}
  @media(min-width:480px){ .step-text{font-size:14px;line-height:1.7;} }
  .step-tag{font-size:9px;color:var(--orange);text-transform:uppercase;letter-spacing:0.08em;font-weight:600;margin-bottom:3px;}
  @media(min-width:480px){ .step-tag{font-size:10px;} }

  .btn-row{display:flex;gap:10px;justify-content:center;margin-top:24px;flex-wrap:wrap;}
  @media(min-width:480px){ .btn-row{gap:12px;margin-top:32px;} }
  .generate-btn{padding:12px 24px;border-radius:12px;border:none;cursor:pointer;background:linear-gradient(135deg,var(--amber),var(--orange));color:var(--text-inverse);font-size:13px;font-weight:600;font-family:'Inter',sans-serif;transition:all 0.3s ease;box-shadow:0 12px 30px -10px rgba(245,158,11,0.3);display:flex;align-items:center;gap:6px;}
  @media(min-width:480px){ .generate-btn{padding:14px 36px;border-radius:14px;font-size:15px;} }
  .generate-btn:hover{transform:scale(1.04);box-shadow:0 24px 50px -12px rgba(245,158,11,0.5);}
  .generate-btn:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
  .outline-btn{padding:12px 24px;border-radius:12px;border:1px solid rgba(245,158,11,0.2);cursor:pointer;background:rgba(245,158,11,0.04);color:#fbbf24;font-size:13px;font-weight:500;font-family:'Inter',sans-serif;transition:all 0.3s ease;display:flex;align-items:center;gap:6px;}
  @media(min-width:480px){ .outline-btn{padding:14px 36px;border-radius:14px;font-size:15px;} }
  .outline-btn:hover{background:rgba(245,158,11,0.08);border-color:rgba(245,158,11,0.35);}

  .empty-state{text-align:center;padding:60px 16px;}
  @media(min-width:480px){ .empty-state{padding:80px 20px;} }
  .empty-icon-wrap{display:inline-block;position:relative;margin-bottom:24px;}
  .empty-icon{width:64px;height:64px;border-radius:50%;background:rgba(245,158,11,0.05);border:2px dashed rgba(245,158,11,0.15);display:flex;align-items:center;justify-content:center;font-size:28px;}
  @media(min-width:480px){ .empty-icon{width:80px;height:80px;font-size:36px;} }
  .empty-text{font-size:20px;font-weight:700;color:var(--text-primary);margin-bottom:8px;}
  @media(min-width:480px){ .empty-text{font-size:22px;} }
  .empty-sub{font-size:13px;color:var(--text-muted);margin-bottom:28px;max-width:380px;margin-left:auto;margin-right:auto;line-height:1.6;}
  @media(min-width:480px){ .empty-sub{font-size:14px;margin-bottom:32px;} }

  .spinner{width:18px;height:18px;border:2px solid rgba(0,0,0,0.3);border-top-color:var(--text-inverse);border-radius:50%;animation:spin 0.6s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg)}}

  .floating-particle{position:absolute;border-radius:50%;pointer-events:none;opacity:0.12;}
  .fp-1{width:4px;height:4px;background:var(--amber);top:20%;left:10%;animation:fpFloat 6s ease-in-out infinite;}
  .fp-2{width:3px;height:3px;background:var(--orange);top:60%;right:15%;animation:fpFloat 8s ease-in-out infinite 1s;}
  .fp-3{width:5px;height:5px;background:#fbbf24;bottom:20%;left:30%;animation:fpFloat 7s ease-in-out infinite 2s;}
  @keyframes fpFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-30px)}}

  /* Scroll reveal */
  .sr{opacity:0;transform:translateY(24px);transition:all 0.6s cubic-bezier(0.22,0.61,0.36,1);}
  .sr.visible{opacity:1;transform:translateY(0);}
  .sr-d1{transition-delay:0.08s;}.sr-d2{transition-delay:0.16s;}.sr-d3{transition-delay:0.24s;}.sr-d4{transition-delay:0.32s;}
`;

interface FutureSelfData {
  letter: string;
  quote?: string;
  author?: string;
  steps: string[];
}

export function FutureSelfContent({ existingData, goal }: { existingData: FutureSelfData | null; goal: string }) {
  const [data, setData] = useState<FutureSelfData | null>(existingData);
  const [loading, setLoading] = useState(false);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }); },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
    );
    document.querySelectorAll(".sr").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [data]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/future-self", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json.data);
      toast.success("Surat dari masa depan telah tiba!");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      toast.error(message || "Failed to generate");
    }
    setLoading(false);
  };

  const stepTags = ["FOUNDATION", "GROWTH", "EXECUTION", "MASTERY", "ACHIEVEMENT"];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="fs-wrap">
        <div className="floating-particle fp-1" />
        <div className="floating-particle fp-2" />
        <div className="floating-particle fp-3" />

        <div className="fs-inner">
          <div className="fs-header sr">
            <div className="fs-icon-wrap">
              <div className="fs-icon"><Mail size={24} style={{ color: "var(--text-inverse)" }} /></div>
              <div className="fs-icon-ring" />
            </div>
            <h1 className="fs-title">Future Self</h1>
            <p className="fs-subtitle">
              {goal ? <span className="fs-goal-badge"><Target size={11} />{goal}</span> : "Lihat dirimu di masa depan"}
            </p>
          </div>

          {data ? (
            <>
              <div className="letter-card sr sr-d1">
                <Quote size={20} className="letter-quote-icon" />
                <p className="letter-text">{data.letter}</p>
                <p className="letter-from"><span className="letter-from-line" />Dirimu dari masa depan<Sparkles size={13} style={{ color: "#fbbf24", marginLeft: "4px" }} /></p>
              </div>

              {data.quote && (
                <div className="quote-card sr sr-d1" style={{ transitionDelay: "0.04s" }}>
                  <p className="quote-text">&quot;{data.quote}&quot;</p>
                  <p className="quote-author"><span className="quote-author-line" />{data.author || "Anonymous"}</p>
                </div>
              )}

              <div className="steps-card sr sr-d2">
                <div className="steps-header">
                  <div className="steps-icon-wrap"><TrendingUp size={18} style={{ color: "#fbbf24" }} /></div>
                  <div><p className="steps-title">Jalan Menuju Goal-mu</p><p className="steps-subtitle">{data.steps.length} langkah konkret yang bisa kamu mulai hari ini</p></div>
                </div>
                {data.steps?.map((step: string, i: number) => (
                  <div key={i} className="step-item sr" style={{ transitionDelay: `${0.1 * i}s` }}>
                    <div className="step-num">{i + 1}</div>
                    <div className="step-content"><p className="step-tag">{stepTags[i] || "STEP"}</p><p className="step-text">{step}</p></div>
                  </div>
                ))}
              </div>

              <div className="btn-row sr sr-d3">
                <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
                  {loading ? <span className="spinner" /> : <RefreshCw size={15} />}
                  {loading ? "Generating..." : "Regenerate"}
                </button>
                <button className="outline-btn" onClick={() => window.location.href = "/roadmap"}>
                  <Star size={15} /> View Dream Map
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state sr">
              <div className="empty-icon-wrap"><div className="empty-icon">💌</div></div>
              <p className="empty-text">Surat dari Masa Depan</p>
              <p className="empty-sub">Bayangkan dirimu 5 tahun dari sekarang. AI akan menulis surat personal dari &ldquo;future self&rdquo;-mu dan memberikan langkah konkret untuk mencapai goal-mu.</p>
              <button className="generate-btn" onClick={handleGenerate} disabled={loading} style={{ margin: "0 auto" }}>
                {loading ? <span className="spinner" /> : <Sparkles size={16} />}
                {loading ? "Menulis surat..." : "Generate My Future Self"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}