"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Sparkles, Target, Heart, Rocket, Zap, Compass, Star,
  GraduationCap, Code, Globe, Trophy, Briefcase, Wallet, Dumbbell, BookOpen,
  Palette, PenTool, Mic, Brain, Plane, Video, Shield, Search, Plus, X,
  CheckCircle2, Users, Clock, Moon, Utensils, Coffee, type LucideIcon
} from "lucide-react";
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

  /* ===== FLOATING GOAL BUBBLES (decorative, behind card) ===== */
  .goal-float {
    position: absolute; border-radius: 16px;
    border: 1px solid rgba(245,158,11,0.16);
    background: linear-gradient(135deg, rgba(245,158,11,0.05), rgba(249,115,22,0.015));
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    color: rgba(245,158,11,0.4); pointer-events: none; z-index: 1;
    animation: goalFloat 9s ease-in-out infinite;
  }
  @keyframes goalFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
    50% { transform: translateY(-16px) rotate(6deg); opacity: 1; }
  }

  .goal-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; position: relative; z-index: 5; }
  @media (min-width: 480px) { .goal-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; } }
  .goal-btn { padding: 10px 8px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.015); cursor: pointer; text-align: center; transition: all 0.3s ease; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; color: #9aa4b8; display: flex; flex-direction: column; align-items: center; gap: 6px; }
  @media (min-width: 480px) { .goal-btn { padding: 14px 10px; font-size: 13px; border-radius: 16px; } }
  .goal-btn:hover { border-color: rgba(245,158,11,0.3); background: rgba(245,158,11,0.04); color: #edeff2; }
  .goal-btn.active { border-color: rgba(245,158,11,0.5); background: rgba(245,158,11,0.08); color: #f59e0b; box-shadow: 0 0 30px rgba(245,158,11,0.08); }
  .goal-icon { display: flex; justify-content: center; }

  /* ===== CATEGORY TABS ===== */
  .category-tabs { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 14px; scrollbar-width: none; position: relative; z-index: 5; }
  .category-tabs::-webkit-scrollbar { display: none; }
  .category-pill {
    flex-shrink: 0; display: flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02); color: #5a6478; font-size: 12px; font-weight: 500;
    cursor: pointer; transition: all 0.3s ease; white-space: nowrap; font-family: 'Inter', sans-serif;
  }
  .category-pill:hover { color: #9aa4b8; border-color: rgba(245,158,11,0.2); }
  .category-pill.active {
    background: linear-gradient(135deg, rgba(245,158,11,0.16), rgba(249,115,22,0.08));
    border-color: rgba(245,158,11,0.4); color: #f59e0b;
  }

  /* ===== SEARCH ===== */
  .goal-search { position: relative; margin-bottom: 14px; z-index: 5; }
  .goal-search input {
    width: 100%; padding: 12px 14px 12px 40px; border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02);
    color: #edeff2; font-family: 'Inter', sans-serif; font-size: 13px; outline: none; transition: all 0.3s ease;
  }
  .goal-search input:focus { border-color: rgba(245,158,11,0.4); box-shadow: 0 0 0 4px rgba(245,158,11,0.04); }
  .goal-search input::placeholder { color: #3a4458; }
  .goal-search .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #5a6478; pointer-events: none; }

  .no-results { text-align: center; padding: 28px 12px; color: #3a4458; font-size: 12px; position: relative; z-index: 5; }

  /* ===== CUSTOM GOAL ===== */
  .custom-goal-box { display: flex; gap: 8px; margin-top: 16px; position: relative; z-index: 5; }
  .custom-goal-box input {
    flex: 1; padding: 12px 14px; border-radius: 12px;
    border: 1px dashed rgba(245,158,11,0.28); background: rgba(245,158,11,0.02);
    color: #edeff2; font-family: 'Inter', sans-serif; font-size: 13px; outline: none; transition: all 0.3s ease;
  }
  .custom-goal-box input:focus { border-color: rgba(245,158,11,0.5); border-style: solid; background: rgba(245,158,11,0.04); }
  .custom-goal-box input::placeholder { color: #3a4458; }
  .btn-add-goal {
    flex-shrink: 0; width: 44px; height: 44px; border-radius: 12px;
    background: linear-gradient(135deg, #f59e0b, #f97316); border: none;
    display: flex; align-items: center; justify-content: center; cursor: pointer;
    color: #0a0a0a; transition: all 0.3s ease; box-shadow: 0 10px 26px -12px rgba(245,158,11,0.4);
  }
  .btn-add-goal:hover { transform: scale(1.06) rotate(90deg); }
  .btn-add-goal:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

  .custom-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; position: relative; z-index: 5; }
  .custom-chip {
    display: flex; align-items: center; gap: 6px; padding: 7px 8px 7px 12px;
    border-radius: 999px; font-size: 11px; font-weight: 500;
    border: 1px solid rgba(245,158,11,0.28); background: rgba(245,158,11,0.05);
    color: #f0b657; cursor: pointer; transition: all 0.3s ease; font-family: 'Inter', sans-serif;
  }
  .custom-chip.active {
    background: linear-gradient(135deg, rgba(245,158,11,0.2), rgba(249,115,22,0.1));
    color: #f59e0b; box-shadow: 0 0 20px rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.5);
  }
  .custom-chip .chip-x { background: none; border: none; color: inherit; cursor: pointer; display: flex; align-items: center; padding: 2px; opacity: 0.5; transition: opacity 0.2s; }
  .custom-chip .chip-x:hover { opacity: 1; }

  .selected-goal-banner {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    margin-top: 18px; padding: 10px 16px; border-radius: 12px;
    background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.2);
    color: #10b981; font-size: 12px; font-weight: 500; position: relative; z-index: 5;
  }

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

  @media (max-width: 480px) { .goal-float { display: none; } }
`;

type GoalCategory = "academic" | "career" | "business" | "growth";

const GOALS: { icon: unknown; label: string; category: GoalCategory }[] = [
  { icon: GraduationCap, label: "Masuk PTN", category: "academic" },
  { icon: BookOpen, label: "Nilai Sempurna", category: "academic" },
  { icon: Trophy, label: "Juara Kompetisi", category: "academic" },
  { icon: Code, label: "Software Engineer", category: "career" },
  { icon: Palette, label: "UI/UX Designer", category: "career" },
  { icon: PenTool, label: "Content Creator", category: "career" },
  { icon: Video, label: "Video Editor Pro", category: "career" },
  { icon: Shield, label: "Cyber Security", category: "career" },
  { icon: Brain, label: "Data Scientist", category: "career" },
  { icon: Rocket, label: "Bangun Startup", category: "business" },
  { icon: Wallet, label: "Financial Freedom", category: "business" },
  { icon: Briefcase, label: "Karier Impian", category: "business" },
  { icon: Dumbbell, label: "Badan Ideal", category: "growth" },
  { icon: Mic, label: "Public Speaking", category: "growth" },
  { icon: Globe, label: "Fasih Bahasa Asing", category: "growth" },
];

const CATEGORIES: { key: "all" | GoalCategory; label: string; icon: unknown }[] = [
  { key: "all", label: "Semua", icon: Sparkles },
  { key: "academic", label: "Akademik", icon: GraduationCap },
  { key: "career", label: "Karier", icon: Briefcase },
  { key: "business", label: "Bisnis", icon: Rocket },
  { key: "growth", label: "Personal Growth", icon: Heart },
];

const FLOATING_DECOR = [
  { Icon: Rocket, style: { top: "4%", left: "-4%" }, size: 34, delay: "0s", duration: "10s" },
  { Icon: Code, style: { top: "10%", right: "-3%" }, size: 28, delay: "1.4s", duration: "8.5s" },
  { Icon: Globe, style: { bottom: "14%", left: "-3%" }, size: 30, delay: "0.8s", duration: "9.5s" },
  { Icon: Trophy, style: { bottom: "6%", right: "-4%" }, size: 26, delay: "2.1s", duration: "11s" },
  { Icon: Palette, style: { top: "42%", left: "-6%" }, size: 24, delay: "1.1s", duration: "9s" },
  { Icon: Star, style: { top: "46%", right: "-5%" }, size: 22, delay: "0.4s", duration: "8s" },
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

interface OnboardingData {
  goal: string; commitment: number; challenges: string[]; futureSelf: string;
}

export function OnboardingSteps() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({ goal: "", commitment: 5, challenges: [], futureSelf: "" });

  // ==== goal selection UI state ====
  const [activeCategory, setActiveCategory] = useState<"all" | GoalCategory>("all");
  const [goalSearch, setGoalSearch] = useState("");
  const [customGoalInput, setCustomGoalInput] = useState("");
  const [customGoals, setCustomGoals] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ascend_custom_goals");
      if (saved) setCustomGoals(JSON.parse(saved));
    } catch {
      // ignore malformed storage
    }
  }, []);

  const persistCustomGoals = (goals: string[]) => {
    setCustomGoals(goals);
    try {
      localStorage.setItem("ascend_custom_goals", JSON.stringify(goals));
    } catch {
      // storage unavailable, ignore silently
    }
  };

  const addCustomGoal = () => {
    const trimmed = customGoalInput.trim();
    if (!trimmed) return;
    if (trimmed.length > 60) {
      toast.error("Maksimal 60 karakter ya");
      return;
    }
    const updated = customGoals.includes(trimmed) ? customGoals : [...customGoals, trimmed];
    persistCustomGoals(updated);
    updateData("goal", trimmed);
    setCustomGoalInput("");
    toast.success("Tujuan kamu tersimpan!");
  };

  const removeCustomGoal = (goal: string) => {
    const updated = customGoals.filter((g) => g !== goal);
    persistCustomGoals(updated);
    if (data.goal === goal) updateData("goal", "");
  };

  const filteredGoals = GOALS.filter((g) => {
    const matchesCategory = activeCategory === "all" || g.category === activeCategory;
    const matchesSearch = g.label.toLowerCase().includes(goalSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        {/* Floating decorative goal bubbles — only during step 0 */}
        {step === 0 && FLOATING_DECOR.map(({ Icon, style, size, delay, duration }, i) => (
          <div
            key={i}
            className="goal-float"
            style={{ ...style, width: size, height: size, animationDelay: delay, animationDuration: duration }}
          >
            <Icon size={size * 0.45} />
          </div>
        ))}

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

              {/* STEP 0 — REDESIGNED GOAL SELECTION */}
              {step === 0 && (
                <div style={{ textAlign: "center", position: "relative" }}>
                  <div className="asi" style={{ marginBottom: "20px" }}><div className="icon-box"><Compass size={24} style={{ color: "#0a0a0a" }} /></div></div>
                  <h2 className="section-title afu">Pilih tujuanmu</h2>
                  <p className="section-desc afu">Satu langkah besar dimulai dari satu tujuan yang jelas</p>

                  {/* Category tabs */}
                  <div className="category-tabs afu">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.key}
                          className={`category-pill ${activeCategory === cat.key ? "active" : ""}`}
                          onClick={() => setActiveCategory(cat.key)}
                        >
                          <Icon size={13} /> {cat.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Search */}
                  <div className="goal-search afu">
                    <Search size={15} className="search-icon" />
                    <input
                      placeholder="Cari tujuan lain, misal: 'Jadi Arsitek'..."
                      value={goalSearch}
                      onChange={(e) => setGoalSearch(e.target.value)}
                    />
                  </div>

                  {/* Goal grid */}
                  {filteredGoals.length > 0 ? (
                    <div className="goal-grid afu">
                      {filteredGoals.map((goal) => {
                        const Icon = goal.icon;
                        return (
                          <button key={goal.label} onClick={() => updateData("goal", goal.label)} className={`goal-btn ${data.goal === goal.label ? "active" : ""}`}>
                            <span className="goal-icon"><Icon size={18} /></span>
                            {goal.label}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="no-results afu">Nggak ketemu tuh — tulis tujuanmu sendiri di bawah ini 👇</p>
                  )}

                  {/* Custom goal input */}
                  <div className="custom-goal-box afu">
                    <input
                      placeholder="Tujuanmu nggak ada di atas? Ketik sendiri di sini..."
                      value={customGoalInput}
                      onChange={(e) => setCustomGoalInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomGoal(); } }}
                    />
                    <button className="btn-add-goal" onClick={addCustomGoal} disabled={!customGoalInput.trim()}>
                      <Plus size={18} />
                    </button>
                  </div>

                  {/* Custom goal chips */}
                  {customGoals.length > 0 && (
                    <div className="custom-chips afu">
                      {customGoals.map((g) => (
                        <div key={g} className={`custom-chip ${data.goal === g ? "active" : ""}`} onClick={() => updateData("goal", g)}>
                          <Sparkles size={11} /> {g}
                          <button className="chip-x" onClick={(e) => { e.stopPropagation(); removeCustomGoal(g); }}>
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Selected confirmation */}
                  {data.goal && (
                    <div className="selected-goal-banner afu">
                      <CheckCircle2 size={14} /> Tujuanmu: <strong>{data.goal}</strong>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 1 */}
              {step === 1 && (
                <div style={{ textAlign: "center" }}>
                  <div className="asi" style={{ marginBottom: "20px" }}><div className="icon-box"><Heart size={24} style={{ color: "#0a0a0a" }} /></div></div>
                  <h2 className="section-title afu">Seberapa serius kamu?</h2>
                  <p className="section-desc afu">Biar kami bisa temukan partner yang se-level</p>
                  <div className="commitment-list afu">
                    {COMMITMENT_LEVELS.map((level) => {
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