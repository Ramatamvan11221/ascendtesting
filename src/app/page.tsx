"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Users, Sparkles, TrendingUp, Zap, Star, Camera, Mail, Code } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

// ─── STYLES ──────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,500;1,600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  ::-webkit-scrollbar { width: 0; }

  .page-wrap { position: relative; z-index: 1; width: 100%; max-width: 100vw; overflow-x: hidden; }

    /* ── Theme Toggle (landing page) ── */
  .nav-theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    border-radius: 8px;
    border: 1px solid var(--border-subtle);
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s ease;
    width: 32px;
    height: 32px;
  }

  .nav-theme-toggle:hover {
    border-color: var(--border-medium);
    color: var(--text-primary);
    background: var(--border-subtle);
  }

  /* ── Ambient orbs ── */
  .ambient-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .orb { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.06; will-change: transform; }
  .orb-1 { width: 700px; height: 700px; background: var(--amber); top: -20%; left: -10%; animation: orbFloat1 28s infinite alternate ease-in-out; }
  .orb-2 { width: 500px; height: 500px; background: var(--purple); bottom: -15%; right: -10%; animation: orbFloat2 32s infinite alternate ease-in-out; }
  .orb-3 { width: 300px; height: 300px; background: var(--orange); top: 40%; right: 5%; animation: orbFloat3 20s infinite alternate ease-in-out; opacity: 0.04; }
  @keyframes orbFloat1 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(40px, -30px) scale(1.1); } }
  @keyframes orbFloat2 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(-50px, 40px) scale(1.15); } }
  @keyframes orbFloat3 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(20px, 20px) scale(1.2); } }

  .noise-overlay {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 256px 256px;
  }

  /* ── Navigation ── */
  .nav-bar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 50;
    padding: 0 16px; transition: all 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
  }
  .nav-bar.scrolled {
    background: var(--bg-secondary);
    backdrop-filter: blur(32px) saturate(1.2);
    -webkit-backdrop-filter: blur(32px) saturate(1.2);
    border-bottom: 1px solid var(--border-subtle);
  }
  @media (min-width: 768px) { .nav-bar { padding: 0 32px; } }

  .nav-inner { max-width: 1200px; margin: 0 auto; height: 60px; display: flex; align-items: center; justify-content: space-between; }
  .nav-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .nav-brand-icon { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, var(--amber), var(--orange)); display: flex; align-items: center; justify-content: center; }
  .nav-brand-text { font-weight: 700; color: var(--text-primary); font-size: 17px; letter-spacing: -0.02em; }

  .btn-ghost-nav {
    color: var(--text-secondary); background: transparent;
    padding: 8px 16px; font-size: 13px; font-weight: 500;
    border: none; border-radius: 10px; cursor: pointer;
    transition: all 0.3s ease; text-decoration: none;
  }
  .btn-ghost-nav:hover { color: var(--text-primary); background: var(--border-subtle); }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 24px; border-radius: 12px; font-size: 14px;
    font-weight: 500; text-decoration: none; letter-spacing: 0.02em;
    border: none; cursor: pointer;
    transition: all 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
    white-space: nowrap;
  }
  @media (min-width: 480px) { .btn { padding: 15px 34px; font-size: 15px; border-radius: 14px; } }
  .btn-primary {
    background: linear-gradient(135deg, var(--amber), var(--orange));
    color: var(--text-inverse);
    box-shadow: 0 20px 50px -20px rgba(245, 158, 11, 0.45);
  }
  .btn-primary:hover { transform: scale(1.03); box-shadow: 0 24px 60px -18px rgba(245, 158, 11, 0.6); }
  .btn-outline {
    border: 1px solid var(--border-medium);
    color: var(--text-primary); background: transparent;
  }
  .btn-outline:hover { background: var(--border-subtle); border-color: var(--border-strong); }

  /* ── Typography ── */
  .hero-title { font-size: clamp(40px, 9vw, 110px); font-weight: 800; line-height: 0.94; letter-spacing: -0.04em; color: var(--text-primary); }
  .text-gradient {
    background: linear-gradient(135deg, var(--amber), var(--orange), var(--amber));
    background-size: 300% 300%;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientFlow 6s ease infinite;
  }
  @keyframes gradientFlow { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

  .display-text {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(24px, 4.5vw, 44px);
    font-weight: 500; font-style: italic; line-height: 1.45;
  }
  .section-tag {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 14px; border-radius: 999px;
    background: rgba(245, 158, 11, 0.08);
    border: 1px solid rgba(245, 158, 11, 0.2);
    font-size: 10px; letter-spacing: 0.12em; font-weight: 600;
    color: #fbbf24; white-space: nowrap;
  }
  @media (min-width: 480px) { .section-tag { font-size: 11px; padding: 6px 18px; } }

  .stat-value { font-size: 22px; font-weight: 700; color: var(--text-primary); }
  .stat-label { font-size: 9px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }

  /* ── Animations ── */
  @keyframes fadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes scaleIn { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
  .afu{opacity:0;animation:fadeUp 0.8s cubic-bezier(0.22,0.61,0.36,1) forwards}
  .afi{opacity:0;animation:fadeIn 1s ease forwards}
  .asi{opacity:0;animation:scaleIn 0.7s cubic-bezier(0.22,0.61,0.36,1) forwards}
  .d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.3s}.d4{animation-delay:.4s}.d5{animation-delay:.5s}.d6{animation-delay:.6s}.d7{animation-delay:.7s}

  .hero-word { display: inline-block; opacity: 0; animation: wordIn 0.7s ease forwards; }
  .hero-word:nth-child(1) { animation-delay: 0.1s; }
  .hero-word:nth-child(2) { animation-delay: 0.2s; }
  .hero-word:nth-child(3) { animation-delay: 0.3s; }
  .hero-word:nth-child(4) { animation-delay: 0.4s; }
  @keyframes wordIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

  /* ── Scroll reveal ── */
  .sr { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.22, 0.61, 0.36, 1); }
  .sr.visible { opacity: 1; transform: translateY(0); }
  .sr-delay-1 { transition-delay: 0.08s; }
  .sr-delay-2 { transition-delay: 0.16s; }
  .sr-delay-3 { transition-delay: 0.24s; }

  /* ── Layout ── */
  .section-pad { padding: 40px 16px 80px; }
  @media (min-width: 768px) { .section-pad { padding: 60px 32px 120px; } }

  .hero-section {
    min-height: 100vh; display: flex; align-items: center;
    padding: 90px 16px 80px; position: relative; overflow: hidden;
  }
  @media (min-width: 480px) { .hero-section { padding: 90px 24px 80px; } }
  @media (min-width: 768px) { .hero-section { padding: 90px 32px 80px; } }

  /* ── Hard split background (not a fade — a torn, jagged seam) ── */
  .hero-split-bg { position: absolute; inset: 0; z-index: 0; }
  .hero-split-panel-left {
    position: absolute; inset: 0;
    background: var(--bg-primary);
    clip-path: polygon(0% 0%, 60% 0%, 52% 18%, 66% 38%, 48% 58%, 62% 78%, 54% 100%, 0% 100%);
  }
  .hero-split-panel-right {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.10), transparent 60%),
      var(--bg-secondary);
    clip-path: polygon(100% 0%, 60% 0%, 52% 18%, 66% 38%, 48% 58%, 62% 78%, 54% 100%, 100% 100%);
  }
  /* thin hot seam line traced along the same jagged path, sitting on top of the cut */
  .hero-split-seam {
    position: absolute; inset: 0;
    clip-path: polygon(0% 0%, 60% 0%, 52% 18%, 66% 38%, 48% 58%, 62% 78%, 54% 100%, 0% 100%);
    -webkit-mask: linear-gradient(#000, #000);
    box-shadow: inset -2px 0 0 0 rgba(245,158,11,0.35);
  }
  @media (max-width: 1023px) {
    .hero-split-panel-left, .hero-split-panel-right, .hero-split-seam { clip-path: none; }
    .hero-split-panel-right { display: none; }
  }

  .hero-content { position: relative; z-index: 15; width: 100%; max-width: 700px; margin: 0 auto; }
  @media (min-width: 1024px) { .hero-content { margin: 0; } }

  .stats-row { display: flex; gap: 32px; margin-top: 40px; border-top: 1px solid var(--border-subtle); padding-top: 28px; flex-wrap: wrap; }
  @media (min-width: 480px) { .stats-row { gap: 48px; margin-top: 56px; padding-top: 32px; } }

  .features-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
  @media (min-width: 768px) { .features-grid { grid-template-columns: repeat(3, 1fr); gap: 28px; } }

  .feature-card {
    background: var(--bg-card);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--border-subtle);
    border-radius: 20px;
    overflow: hidden;
    transition: transform 0.4s ease, box-shadow 0.4s ease;
  }
  .feature-card:hover { transform: translateY(-6px); box-shadow: 0 30px 60px -30px rgba(0,0,0,0.6); }
  .feature-img { height: 180px; overflow: hidden; border-radius: 20px 20px 0 0; }
  .feature-img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(1) saturate(1); transition: filter 0.6s ease; }
  .feature-card:hover .feature-img img { filter: brightness(0.5) saturate(0.4); }
  .feature-body { padding: 20px; }
  .feature-icon { width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }

  .testimonial-grid { display: grid; grid-template-columns: 1fr; gap: 40px; align-items: center; }
  @media (min-width: 768px) { .testimonial-grid { grid-template-columns: 1fr 1fr; gap: 72px; } }
  .testimonial-img { height: 280px; border-radius: 20px; overflow: hidden; }
  @media (min-width: 768px) { .testimonial-img { height: 420px; } }
  .testimonial-img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(1) saturate(1); }

  .avatar-ring { display: flex; margin-top: 20px; }
  .avatar { width: 30px; height: 30px; border-radius: 50%; border: 2px solid var(--bg-secondary); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #fff; }
  .avatar:not(:first-child) { margin-left: -10px; }

  .footer-inner { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  @media (min-width: 768px) { .footer-inner { flex-direction: row; justify-content: space-between; } }

  .wave-divider { position: relative; margin-top: -70px; }
  .wave-divider svg { display: block; width: 100%; height: 100px; }

  .desktop-hero-visual { display: none; }
  @media (min-width: 1024px) { .desktop-hero-visual { display: block; } }

  /* ── Floating hero elements (cinematic depth) ── */
  .floating-card {
    position: absolute;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--border-subtle);
    box-shadow: 0 20px 40px -20px rgba(0,0,0,0.5);
    transition: transform 0.3s ease;
    will-change: transform;
  }
  .floating-card img { width: 100%; height: 100%; object-fit: cover; filter: brightness(1) saturate(1); }
  .floating-card .label {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 10px 14px;
    background: linear-gradient(transparent, rgba(0,0,0,0.7));
    font-size: 9px; font-weight: 600; letter-spacing: 0.04em;
    color: var(--amber);
  }

  /* ── 3D objects (pure CSS, no extra deps) ── */
  .scene3d { perspective: 1000px; position: absolute; }
  .cube3d {
    width: 90px; height: 90px; position: relative;
    transform-style: preserve-3d;
    animation: cubeSpin 14s linear infinite;
  }
  .cube3d .face {
    position: absolute; width: 90px; height: 90px;
    border: 1px solid var(--border-subtle);
    background: linear-gradient(135deg, rgba(245,158,11,0.28), rgba(139,92,246,0.22));
    backdrop-filter: blur(2px);
    box-shadow: inset 0 0 30px rgba(245,158,11,0.08);
  }
  .cube3d .front  { transform: translateZ(45px); }
  .cube3d .back   { transform: translateZ(-45px) rotateY(180deg); }
  .cube3d .right  { transform: rotateY(90deg) translateZ(45px); }
  .cube3d .left   { transform: rotateY(-90deg) translateZ(45px); }
  .cube3d .top    { transform: rotateX(90deg) translateZ(45px); background: linear-gradient(135deg, rgba(249,115,22,0.3), rgba(245,158,11,0.18)); }
  .cube3d .bottom { transform: rotateX(-90deg) translateZ(45px); }
  @keyframes cubeSpin {
    from { transform: rotateX(0deg) rotateY(0deg); }
    to   { transform: rotateX(360deg) rotateY(360deg); }
  }

  .ring3d {
    width: 140px; height: 140px; border-radius: 50%;
    border: 2px solid rgba(245,158,11,0.35);
    position: relative;
    transform-style: preserve-3d;
    animation: ringTumble 18s linear infinite;
  }
  .ring3d::before, .ring3d::after {
    content: ""; position: absolute; inset: 0; border-radius: 50%;
  }
  .ring3d::before { border: 2px solid rgba(139,92,246,0.3); transform: rotateX(60deg); }
  .ring3d::after { border: 2px solid rgba(249,115,22,0.28); transform: rotateY(60deg); }
  @keyframes ringTumble {
    from { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
    to   { transform: rotateX(360deg) rotateY(180deg) rotateZ(360deg); }
  }

  .shard3d {
    width: 60px; height: 60px;
    background: linear-gradient(135deg, var(--amber), var(--purple));
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    opacity: 0.35;
    animation: shardFloat 9s ease-in-out infinite;
    filter: blur(0.3px);
  }
  @keyframes shardFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-24px) rotate(180deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    .cube3d, .ring3d, .shard3d, .orb, .text-gradient { animation: none !important; }
  }

  /* ── Contact section ── */
  .contact-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
  @media (min-width: 640px) { .contact-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; } }
  .contact-card {
    display: flex; align-items: center; gap: 14px;
    padding: 18px 20px; border-radius: 16px;
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    text-decoration: none;
    transition: all 0.35s cubic-bezier(0.22, 0.61, 0.36, 1);
  }
  .contact-card:hover { transform: translateY(-4px); border-color: rgba(245,158,11,0.25); box-shadow: 0 20px 40px -24px rgba(245,158,11,0.25); }
  .contact-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .contact-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; }
  .contact-value { font-size: 14px; color: var(--text-primary); font-weight: 600; }
`;

// ─── COMPONENTS ──────────────────────────────────────────────────────────

function Navbar({ scrolled, loggedIn }: { scrolled: boolean; loggedIn: boolean }) {
  return (
    <nav className={`nav-bar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <Link href="/" className="nav-brand">
          <div className="nav-brand-icon">
            <Zap size={14} style={{ color: "var(--text-inverse)" }} />
          </div>
          <span className="nav-brand-text">ASCEND</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ThemeToggle />
          <Link href={loggedIn ? "/dashboard" : "/login"} className="btn-ghost-nav">
            {loggedIn ? "Dashboard" : "Sign In"}
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ─── WAVE DIVIDERS ──────────────────────────────────────────────────

function WaveDivider() {
  return (
    <div className="wave-divider">
      <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M0 24 C360 0, 720 48, 1080 24 C1260 12, 1380 24, 1440 24 L1440 48 L0 48 Z" fill="var(--bg-tertiary)" />
      </svg>
    </div>
  );
}

function WaveDividerDark() {
  return (
    <div className="wave-divider">
      <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M0 24 C360 0, 720 48, 1080 24 C1260 12, 1380 24, 1440 24 L1440 48 L0 48 Z" fill="var(--bg-secondary)" />
      </svg>
    </div>
  );
}

function WaveDividerDeep() {
  return (
    <div className="wave-divider">
      <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M0 24 C360 0, 720 48, 1080 24 C1260 12, 1380 24, 1440 24 L1440 48 L0 48 Z" fill="var(--bg-primary)" />
      </svg>
    </div>
  );
}

// ─── MAIN ──────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // ── Scroll state ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Responsive ──
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Auth check ──
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setLoggedIn(d?.authenticated || false))
      .catch(() => setLoggedIn(false));
  }, []);

  // ── Scroll reveal observer ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".sr").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const ctaLink = loggedIn ? "/dashboard" : "/register";
  const signInLink = loggedIn ? "/dashboard" : "/login";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ── Ambient background ── */}
      <div className="ambient-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <div className="noise-overlay" />

      <div className="page-wrap">
        <Navbar scrolled={scrolled} loggedIn={loggedIn} />

        {/* ─── HERO ────────────────────────────────────────────────── */}
        <section className="hero-section">
          {/* Hard, jagged two-tone split — not a fade, a torn seam between the copy side and the visual side */}
          <div className="hero-split-bg" aria-hidden="true">
            <div className="hero-split-panel-left" />
            <div className="hero-split-panel-right" />
            <div className="hero-split-seam" />
          </div>

          <div className="hero-content">
            <div className="afi" style={{ marginBottom: "20px" }}>
              <span className="section-tag">
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--amber)", display: "inline-block", marginRight: "6px" }} />
                PARTNER FOR AMBITIOUS PEOPLE
              </span>
            </div>

            <h1 className="hero-title afu">
              <span className="hero-word">FIND YOUR</span><br />
              <span className="hero-word text-gradient">PEOPLE.</span><br />
              <span className="hero-word">BUILD YOUR</span><br />
              <span className="hero-word text-gradient">FUTURE.</span>
            </h1>

            <p className="afu d3" style={{ fontSize: "15px", fontWeight: 300, color: "var(--text-secondary)", maxWidth: "440px", margin: "20px 0 28px", lineHeight: 1.7 }}>
              ASCEND connects ambitious individuals with like-minded communities. AI-powered roadmaps, realtime collaboration, and the accountability to rise together.
            </p>

            <div className="afu d5" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link href={ctaLink} className="btn btn-primary">
                <ArrowRight size={14} /> {loggedIn ? "Dashboard" : "Start Your Journey"}
              </Link>
              <Link href="/squads" className="btn btn-outline">
                <Users size={14} /> Explore Squads
              </Link>
            </div>

            <div className="afu d7 stats-row">
              <div><p className="stat-value">4,800+</p><p className="stat-label">Dreamers</p></div>
              <div><p className="stat-value">200+</p><p className="stat-label">Squads</p></div>
              <div><p className="stat-value">32K+</p><p className="stat-label">Tasks</p></div>
            </div>
          </div>

          {/* ── Desktop cinematic visual (right, "image" side of the split) ── */}
          {isDesktop && (
            <div className="desktop-hero-visual" style={{ position: "absolute", right: "-20px", top: "45%", transform: "translateY(-50%)", width: "480px", height: "480px", zIndex: 5, pointerEvents: "none" }}>
              {/* Main card */}
              <div className="floating-card" style={{ width: "280px", height: "280px", top: "8%", left: "16%", borderRadius: "24px", borderColor: "rgba(245,158,11,0.12)" }}>
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80" alt="Community" />
                <div className="label">FIND YOUR SQUAD</div>
              </div>

              {/* 3D cube, floating top-right of the main card */}
              <div className="scene3d" style={{ top: "-4%", right: "6%" }}>
                <div className="cube3d">
                  <div className="face front" />
                  <div className="face back" />
                  <div className="face right" />
                  <div className="face left" />
                  <div className="face top" />
                  <div className="face bottom" />
                </div>
              </div>

              {/* 3D tumbling ring, bottom-right */}
              <div className="scene3d" style={{ bottom: "0%", right: "-8%" }}>
                <div className="ring3d" />
              </div>

              {/* Floating shard accent */}
              <div className="shard3d" style={{ position: "absolute", top: "60%", left: "-6%" }} />
            </div>
          )}
        </section>

        <WaveDivider />

        {/* ─── FEATURES ────────────────────────────────────────────── */}
        <section className="section-pad" style={{ background: "var(--bg-tertiary)", position: "relative", overflow: "hidden" }}>
          <div className="shard3d" style={{ position: "absolute", top: "6%", right: "6%", opacity: 0.2 }} />
          <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span className="section-tag afi">Why ASCEND</span>
              <h2 className="display-text afu" style={{ color: "var(--text-primary)", marginTop: "12px", fontStyle: "normal", fontWeight: 700, fontSize: "clamp(28px, 5vw, 48px)" }}>
                Everything you need to <span className="text-gradient">rise</span>
              </h2>
            </div>

            <div className="features-grid">
              {[
                { icon: Users, color: "var(--amber)", title: "Find Your Squad", desc: "Connect with people who share your exact goals. No more lonely grinding.", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" },
                { icon: Sparkles, color: "var(--orange)", title: "AI Roadmap", desc: "Advanced AI creates your personalized step-by-step journey.", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80" },
                { icon: TrendingUp, color: "var(--purple)", title: "Grow Together", desc: "Shared tasks, real-time accountability, and celebration moments.", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80" },
              ].map((f, i) => (
                <div key={f.title} className={`feature-card sr sr-delay-${i + 1}`}>
                  <div className="feature-img">
                    <img src={f.img} alt={f.title} />
                  </div>
                  <div className="feature-body">
                    <div className="feature-icon" style={{ background: `${f.color}18` }}>
                      <f.icon size={20} style={{ color: f.color }} />
                    </div>
                    <h3 style={{ fontSize: "17px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>{f.title}</h3>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, fontWeight: 300 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <WaveDividerDark />

        {/* ─── TESTIMONIAL ──────────────────────────────────────────── */}
        <section className="section-pad" style={{ background: "var(--bg-secondary)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }} className="testimonial-grid">
            <div className="sr">
              <span className="section-tag">Testimonial</span>
              <p className="display-text" style={{ color: "var(--text-primary)", marginTop: "14px" }}>
                &ldquo;ASCEND helped me find my people. Now I&apos;m not chasing dreams alone.&rdquo;
              </p>
              <div style={{ marginTop: "16px" }}>
                <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "15px" }}>Rama, 19</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Pejuang UGM 2026</p>
              </div>
              <div className="avatar-ring">
                {["#f59e0b","#f97316","#ef4444","#8b5cf6","#06b6d4","#10b981","#3b82f6","#ec4899"].map((c, i) => (
                  <div key={i} className="avatar" style={{ background: c }}>{String.fromCharCode(65 + i)}</div>
                ))}
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "10px" }}>Joined by 4,800+ dreamers</p>
            </div>
            <div className="testimonial-img sr sr-delay-1">
              <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" alt="Community" />
            </div>
          </div>
        </section>

        <WaveDividerDeep />

        {/* ─── CTA ──────────────────────────────────────────────────── */}
        <section className="section-pad" style={{ background: "var(--bg-primary)", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div className="scene3d" style={{ top: "8%", left: "6%", display: isDesktop ? "block" : "none" }}>
            <div className="ring3d" style={{ width: "100px", height: "100px" }} />
          </div>
          <div className="sr" style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}>
            <div className="asi" style={{ marginBottom: "24px" }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "16px",
                background: "linear-gradient(135deg, var(--amber), var(--orange))",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto", boxShadow: "0 20px 40px -16px rgba(245,158,11,0.4)"
              }}>
                <Star size={24} style={{ color: "var(--text-inverse)" }} />
              </div>
            </div>
            <h2 className="hero-title" style={{ fontSize: "clamp(36px, 8vw, 72px)" }}>
              READY TO<br /><span className="text-gradient">ASCEND?</span>
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", maxWidth: "360px", margin: "18px auto 28px", lineHeight: 1.6, fontWeight: 300 }}>
              Join thousands of ambitious individuals already building their future on ASCEND.
            </p>
            <Link href={ctaLink} className="btn btn-primary" style={{ padding: "15px 36px", fontSize: "15px" }}>
              <ArrowRight size={16} /> {loggedIn ? "Dashboard" : "Enter ASCEND"}
            </Link>
            <p style={{ marginTop: "20px", fontSize: "12px", color: "var(--text-muted)" }}>Find Your People. Build Your Future.</p>
          </div>
        </section>

        {/* ─── CONTACT ──────────────────────────────────────────────── */}
        <section className="section-pad sr" style={{ background: "var(--bg-secondary)", paddingBottom: "48px" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <span className="section-tag">Get In Touch</span>
              <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", marginTop: "12px" }}>
                Talk to the team behind ASCEND
              </h3>
            </div>
            <div className="contact-grid">
              <a href="https://instagram.com/ascend.id" target="_blank" rel="noopener noreferrer" className="contact-card">
                <div className="contact-icon" style={{ background: "rgba(236,72,153,0.14)" }}>
                  <Camera size={18} style={{ color: "#ec4899" }} />
                </div>
                <div>
                  <p className="contact-label">Instagram</p>
                  <p className="contact-value">@ascend.id</p>
                </div>
              </a>
              <a href="mailto:hello@ascend.app" className="contact-card">
                <div className="contact-icon" style={{ background: "rgba(245,158,11,0.14)" }}>
                  <Mail size={18} style={{ color: "var(--amber)" }} />
                </div>
                <div>
                  <p className="contact-label">Email</p>
                  <p className="contact-value">hello@ascend.app</p>
                </div>
              </a>
              <a href="https://github.com/ascend-dev" target="_blank" rel="noopener noreferrer" className="contact-card">
                <div className="contact-icon" style={{ background: "rgba(139,92,246,0.14)" }}>
                  <Code size={18} style={{ color: "var(--purple)" }} />
                </div>
                <div>
                  <p className="contact-label">Developer</p>
                  <p className="contact-value">@ascend-dev</p>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ────────────────────────────────────────────────── */}
        <footer className="sr" style={{ padding: "28px 16px", background: "var(--bg-primary)", borderTop: "1px solid var(--border-subtle)" }}>
          <div className="footer-inner" style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "18px", height: "18px", borderRadius: "4px", background: "linear-gradient(135deg, var(--amber), var(--orange))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={9} style={{ color: "var(--text-inverse)" }} />
              </div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>ASCEND — Find Your People. Build Your Future.</span>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <Link href={signInLink} style={{ fontSize: "11px", color: "var(--text-muted)", textDecoration: "none" }}>
                {loggedIn ? "Dashboard" : "Sign In"}
              </Link>
              <Link href={ctaLink} style={{ fontSize: "11px", color: "var(--text-secondary)", textDecoration: "none" }}>
                {loggedIn ? "Dashboard" : "Get Started"}
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}