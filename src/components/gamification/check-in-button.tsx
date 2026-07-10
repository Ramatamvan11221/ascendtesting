"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Flame, Check, Sparkles } from "lucide-react";

const STYLES = `
  .ck-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
  }
  @media(min-width:480px) {
    .ck-btn {
      padding: 10px 18px;
      font-size: 13px;
      border-radius: 12px;
    }
  }
  .ck-btn.idle {
    background: linear-gradient(135deg, var(--amber), var(--orange));
    color: var(--text-inverse);
    box-shadow: 0 8px 20px -8px rgba(245, 158, 11, 0.35);
  }
  .ck-btn.idle:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 28px -10px rgba(245, 158, 11, 0.5);
  }
  .ck-btn.done {
    background: rgba(16, 185, 129, 0.08);
    color: var(--green);
    border: 1px solid rgba(16, 185, 129, 0.15);
    cursor: default;
    box-shadow: 0 0 16px rgba(16, 185, 129, 0.06);
  }
  .ck-btn.loading {
    background: rgba(245, 158, 11, 0.06);
    color: var(--amber);
    border: 1px solid rgba(245, 158, 11, 0.12);
    cursor: wait;
  }
  .ck-btn:disabled {
    cursor: not-allowed;
  }
  .ck-icon {
    width: 26px;
    height: 26px;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.3s;
  }
  @media(min-width:480px) {
    .ck-icon {
      width: 30px;
      height: 30px;
      border-radius: 8px;
    }
  }
  .idle .ck-icon {
    background: rgba(0, 0, 0, 0.12);
  }
  .done .ck-icon {
    background: rgba(16, 185, 129, 0.1);
  }
  .loading .ck-icon {
    background: rgba(245, 158, 11, 0.08);
  }
  .ck-label {
    font-size: 12px;
    font-weight: 600;
    color: inherit;
  }
  @media(min-width:480px) {
    .ck-label {
      font-size: 13px;
    }
  }
  .ck-spin {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(245, 158, 11, 0.2);
    border-top-color: var(--amber);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  .ck-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--green);
    display: inline-block;
    animation: ckPulse 2s ease-in-out infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes ckPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
`;

interface CheckInButtonProps {
  hasCheckedIn: boolean;
  streak: number;
}

export function CheckInButton({ hasCheckedIn, streak }: CheckInButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(hasCheckedIn);

  const handleCheckIn = async () => {
    if (checkedIn) return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/check-in", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "Already checked in today") {
          setCheckedIn(true);
          toast.info("Already checked in!");
          return;
        }
        throw new Error(data.error);
      }
      setCheckedIn(true);
      toast.success(`+${data.xpGained} XP — Day ${data.streak}!`, {
        icon: <Sparkles size={16} style={{ color: "var(--amber)" }} />,
      });
      router.refresh();
    } catch {
      toast.error("Failed to check in");
    }
    setLoading(false);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <button
        onClick={handleCheckIn}
        disabled={checkedIn || loading}
        className={`ck-btn ${checkedIn ? "done" : loading ? "loading" : "idle"}`}
      >
        <div className="ck-icon">
          {loading ? (
            <span className="ck-spin" />
          ) : checkedIn ? (
            <Check size={14} style={{ color: "var(--green)" }} />
          ) : (
            <Flame size={14} style={{ color: "#fbbf24" }} />
          )}
        </div>
        <span className="ck-label">
          {loading ? "..." : checkedIn ? (
            <>
              <span className="ck-dot" /> Day {streak}
            </>
          ) : (
            "Check-in"
          )}
        </span>
      </button>
    </>
  );
}