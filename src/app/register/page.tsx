"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Mail, Lock, User, Zap, Eye, EyeOff, ChevronRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,500;1,600&display=swap');
  :root {
    --bg-deep: #070c14;
    --text: #edeff2;
    --text-secondary: #9aa4b8;
    --text-muted: #5a6478;
    --accent: #f59e0b;
    --accent-2: #f97316;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; background: var(--bg-deep); }
  ::-webkit-scrollbar { width: 0; }

  /* Ambient */
  .ambient { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
  .ambient::before { content: ''; position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 50% 40% at 20% 50%, rgba(245,158,11,0.04) 0%, transparent 60%),
      radial-gradient(ellipse 40% 50% at 80% 40%, rgba(249,115,22,0.03) 0%, transparent 60%),
      radial-gradient(ellipse 30% 30% at 50% 80%, rgba(139,92,246,0.03) 0%, transparent 50%);
    animation: ambientShift 20s ease-in-out infinite;
  }
  @keyframes ambientShift {
    0%, 100% { transform: scale(1) translate(0,0); opacity: 1; }
    50% { transform: scale(1.06) translate(-1%, 1%); opacity: 0.8; }
  }
  .blob { position: fixed; border-radius: 50%; pointer-events: none; filter: blur(100px); opacity: 0.1; z-index: 0; }
  .blob-a { width: 400px; height: 400px; background: #f59e0b; top: -8%; right: -5%; animation: blobA 16s ease-in-out infinite; }
  .blob-b { width: 300px; height: 300px; background: #8b5cf6; bottom: -5%; left: -3%; animation: blobB 20s ease-in-out infinite; }
  @keyframes blobA { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,30px) scale(1.2)} }
  @keyframes blobB { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-25px) scale(1.15)} }

  /* Layout */
  .register-container { display: flex; min-height: 100vh; position: relative; z-index: 1; }

  /* Left Panel — Image */
  .image-panel {
    flex: 1; position: relative; overflow: hidden;
    background: #0a1018;
    display: flex; align-items: center; justify-content: center;
  }
  .image-panel img {
    width: 100%; height: 100%; object-fit: cover;
    filter: brightness(0.5) saturate(0.4);
    transition: transform 8s ease;
    -webkit-mask-image: linear-gradient(to left, transparent 0%, black 18%);
    mask-image: linear-gradient(to left, transparent 0%, black 18%);
  }
  .image-panel:hover img { transform: scale(1.08); }
  .image-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to left, rgba(7,12,20,0.95), rgba(7,12,20,0.3) 30%, transparent 55%);
    z-index: 2;
  }
  .image-quote {
    position: absolute; bottom: 60px; left: 60px; right: 60px; z-index: 5;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(20px, 3vw, 28px); font-style: italic;
    color: rgba(255,255,255,0.7); line-height: 1.5;
    text-shadow: 0 2px 20px rgba(0,0,0,0.5);
  }

  /* ===== HARD BLEND SEAM (fusion antara 2 section) ===== */
  .panel-seam {
    position: absolute; top: 0; bottom: 0; left: 0; width: 100%;
    z-index: 4; pointer-events: none; overflow: hidden;
  }
  .panel-seam::before {
    content: ''; position: absolute; top: -10%; bottom: -10%; left: 50%;
    width: 340px; transform: translateX(-50%);
    background: radial-gradient(ellipse 55% 100% at 50% 50%, rgba(245,158,11,0.22) 0%, rgba(249,115,22,0.1) 35%, transparent 72%);
    filter: blur(60px);
    mix-blend-mode: screen;
    animation: seamPulse 9s ease-in-out infinite;
  }
  .panel-seam::after {
    content: ''; position: absolute; top: 0; bottom: 0; left: 50%;
    width: 120px; transform: translateX(-50%);
    background: linear-gradient(to right, transparent, rgba(255,255,255,0.035), transparent);
    mix-blend-mode: overlay;
  }
  @keyframes seamPulse {
    0%, 100% { opacity: 0.7; transform: translateX(-50%) scaleY(1); }
    50% { opacity: 1; transform: translateX(-50%) scaleY(1.08); }
  }

  /* ===== 3D FLOATING OBJECTS ===== */
  .f3d-scene { position: absolute; pointer-events: none; z-index: 1; perspective: 900px; }
  .f3d-cube {
    width: 44px; height: 44px; position: relative; transform-style: preserve-3d;
    animation: cubeFloat 14s ease-in-out infinite, cubeSpin 22s linear infinite;
  }
  .f3d-cube .face {
    position: absolute; inset: 0; border: 1px solid rgba(245,158,11,0.35);
    background: linear-gradient(135deg, rgba(245,158,11,0.10), rgba(249,115,22,0.03));
    backdrop-filter: blur(2px);
    box-shadow: inset 0 0 20px rgba(245,158,11,0.06);
  }
  .f3d-cube .f1 { transform: translateZ(22px); }
  .f3d-cube .f2 { transform: rotateY(180deg) translateZ(22px); }
  .f3d-cube .f3 { transform: rotateY(90deg) translateZ(22px); }
  .f3d-cube .f4 { transform: rotateY(-90deg) translateZ(22px); }
  .f3d-cube .f5 { transform: rotateX(90deg) translateZ(22px); }
  .f3d-cube .f6 { transform: rotateX(-90deg) translateZ(22px); }
  @keyframes cubeSpin { from { transform: rotateX(20deg) rotateY(0deg); } to { transform: rotateX(20deg) rotateY(360deg); } }
  @keyframes cubeFloat { 0%,100% { margin-top: 0px; } 50% { margin-top: -18px; } }

  .f3d-ring {
    width: 70px; height: 70px; border-radius: 50%;
    border: 1.5px solid rgba(139,92,246,0.3);
    transform-style: preserve-3d;
    box-shadow: 0 0 30px rgba(139,92,246,0.08), inset 0 0 20px rgba(139,92,246,0.05);
    animation: ringFloat 16s ease-in-out infinite, ringSpin 26s linear infinite;
  }
  @keyframes ringSpin { from { transform: rotateX(72deg) rotateZ(0deg); } to { transform: rotateX(72deg) rotateZ(360deg); } }
  @keyframes ringFloat { 0%,100% { margin-left: 0px; opacity: 0.6; } 50% { margin-left: -12px; opacity: 1; } }

  .f3d-diamond {
    width: 26px; height: 26px;
    background: linear-gradient(135deg, rgba(245,158,11,0.5), rgba(249,115,22,0.15));
    border: 1px solid rgba(245,158,11,0.4);
    transform-style: preserve-3d;
    box-shadow: 0 0 18px rgba(245,158,11,0.15);
    animation: diamondFloat 11s ease-in-out infinite, diamondSpin 18s linear infinite;
  }
  @keyframes diamondSpin { from { transform: rotate(45deg) rotateY(0deg); } to { transform: rotate(45deg) rotateY(360deg); } }
  @keyframes diamondFloat { 0%,100% { margin-top: 0px; } 50% { margin-top: 14px; } }

  /* Right Panel — Form */
  .form-panel {
    flex: 0.85; display: flex; align-items: center; justify-content: center;
    padding: 40px; position: relative; z-index: 5;
    background: rgba(7,12,20,0.4); backdrop-filter: blur(10px);
    overflow: hidden;
  }
  .form-inner { width: 80%; max-width: 420px; position: relative; z-index: 6; }

  /* Form elements */
  .input-group { position: relative; margin-bottom: 18px; }
  .input-group .icon {
    position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
    color: #5a6478; transition: color 0.3s; z-index: 2; pointer-events: none;
  }
  .input-group input {
    width: 100%; padding: 16px 16px 16px 48px;
    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px; font-size: 15px; color: #edeff2;
    font-family: 'Inter', sans-serif; outline: none;
    transition: all 0.3s ease; letter-spacing: 0.02em;
  }
  .input-group input:focus {
    border-color: rgba(245,158,11,0.4);
    background: rgba(255,255,255,0.03);
    box-shadow: 0 0 0 4px rgba(245,158,11,0.04);
  }
  .input-group input:focus + .icon,
  .input-group input:focus ~ .icon { color: #f59e0b; }
  .input-group input::placeholder { color: #3a4458; }
  .toggle-password {
    position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
    background: none; border: none; color: #5a6478; cursor: pointer;
    padding: 4px; transition: color 0.3s; z-index: 2;
  }
  .toggle-password:hover { color: #9aa4b8; }

  /* Strength bar */
  .strength-bar { height: 3px; border-radius: 2px; margin-top: 8px; background: rgba(255,255,255,0.05); overflow: hidden; }
  .strength-fill { height: 100%; border-radius: 2px; transition: all 0.4s ease; }
  .strength-text { font-size: 11px; margin-top: 4px; transition: color 0.3s; }

  /* Button */
  .btn-submit {
    width: 100%; padding: 16px; border-radius: 14px;
    background: linear-gradient(135deg, #f59e0b, #f97316);
    color: #0a0a0a; font-size: 15px; font-weight: 600;
    border: none; cursor: pointer; letter-spacing: 0.02em;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: all 0.4s cubic-bezier(0.22,0.61,0.36,1);
    box-shadow: 0 20px 50px -20px rgba(245,158,11,0.4);
  }
  .btn-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 30px 70px -20px rgba(245,158,11,0.6);
  }
  .btn-submit:active { transform: scale(0.98); }
  .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* Animations */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .afu { opacity: 0; animation: fadeUp 0.7s cubic-bezier(0.22,0.61,0.36,1) forwards; }
  .afi { opacity: 0; animation: fadeIn 1s ease forwards; }
  .d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.3s}.d4{animation-delay:.4s}.d5{animation-delay:.5s}.d6{animation-delay:.6s}.d7{animation-delay:.7s}

  .divider-text { display: flex; align-items: center; gap: 14px; margin: 22px 0; }
  .divider-text::before, .divider-text::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.05); }
  .divider-text span { font-size: 11px; color: #3a4458; letter-spacing: 0.1em; text-transform: uppercase; }

  @media (max-width: 768px) {
    .image-panel { display: none; }
    .form-panel { padding: 32px 24px; }
    .f3d-scene { display: none; }
  }
`;

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const getStrength = (pwd: string): { width: string; color: string; label: string; textColor: string } => {
    if (pwd.length === 0) return { width: "0%", color: "transparent", label: "", textColor: "#5a6478" };
    if (pwd.length < 6) return { width: "25%", color: "#ef4444", label: "Too weak", textColor: "#ef4444" };
    if (pwd.length < 8) return { width: "50%", color: "#f97316", label: "Getting better", textColor: "#f97316" };
    if (pwd.length < 10) return { width: "75%", color: "#f59e0b", label: "Almost there", textColor: "#f59e0b" };
    return { width: "100%", color: "#10b981", label: "Strong password", textColor: "#10b981" };
  };
  const strength = getStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      toast.success("Welcome to ASCEND! Let's find your people.");
      router.push("/onboarding");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="ambient" />
      <div className="blob blob-a" />
      <div className="blob blob-b" />

      <div className="register-container">
        {/* Hard blend seam between image & form */}
        <div className="panel-seam" />

        {/* ============ LEFT — IMAGE ============ */}
        <div className="image-panel">
          <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80" alt="ASCEND" />
          <div className="image-overlay" />
          <p className="image-quote afi d3">
            &ldquo;Your journey to greatness starts with a single step. Find your people. Build your future.&rdquo;
          </p>
        </div>

        {/* ============ RIGHT — FORM ============ */}
        <div className="form-panel">
          {/* 3D floating objects — dekat area textbox */}
          <div className="f3d-scene" style={{ top: "12%", left: "6%" }}>
            <div className="f3d-cube">
              <div className="face f1" /><div className="face f2" /><div className="face f3" />
              <div className="face f4" /><div className="face f5" /><div className="face f6" />
            </div>
          </div>
          <div className="f3d-scene" style={{ bottom: "14%", right: "4%" }}>
            <div className="f3d-ring" />
          </div>
          <div className="f3d-scene" style={{ top: "48%", left: "1%" }}>
            <div className="f3d-diamond" />
          </div>

          <div className="form-inner">
            {/* Logo */}
            <Link href="/" className="afi" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "36px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "linear-gradient(135deg, #f59e0b, #f97316)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={16} style={{ color: "#0a0a0a" }} />
              </div>
              <span style={{ fontWeight: 700, color: "#edeff2", fontSize: "18px", letterSpacing: "0.02em" }}>ASCEND</span>
            </Link>

            {/* Heading */}
            <h1 className="afu" style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 700, color: "#edeff2", letterSpacing: "-0.02em", marginBottom: "6px" }}>
              Join ASCEND
            </h1>
            <p className="afu d1" style={{ fontSize: "15px", color: "#5a6478", marginBottom: "32px", fontWeight: 300 }}>
              Find your people. Build your future.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="afu d2 input-group">
                <User size={18} className="icon" />
                <input
                  type="text" placeholder="Full name" value={name}
                  onChange={(e) => setName(e.target.value)} required
                />
              </div>
              <div className="afu d3 input-group">
                <Mail size={18} className="icon" />
                <input
                  type="email" placeholder="Email address" value={email}
                  onChange={(e) => setEmail(e.target.value)} required
                />
              </div>
              <div className="afu d4 input-group" style={{ marginBottom: "12px" }}>
                <Lock size={18} className="icon" />
                <input
                  type={showPassword ? "text" : "password"} placeholder="Password (min 8 chars)"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password strength */}
              {password.length > 0 && (
                <div className="afu d4" style={{ marginBottom: "20px" }}>
                  <div className="strength-bar">
                    <div className="strength-fill" style={{ width: strength.width, background: strength.color }} />
                  </div>
                  <p className="strength-text" style={{ color: strength.textColor }}>{strength.label}</p>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-submit afu d5">
                {loading ? (
                  <div style={{ width: "20px", height: "20px", border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#0a0a0a", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                ) : (
                  <>Create Account <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <div className="afu d6 divider-text"><span>or</span></div>
            <p className="afu d6" style={{ textAlign: "center", fontSize: "14px", color: "#5a6478" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#f59e0b", textDecoration: "none", fontWeight: 500, transition: "color 0.3s" }}>
                Sign in <ChevronRight size={12} style={{ display: "inline", verticalAlign: "middle" }} />
              </Link>
            </p>

            {/* Trust badge */}
            <div className="afi d7" style={{ marginTop: "28px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <Sparkles size={14} style={{ color: "#f59e0b" }} />
              <span style={{ fontSize: "12px", color: "#5a6478" }}>Join 4,800+ dreamers already on ASCEND</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}