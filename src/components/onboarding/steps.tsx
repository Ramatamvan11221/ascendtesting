"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Target, Heart, Rocket, Zap, Compass, Star, GraduationCap, Code, Globe, Trophy, Briefcase, Wallet, Dumbbell, BookOpen, Palette, PenTool, Mic, Brain, Plane, Video, Shield } from "lucide-react";
import { toast } from "sonner";

const STYLES = `
  :root { --bg-deep: #070c14; --text: #edeff2; --text-secondary: #9aa4b8; --text-muted: #5a6478; --border: rgba(255,255,255,0.06); }
  .onboard-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; background: var(--bg-deep); position: relative; overflow: hidden; }
  .onboard-wrap::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 50% 40% at 20% 50%, rgba(245,158,11,0.04) 0%, transparent 60%), radial-gradient(ellipse 40% 50% at 80% 40%, rgba(249,115,22,0.03) 0%, transparent 60%); }
  @media (min-width: 480px) { .onboard-wrap { padding: 32px; } }
  .onboard-card { position: relative; z-index: 10; width: 100%; max-width: 640px; }
  .progress-bar { display: flex; gap: 6px; justify-content: center; margin-bottom: 24px; }
  @media (min-width: 480px) { .progress-bar { margin-bottom: 32px; } }
  .progress-dot { height: 4px; border-radius: 4px; transition: all 0.5s cubic-bezier(0.22,0.61,0.36,1); }
  .step-counter { text-align: center; font-size: 11px; color: #5a6478; margin-bottom: 16px; letter-spacing: 0.1em; text-transform: uppercase; }
  @media (min-width: 480px) { .step-counter { font-size: 12px; margin-bottom: 20px; } }

  .goal-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
  @media (min-width: 480px) { .goal-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; } }
  .goal-btn { padding: 10px 8px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.015); cursor: pointer; text-align: center; transition: all 0.3s ease; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; color: #9aa4b8; display: flex; flex-direction: column; align-items: center; gap: 6px; }
  @media (min-width: 480px) { .goal-btn { padding: 14px 10px; font-size: 13px; border-radius: 16px; } }
  .goal-btn:hover { border-color: rgba(245,158,11,0.3); background: rgba(245,158,11,0.04); color: #edeff2; }
  .goal-btn.active { border-color: rgba(245,158,11,0.5); background: rgba(245,158,11,0.08); color: #f59e0b; box-shadow: 0 0 30px rgba(245,158,11,0.08); }
  .goal-icon { display: flex; justify-content: center; }

  .commitment-list { display: flex; flex-direction: column; gap: 6px; }
  @media (min-width: 480px) { .commitment-list { gap: 8px; } }
  .commitment-btn { width: 100%; padding: 13px 16px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.015); cursor: pointer; text-align: left; transition: all 0.3s ease; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; color: #9aa4b8; display: flex; align-items: center; gap: 10px; }
  @media (min-width: 480px) { .commitment-btn { padding: 16px 20px; font-size: 14px; border-radius: 16px; } }
  .commitment-btn:hover { border-color: rgba(245,158,11,0.3); background: rgba(245,158,11,0.04); color: #edeff2; }
  .commitment-btn.active { border-color: rgba(245,158,11,0.5); background: rgba(245,158,11,0.08); color: #f59e0b; }
  .commitment-icon { flex-shrink: 0; }

  .challenge-grid { display: grid; grid-template-columns: 1fr; gap: 6px; }
  @media (min-width: 480px) { .challenge-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; } }
  .challenge-btn { padding: 12px 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.015); cursor: pointer; text-align: left; transition: all 0.3s ease; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; color: #9aa4b8; display: flex; align-items: center; gap: 8px; }
  @media (min-width: 480px) { .challenge-btn { padding: 14px 16px; font-size: 13px; border-radius: 14px; } }
  .challenge-btn:hover { border-color: rgba(245,158,11,0.3); background: rgba(245,158,11,0.04); color: #edeff2; }
  .challenge-btn.active { border-color: rgba(245,158,11,0.5); background: rgba(245,158,11,0.08); color: #f59e0b; }

  .onboard-input { width: 100%; padding: 14px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); color: #edeff2; font-family: 'Inter', sans-serif; font-size: 14px; outline: none; transition: all 0.3s ease; }
  @media (min-width: 480px) { .onboard-input { padding: 16px 20px; font-size: 15px; border-radius: 14px; } }
  .onboard-input:focus { border-color: rgba(245,158,11,0.4); box-shadow: 0 0 0 4px rgba(245,158,11,0.04); }
  .onboard-input::placeholder { color: #3a4458; }

  .btn-back { background: none; border: none; color: #5a6478; cursor: pointer; display: flex; align-items: center; gap: 6px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 400; transition: color 0.3s; padding: 8px 0; }
  @media (min-width: 480px) { .btn-back { font-size: 14px; } }
  .btn-back:hover { color: #9aa4b8; }

  .btn-next { padding: 12px 22px; border-radius: 12px; background: linear-gradient(135deg, #f59e0b, #f97316); color: #0a0a0a; font-size: 13px; font-weight: 600; border: none; cursor: pointer; letter-spacing: 0.02em; display: flex; align-items: center; gap: 6px; transition: all 0.3s cubic-bezier(0.22,0.61,0.36,1); box-shadow: 0 12px 30px -12px rgba(245,158,11,0.35); font-family: 'Inter', sans-serif; }
  @media (min-width: 480px) { .btn-next { padding: 14px 28px; font-size: 14px; border-radius: 14px; } }
  .btn-next:hover { transform: translateY(-2px); box-shadow: 0 20px 40px -12px rgba(245,158,11,0.5); }
  .btn-next:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .btn-enter { padding: 14px 32px; border-radius: 14px; background: linear-gradient(135deg, #f59e0b, #f97316); color: #0a0a0a; font-size: 14px; font-weight: 600; border: none; cursor: pointer; letter-spacing: 0.02em; display: flex; align-items: center; gap: 8px; transition: all 0.3s cubic-bezier(0.22,0.61,0.36,1); box-shadow: 0 16px 40px -16px rgba(245,158,11,0.4); font-family: 'Inter', sans-serif; margin: 0 auto; }
  @media (min-width: 480px) { .btn-enter { padding: 16px 40px; font-size: 15px; border-radius: 16px; } }
  .btn-enter:hover { transform: translateY(-2px); box-shadow: 0 24px 50px -16px rgba(245,158,11,0.55); }
  .btn-enter:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .section-title { font-size: clamp(20px, 4vw, 28px); font-weight: 700; color: #edeff2; margin-bottom: 6px; letter-spacing: -0.02em; }
  .section-desc { font-size: 13px; color: #5a6478; margin-bottom: 24px; font-weight: 300; }
  @media (min-width: 480px) { .section-desc { font-size: 14px; margin-bottom: 28px; } }

  .icon-box { width: 48px; height: 48px; border-radius: 16px; background: linear-gradient(135deg, #f59e0b, #f97316); display: flex; align-items: center; justify-content: center; margin: 0 auto; box-shadow: 0 12px 30px -10px rgba(245,158,11,0.35); }
  @media (min-width: 480px) { .icon-box { width: 56px; height: 56px; border-radius: 18px; } }

  .quote-box { margin-top: 16px; padding: 14px 16px; border-radius: 12px; border: 1px solid rgba(245,158,11,0.1); background: rgba(245,158,11,0.03); }
  @media (min-width: 480px) { .quote-box { padding: 16px 20px; border-radius: 14px; } }
  .quote-text { font-size: 12px; color: #9aa4b8; font-style: italic; line-height: 1.6; }
  @media (min-width: 480px) { .quote-text { font-size: 13px; } }

  .spinner { width: 36px; height: 36px; border-radius: 50%; border: 3px solid rgba(245,158,11,0.15); border-top-color: #f59e0b; animation: spin 0.8s linear infinite; margin: 0 auto 20px; }
  @media (min-width: 480px) { .spinner { width: 44px; height: 44px; margin: 0 auto 24px; } }
  @keyframes spin { to { transform: rotate(360deg); } }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
  .afu { animation: fadeUp 0.45s cubic-bezier(0.22,0.61,0.36,1) forwards; }
  .asi { animation: scaleIn 0.35s cubic-bezier(0.22,0.61,0.36,1) forwards; }
  .nav-row { display: flex; justify-content: space-between; align-items: center; margin-top: 28px; }
  @media (min-width: 480px) { .nav-row { margin-top: 36px; } }
`;

const GOALS = [
  { icon: GraduationCap, label: "Masuk PTN" },
  { icon: Code, label: "Software Engineer" },
  { icon: Globe, label: "Fasih Bahasa Asing" },
  { icon: Trophy, label: "Juara Kompetisi" },
  { icon: Rocket, label: "Bangun Startup" },
  { icon: Wallet, label: "Financial Freedom" },
  { icon: Dumbbell, label: "Badan Ideal" },
  { icon: BookOpen, label: "Nilai Sempurna" },
  { icon: Palette, label: "UI/UX Designer" },
  { icon: PenTool, label: "Content Creator" },
  { icon: Mic, label: "Public Speaking" },
  { icon: Brain, label: "Data Scientist" },
  { icon: Plane, label: "Kerja di LN" },
  { icon: Video, label: "Video Editor Pro" },
  { icon: Shield, label: "Cyber Security" },
];

const CHALLENGES = [
  { icon: Zap, label: "Sering menunda" },
  { icon: Mic, label: "Kecanduan sosmed" },
  { icon: Heart, label: "Kurang motivasi" },
  { icon: Users, label: "Belum ada teman" },
  { icon: Compass, label: "Bingung mulai" },
  { icon: Clock, label: "Sulit konsisten" },
  { icon: Brain, label: "Overthinking" },
  { icon: Shield, label: "Takut gagal" },
  { icon: Moon, label: "Sering begadang" },
  { icon: Utensils, label: "Pola makan buruk" },
];

const COMMITMENT_LEVELS = [
  { value: 1, label: "Masih coba-coba", icon: Coffee },
  { value: 3, label: "Lumayan serius", icon: Compass },
  { value: 5, label: "Serius, siap berjuang", icon: Target },
  { value: 7, label: "Sangat serius, ini penting", icon: Zap },
  { value: 10, label: "Ini prioritas hidupku", icon: Rocket },
];

// Additional icons needed
import { Users, Clock, Moon, Utensils, Coffee } from "lucide-react";

interface OnboardingData {
  goal: string; commitment: number; challenges: string[]; futureSelf: string;
}

export function OnboardingSteps() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({ goal: "", commitment: 5, challenges: [], futureSelf: "" });

  const updateData = (field: keyof OnboardingData, value: string | number | string[]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleChallenge = (challenge: string) => {
    setData((prev) => ({
      ...prev,
      challenges: prev.challenges.includes(challenge)
        ? prev.challenges.filter((c) => c !== challenge)
        : prev.challenges.length < 3 ? [...prev.challenges, challenge] : prev.challenges,
    }));
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save");
      localStorage.setItem("ascend_onboarded", "true");
      toast.success("Welcome to ASCEND!");
      window.location.href = "/dashboard";
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
      setLoading(false);
    }
  };

  const totalSteps = 4;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="onboard-wrap">
        <div className="onboard-card">
          <div className="progress-bar">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="progress-dot" style={{
                width: i <= step ? "32px" : "16px",
                background: i <= step ? "#f59e0b" : "rgba(255,255,255,0.06)",
                boxShadow: i <= step ? "0 0 12px rgba(245,158,11,0.3)" : "none",
              }} />
            ))}
          </div>

          {step < totalSteps && <p className="step-counter">Step {step + 1} of {totalSteps}</p>}

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35, ease: "easeOut" }}>

              {/* STEP 0 */}
              {step === 0 && (
                <div style={{ textAlign: "center" }}>
                  <div className="asi" style={{ marginBottom: "20px" }}><div className="icon-box"><Compass size={24} style={{ color: "#0a0a0a" }} /></div></div>
                  <h2 className="section-title afu">Pilih tujuanmu</h2>
                  <p className="section-desc afu">Satu langkah besar dimulai dari satu tujuan yang jelas</p>
                  <div className="goal-grid afu">
                    {GOALS.map((goal, i) => {
                      const Icon = goal.icon;
                      return (
                        <button key={goal.label} onClick={() => updateData("goal", goal.label)} className={`goal-btn ${data.goal === goal.label ? "active" : ""}`}>
                          <span className="goal-icon"><Icon size={18} /></span>
                          {goal.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 1 */}
              {step === 1 && (
                <div style={{ textAlign: "center" }}>
                  <div className="asi" style={{ marginBottom: "20px" }}><div className="icon-box"><Heart size={24} style={{ color: "#0a0a0a" }} /></div></div>
                  <h2 className="section-title afu">Seberapa serius kamu?</h2>
                  <p className="section-desc afu">Biar kami bisa temukan partner yang se-level</p>
                  <div className="commitment-list afu">
                    {COMMITMENT_LEVELS.map((level, i) => {
                      const Icon = level.icon;
                      return (
                        <button key={level.value} onClick={() => updateData("commitment", level.value)} className={`commitment-btn ${data.commitment === level.value ? "active" : ""}`}>
                          <Icon size={18} className="commitment-icon" />{level.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div style={{ textAlign: "center" }}>
                  <div className="asi" style={{ marginBottom: "20px" }}><div className="icon-box"><Zap size={24} style={{ color: "#0a0a0a" }} /></div></div>
                  <h2 className="section-title afu">Apa tantangan terbesarmu?</h2>
                  <p className="section-desc afu">Pilih maksimal 3. Biar AI kami ngerti kamu lebih dalam</p>
                  <div className="challenge-grid afu">
                    {CHALLENGES.map((ch) => {
                      const Icon = ch.icon;
                      return (
                        <button key={ch.label} onClick={() => toggleChallenge(ch.label)} className={`challenge-btn ${data.challenges.includes(ch.label) ? "active" : ""}`}>
                          <Icon size={15} />{ch.label}
                        </button>
                      );
                    })}
                  </div>
                  <p style={{ fontSize: "11px", color: "#3a4458", marginTop: "12px" }}>{data.challenges.length}/3 terpilih</p>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div style={{ textAlign: "center" }}>
                  <div className="asi" style={{ marginBottom: "20px" }}><div className="icon-box"><Sparkles size={24} style={{ color: "#0a0a0a" }} /></div></div>
                  <h2 className="section-title afu">Bayangkan dirimu 5 tahun lagi</h2>
                  <p className="section-desc afu">Jika semua berjalan lancar, siapa dirimu?</p>
                  <div className="afu"><input className="onboard-input" placeholder='Contoh: "Software Engineer di Google", "Dokter spesialis"...' value={data.futureSelf} onChange={(e) => updateData("futureSelf", e.target.value)} /></div>
                  <div className="afu quote-box">
                    <p className="quote-text">&ldquo;Ini bukan sekadar mimpi. Ini blueprint masa depanmu. ASCEND akan membantumu sampai ke sana.&rdquo;</p>
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div style={{ textAlign: "center", paddingTop: "32px" }}>
                  <div className="spinner" />
                  <h2 className="afu" style={{ fontSize: "20px", fontWeight: 600, color: "#edeff2", marginBottom: "6px" }}>Menganalisis tujuanmu...</h2>
                  <p className="afu" style={{ fontSize: "13px", color: "#5a6478", fontWeight: 300 }}>Menemukan jalur terbaik untuk masa depanmu</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step < totalSteps && (
            <div className="nav-row">
              {step > 0 ? <button className="btn-back" onClick={() => setStep(step - 1)}><ArrowLeft size={16} /> Back</button> : <div />}
              <button className="btn-next" onClick={() => { if (step === 3) { setStep(4); handleComplete(); } else { setStep(step + 1); } }} disabled={(step === 0 && !data.goal) || (step === 3 && !data.futureSelf)}>
                {step === 3 ? "Generate My Future" : "Next"}<ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "28px" }}>
              <button className="btn-enter" disabled={loading}>
                {loading ? <span style={{ width: "16px", height: "16px", border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#0a0a0a", borderRadius: "50%", animation: "spin 0.6s linear infinite", display: "inline-block", marginRight: "8px" }} /> : <Rocket size={16} style={{ marginRight: "6px" }} />}
                {loading ? "Saving..." : "Enter ASCEND"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}