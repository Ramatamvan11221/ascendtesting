"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Users, Sparkles, TrendingUp, Zap, Star } from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,500;1,600&display=swap');
  :root { --bg-deep: #070c14; --text: #edeff2; --text-secondary: #9aa4b8; --text-muted: #5a6478; --border: rgba(255,255,255,0.05); }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; background: var(--bg-deep); color: var(--text); }
  ::-webkit-scrollbar { width: 0; }
  .page-wrap { position: relative; z-index: 1; width: 100%; max-width: 100vw; overflow-x: hidden; }
  .ambient-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
  .ambient-bg::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at 80% 20%, rgba(245,158,11,0.04) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 20% 60%, rgba(249,115,22,0.03) 0%, transparent 60%); animation: ambientShift 25s ease-in-out infinite; }
  @keyframes ambientShift { 0%,100%{transform:scale(1) translate(0,0);opacity:1} 50%{transform:scale(1.05) translate(-1%,1%);opacity:.8} }
  .blob { position: fixed; border-radius: 50%; pointer-events: none; filter: blur(100px); opacity: 0.08; z-index: 0; }
  .blob-a { width: 400px; height: 400px; background: #f59e0b; top: -10%; right: -10%; animation: blobA 18s ease-in-out infinite; }
  .blob-b { width: 300px; height: 300px; background: #8b5cf6; bottom: -8%; left: -8%; animation: blobB 22s ease-in-out infinite; }
  @keyframes blobA { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,30px) scale(1.2)} }
  @keyframes blobB { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-20px) scale(1.15)} }

  .nav-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 50; padding: 0 16px; transition: all 0.5s ease; }
  .nav-bar.scrolled { background: rgba(7,12,20,0.75); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px); border-bottom: 1px solid rgba(255,255,255,0.04); }
  @media (min-width: 768px) { .nav-bar { padding: 0 32px; } }

  .hero-title { font-size: clamp(40px, 9vw, 110px); font-weight: 800; line-height: 0.94; letter-spacing: -0.04em; color: var(--text); }
  .text-gradient { background: linear-gradient(135deg, #f59e0b, #f97316, #f59e0b); background-size: 300% 300%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: gradientFlow 6s ease infinite; }
  @keyframes gradientFlow { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  .display-text { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(24px, 4.5vw, 44px); font-weight: 500; font-style: italic; line-height: 1.45; }
  .section-tag { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; border-radius: 999px; background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2); font-size: 10px; letter-spacing: 0.12em; font-weight: 600; color: #fbbf24; white-space: nowrap; }
  @media (min-width: 480px) { .section-tag { font-size: 11px; padding: 6px 18px; } }

  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 13px 24px; border-radius: 12px; font-size: 14px; font-weight: 500; text-decoration: none; letter-spacing: 0.02em; cursor: pointer; border: none; transition: all 0.4s cubic-bezier(0.22,0.61,0.36,1); white-space: nowrap; }
  @media (min-width: 480px) { .btn { padding: 15px 34px; font-size: 15px; border-radius: 14px; } }
  .btn-primary { background: linear-gradient(135deg, #f59e0b, #f97316); color: #0a0a0a; box-shadow: 0 20px 50px -20px rgba(245,158,11,0.5); }
  .btn-primary:hover { transform: scale(1.03); }
  .btn-outline { border: 1px solid rgba(255,255,255,0.1); color: var(--text); background: transparent; }
  .btn-outline:hover { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.2); }
  .btn-ghost { color: var(--text-secondary); background: transparent; padding: 8px 14px; font-size: 13px; }
  .btn-ghost:hover { color: var(--text); }
  @media (min-width: 480px) { .btn-ghost { padding: 10px 18px; font-size: 14px; } }

  .img-frame { border-radius: 20px; overflow: hidden; box-shadow: 0 30px 60px -30px rgba(0,0,0,0.5); transition: all 0.5s ease; }
  @media (min-width: 768px) { .img-frame { border-radius: 28px; } }

  @keyframes fadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes scaleIn { from{opacity:0;transform:scale(.9)} to{opacity:1;transform:scale(1)} }
  .afu{opacity:0;animation:fadeUp 0.8s cubic-bezier(0.22,0.61,0.36,1) forwards}
  .afi{opacity:0;animation:fadeIn 1.2s ease forwards}
  .asi{opacity:0;animation:scaleIn 0.7s cubic-bezier(0.22,0.61,0.36,1) forwards}
  .d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.3s}.d4{animation-delay:.4s}.d5{animation-delay:.5s}.d6{animation-delay:.6s}.d7{animation-delay:.7s}

  /* Scroll reveal */
  .sr { opacity: 0; transform: translateY(30px); transition: all 0.7s cubic-bezier(0.22, 0.61, 0.36, 1); }
  .sr.visible { opacity: 1; transform: translateY(0); }
  .sr-delay-1 { transition-delay: 0.1s; }
  .sr-delay-2 { transition-delay: 0.2s; }
  .sr-delay-3 { transition-delay: 0.3s; }

  /* Page load */
  .page-load { animation: pageIn 0.6s ease-out; }
  @keyframes pageIn { from { opacity: 0; } to { opacity: 1; } }

  /* Hero word stagger */
  .hero-word { display: inline-block; opacity: 0; animation: wordIn 0.6s ease forwards; }
  .hero-word:nth-child(1) { animation-delay: 0.1s; }
  .hero-word:nth-child(2) { animation-delay: 0.2s; }
  .hero-word:nth-child(3) { animation-delay: 0.3s; }
  .hero-word:nth-child(4) { animation-delay: 0.4s; }
  @keyframes wordIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  .wave-wrap { position: relative; margin-top: -2px; }
  .wave-wrap svg { display: block; width: 100%; }

  .desktop-only { display: none; }
  @media (min-width: 1024px) { .desktop-only { display: block; } }

  .hero-section { min-height: 100vh; display: flex; align-items: center; padding: 90px 16px 80px; position: relative; overflow: hidden; }
  @media (min-width: 480px) { .hero-section { padding: 90px 24px 80px; } }
  @media (min-width: 768px) { .hero-section { padding: 90px 32px 80px; } }

  .hero-content { position: relative; z-index: 15; width: 100%; max-width: 700px; margin: 0 auto; }
  @media (min-width: 1024px) { .hero-content { margin: 0; } }

  .stats-row { display: flex; gap: 24px; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 24px; flex-wrap: wrap; }
  @media (min-width: 480px) { .stats-row { gap: 40px; margin-top: 56px; padding-top: 28px; } }

  .features-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
  @media (min-width: 768px) { .features-grid { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 28px; } }

  .testimonial-grid { display: grid; grid-template-columns: 1fr; gap: 40px; align-items: center; }
  @media (min-width: 768px) { .testimonial-grid { grid-template-columns: 1fr 1fr; gap: 72px; } }
  .testimonial-img { height: 280px; }
  @media (min-width: 768px) { .testimonial-img { height: 420px; } }

  .footer-inner { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  @media (min-width: 768px) { .footer-inner { flex-direction: row; justify-content: space-between; } }

  .section-pad { padding: 40px 16px 80px; }
  @media (min-width: 768px) { .section-pad { padding: 60px 32px 120px; } }
`;

function Navbar({ scrolled, loggedIn }: { scrolled: boolean; loggedIn: boolean }) {
  return (
    <nav className={`nav-bar ${scrolled ? 'scrolled' : ''}`}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <div style={{ width: "26px", height: "26px", borderRadius: "7px", background: "linear-gradient(135deg, #f59e0b, #f97316)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={13} style={{ color: "#0a0a0a" }} />
          </div>
          <span style={{ fontWeight: 700, color: "#edeff2", fontSize: "16px", letterSpacing: "0.02em" }}>ASCEND</span>
        </Link>
        <Link href={loggedIn ? "/dashboard" : "/login"} className="btn btn-ghost">
          {loggedIn ? "Dashboard" : "Sign In"}
        </Link>
      </div>
    </nav>
  );
}

function WaveDivider({ fill }: { fill: string }) {
  return (
    <div className="wave-wrap">
      <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M0 50 C360 0, 720 100, 1080 50 C1260 20, 1380 50, 1440 50 L1440 100 L0 100 Z" fill={fill} />
      </svg>
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", s, { passive: true });
    return () => window.removeEventListener("scroll", s);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => setLoggedIn(d?.authenticated || false))
      .catch(() => setLoggedIn(false));
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".sr").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const ctaLink = loggedIn ? "/dashboard" : "/register";
  const signInLink = loggedIn ? "/dashboard" : "/login";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="ambient-bg" />
      <div className="blob blob-a" />
      <div className="blob blob-b" />

      <div className="page-wrap page-load">
        <Navbar scrolled={scrolled} loggedIn={loggedIn} />

        {/* HERO */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="afi" style={{ marginBottom: "20px" }}>
              <span className="section-tag">
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
                THE APP FOR AMBITIOUS PEOPLE
              </span>
            </div>
            <h1 className="hero-title afu">
              <span className="hero-word">FIND YOUR</span><br />
              <span className="hero-word text-gradient">PEOPLE.</span><br />
              <span className="hero-word">BUILD YOUR</span><br />
              <span className="hero-word text-gradient">FUTURE.</span>
            </h1>
            <p className="afu d3" style={{ fontSize: "15px", fontWeight: 300, color: "#9aa4b8", maxWidth: "440px", margin: "20px 0 28px", lineHeight: 1.7 }}>
              ASCEND connects ambitious individuals with like-minded communities. AI-powered roadmaps, realtime collaboration, and the accountability to rise together.
            </p>
            <div className="afu d5" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link href={ctaLink} className="btn btn-primary"><ArrowRight size={14} /> {loggedIn ? "Dashboard" : "Start Your Journey"}</Link>
              <Link href="/squads" className="btn btn-outline"><Users size={14} /> Explore Squads</Link>
            </div>
            <div className="afu d7 stats-row">
              {[{ v: "4,800+", l: "Dreamers" },{ v: "200+", l: "Squads" },{ v: "32K+", l: "Tasks" }].map(s => (
                <div key={s.l}><p style={{ fontSize: "22px", fontWeight: 700, color: "#edeff2" }}>{s.v}</p><p style={{ fontSize: "9px", color: "#5a6478", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.l}</p></div>
              ))}
            </div>
          </div>

          {!isMobile && (
            <div className="desktop-only" style={{ position: "absolute", right: "-20px", top: "45%", transform: "translateY(-50%)", width: "450px", height: "450px", zIndex: 5, pointerEvents: "none" }}>
              <div style={{ position: "absolute", top: "0%", left: "10%", width: "280px", height: "280px", borderRadius: "24px", overflow: "hidden", border: "1px solid rgba(245,158,11,0.12)", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.4)" }}>
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80" alt="Team" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.65) saturate(0.45)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px", background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}><p style={{ fontSize: "10px", color: "#f59e0b", fontWeight: 600, letterSpacing: "0.04em" }}>FIND YOUR SQUAD</p></div>
              </div>
              <div style={{ position: "absolute", top: "-8%", right: "10%", width: "85px", height: "60px", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(245,158,11,0.08)" }}>
                <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&q=80" alt="AI" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.5) saturate(0.4)" }} />
              </div>
              <div style={{ position: "absolute", top: "60%", right: "5%", width: "75px", height: "55px", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(249,115,22,0.08)" }}>
                <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&q=80" alt="Progress" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.5) saturate(0.4)" }} />
              </div>
            </div>
          )}
        </section>

        <WaveDivider fill="#0f1923" />

        {/* FEATURES */}
        <section className="section-pad" style={{ background: "#0f1923" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span className="section-tag afi">Why ASCEND</span>
              <h2 className="display-text afu" style={{ color: "#edeff2", marginTop: "12px", fontStyle: "normal", fontWeight: 700, fontSize: "clamp(28px, 5vw, 48px)" }}>Everything you need to <span className="text-gradient">rise</span></h2>
            </div>
            <div className="features-grid">
              {[
                { icon: Users, color: "#f59e0b", title: "Find Your Squad", desc: "Connect with people who share your exact goals. No more lonely grinding.", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" },
                { icon: Sparkles, color: "#f97316", title: "AI Roadmap", desc: "Advanced AI creates your personalized step-by-step journey.", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80" },
                { icon: TrendingUp, color: "#8b5cf6", title: "Grow Together", desc: "Shared tasks, real-time accountability, and celebration moments.", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80" },
              ].map((f, i) => (
                <div key={f.title} className={`sr sr-delay-${i + 1}`} style={{ background: "rgba(18,25,40,0.5)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", overflow: "hidden" }}>
                  <div className="img-frame" style={{ borderRadius: "20px 20px 0 0", height: "180px" }}><img src={f.img} alt={f.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.4) saturate(0.3)" }} /></div>
                  <div style={{ padding: "20px" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: `${f.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}><f.icon size={20} style={{ color: f.color }} /></div>
                    <h3 style={{ fontSize: "17px", fontWeight: 600, color: "#edeff2", marginBottom: "6px" }}>{f.title}</h3>
                    <p style={{ fontSize: "13px", color: "#9aa4b8", lineHeight: 1.6, fontWeight: 300 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <WaveDivider fill="#141e2b" />

        {/* TESTIMONIAL */}
        <section className="section-pad" style={{ background: "#141e2b" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }} className="testimonial-grid">
            <div className="sr">
              <span className="section-tag">Testimonial</span>
              <p className="display-text" style={{ color: "#edeff2", marginTop: "14px" }}>&ldquo;ASCEND helped me find my people. Now I&apos;m not chasing dreams alone.&rdquo;</p>
              <div style={{ marginTop: "16px" }}><p style={{ fontWeight: 600, color: "#edeff2", fontSize: "15px" }}>Rama, 19</p><p style={{ fontSize: "12px", color: "#5a6478" }}>Pejuang UGM 2026</p></div>
              <div style={{ display: "flex", marginTop: "20px" }}>
                {["#f59e0b","#f97316","#ef4444","#8b5cf6","#06b6d4","#10b981","#3b82f6","#ec4899"].map((c,i) => (
                  <div key={i} style={{ width: "30px", height: "30px", borderRadius: "50%", background: c, marginLeft: i === 0 ? "0" : "-10px", border: "2px solid #141e2b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: "#fff" }}>{String.fromCharCode(65 + i)}</div>
                ))}
              </div>
              <p style={{ fontSize: "12px", color: "#5a6478", marginTop: "10px" }}>Joined by 4,800+ dreamers</p>
            </div>
            <div className="img-frame testimonial-img sr sr-delay-1"><img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" alt="Community" /></div>
          </div>
        </section>

        <WaveDivider fill="#070c14" />

        {/* CTA */}
        <section className="section-pad" style={{ background: "#070c14", textAlign: "center" }}>
          <div className="sr" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div className="asi" style={{ marginBottom: "24px" }}><div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg, #f59e0b, #f97316)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", boxShadow: "0 20px 40px -16px rgba(245,158,11,0.4)" }}><Star size={24} style={{ color: "#0a0a0a" }} /></div></div>
            <h2 className="hero-title" style={{ fontSize: "clamp(36px, 8vw, 72px)" }}>READY TO<br /><span className="text-gradient">ASCEND?</span></h2>
            <p style={{ fontSize: "14px", color: "#9aa4b8", maxWidth: "360px", margin: "18px auto 28px", lineHeight: 1.6, fontWeight: 300 }}>Join thousands of ambitious individuals already building their future on ASCEND.</p>
            <Link href={ctaLink} className="btn btn-primary" style={{ padding: "15px 36px", fontSize: "15px" }}><ArrowRight size={16} /> {loggedIn ? "Dashboard" : "Enter ASCEND"}</Link>
            <p style={{ marginTop: "20px", fontSize: "12px", color: "#5a6478" }}>Find Your People. Build Your Future.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="sr" style={{ padding: "28px 16px", background: "#04070a", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
          <div className="footer-inner" style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "18px", height: "18px", borderRadius: "4px", background: "linear-gradient(135deg, #f59e0b, #f97316)", display: "flex", alignItems: "center", justifyContent: "center" }}><Zap size={9} style={{ color: "#0a0a0a" }} /></div>
              <span style={{ fontSize: "11px", color: "#5a6478" }}>ASCEND - Find Your People. Build Your Future.</span>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <Link href={signInLink} style={{ fontSize: "11px", color: "#5a6478", textDecoration: "none" }}>{loggedIn ? "Dashboard" : "Sign In"}</Link>
              <Link href={ctaLink} style={{ fontSize: "11px", color: "#9aa4b8", textDecoration: "none" }}>{loggedIn ? "Dashboard" : "Get Started"}</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}