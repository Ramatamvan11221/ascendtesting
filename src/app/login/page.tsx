"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Mail, Lock, Zap, Eye, EyeOff, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,500;1,600&display=swap');

  :root {
    --bg-deep: #070c14;
    --bg-card: rgba(18,25,40,0.55);
    --text: #edeff2;
    --text-secondary: #9aa4b8;
    --text-muted: #5a6478;
    --accent: #f59e0b;
    --accent-2: #f97316;
    --border: rgba(255,255,255,0.06);
    --glow: rgba(245,158,11,0.12);
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
  .login-container { display: flex; min-height: 100vh; position: relative; z-index: 1; }

  /* Left Panel — Form */
  .form-panel {
    flex: 1; display: flex; align-items: center; justify-content: center;
    padding: 40px; position: relative; z-index: 5;
    background: rgba(7,12,20,0.4); backdrop-filter: blur(10px);
  }
  .form-inner { width: 100%; max-width: 420px; }

  /* Right Panel — Image */
  .image-panel {
    flex: 1; position: relative; overflow: hidden;
    background: #0a1018;
    display: flex; align-items: center; justify-content: center;
  }
  .image-panel img {
    width: 100%; height: 100%; object-fit: cover;
    filter: brightness(0.5) saturate(0.4);
    transition: transform 8s ease;
  }
  .image-panel:hover img { transform: scale(1.08); }
  .image-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to right, rgba(7,12,20,0.7), transparent 40%);
  }
  .image-quote {
    position: absolute; bottom: 60px; left: 60px; right: 60px; z-index: 5;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(20px, 3vw, 28px); font-style: italic;
    color: rgba(255,255,255,0.7); line-height: 1.5;
    text-shadow: 0 2px 20px rgba(0,0,0,0.5);
  }

  /* Form elements */
  .input-group { position: relative; margin-bottom: 20px; }
  .input-group .icon {
    position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
    color: #5a6478; transition: color 0.3s; z-index: 2;
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
  .input-group input:focus ~ .icon,
  .input-group input:focus + .icon { color: #f59e0b; }
  .input-group input::placeholder { color: #3a4458; }

  .toggle-password {
    position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
    background: none; border: none; color: #5a6478; cursor: pointer;
    padding: 4px; transition: color 0.3s; z-index: 2;
  }
  .toggle-password:hover { color: #9aa4b8; }

  /* Buttons */
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
  .d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.3s}.d4{animation-delay:.4s}.d5{animation-delay:.5s}

  /* Divider */
  .divider-text { display: flex; align-items: center; gap: 14px; margin: 24px 0; }
  .divider-text::before, .divider-text::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.05); }
  .divider-text span { font-size: 11px; color: #3a4458; letter-spacing: 0.1em; text-transform: uppercase; }

  /* Mobile */
  @media (max-width: 768px) {
    .image-panel { display: none; }
    .form-panel { padding: 32px 24px; }
  }
`;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid credentials");

      toast.success("Welcome back to ASCEND");
      router.push("/dashboard");
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

      <div className="login-container">
        {/* ============ LEFT — FORM ============ */}
        <div className="form-panel">
          <div className="form-inner">
            {/* Logo */}
            <Link href="/" className="afi" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "40px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "linear-gradient(135deg, #f59e0b, #f97316)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={16} style={{ color: "#0a0a0a" }} />
              </div>
              <span style={{ fontWeight: 700, color: "#edeff2", fontSize: "18px", letterSpacing: "0.02em" }}>ASCEND</span>
            </Link>

            {/* Heading */}
            <h1 className="afu" style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 700, color: "#edeff2", letterSpacing: "-0.02em", marginBottom: "8px" }}>
              Welcome back
            </h1>
            <p className="afu d1" style={{ fontSize: "15px", color: "#5a6478", marginBottom: "36px", fontWeight: 300 }}>
              Sign in to continue your journey
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="afu d2 input-group">
                <Mail size={18} className="icon" />
                <input
                  type="email" placeholder="Email address" value={email}
                  onChange={(e) => setEmail(e.target.value)} required
                />
              </div>

              <div className="afu d3 input-group">
                <Lock size={18} className="icon" />
                <input
                  type={showPassword ? "text" : "password"} placeholder="Password"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="afu d4" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "24px" }}>
                <Link href="/forgot-password" style={{ fontSize: "13px", color: "#5a6478", textDecoration: "none", transition: "color 0.3s" }}>
                  Forgot password?
                </Link>
              </div>

              <button type="submit" disabled={loading} className="btn-submit afu d5">
                {loading ? (
                  <div style={{ width: "20px", height: "20px", border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#0a0a0a", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                ) : (
                  <>Sign In <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <div className="afu d5 divider-text"><span>or</span></div>

            <p className="afu d5" style={{ textAlign: "center", fontSize: "14px", color: "#5a6478" }}>
              Don&apos;t have an account?{" "}
              <Link href="/register" style={{ color: "#f59e0b", textDecoration: "none", fontWeight: 500, transition: "color 0.3s" }}>
                Create one <ChevronRight size={12} style={{ display: "inline", verticalAlign: "middle" }} />
              </Link>
            </p>
          </div>
        </div>

        {/* ============ RIGHT — IMAGE ============ */}
        <div className="image-panel">
          <div className="image-overlay" />
          <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80" alt="ASCEND" />
          <p className="image-quote afi d3">
            &ldquo;The future belongs to those who believe in the beauty of their dreams.&rdquo;
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}