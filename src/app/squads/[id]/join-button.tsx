"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, UserPlus, Sparkles } from "lucide-react";

const STYLES = `
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export function JoinButton({ squadId }: { squadId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/squads/${squadId}/join`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join");
      toast.success("Welcome to the squad!");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to join squad";
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <button
        onClick={handleJoin}
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px 24px",
          borderRadius: "14px",
          border: "none",
          background: "linear-gradient(135deg, var(--amber), var(--orange))",
          color: "var(--text-inverse)",
          fontSize: "15px",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          transition: "all 0.3s ease",
          boxShadow: "0 16px 40px -12px rgba(245,158,11,0.35)",
          fontFamily: "'Inter', sans-serif",
          opacity: loading ? 0.6 : 1,
        }}
        onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 24px 50px -12px rgba(245,158,11,0.5)"; }}}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 16px 40px -12px rgba(245,158,11,0.35)"; }}
      >
        {loading ? (
          <span style={{ width: "18px", height: "18px", border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "var(--text-inverse)", borderRadius: "50%", animation: "spin 0.6s linear infinite", display: "inline-block" }} />
        ) : (
          <>
            <Sparkles size={16} />
            Join Squad
          </>
        )}
      </button>
    </>
  );
}