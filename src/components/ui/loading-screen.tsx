"use client";

import { Target } from "lucide-react";

const STYLES = `
  .ls-wrap {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--bg-primary);
    min-height: 100vh;
  }
  .ls-spinner {
    width: 48px;
    height: 48px;
    border: 3px solid rgba(245, 158, 11, 0.1);
    border-top-color: var(--amber);
    border-radius: 50%;
    animation: lsSpin 0.8s linear infinite;
  }
  @keyframes lsSpin {
    to { transform: rotate(360deg); }
  }
  .ls-text {
    margin-top: 20px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-muted);
    animation: lsPulse 1.5s ease-in-out infinite;
  }
  @keyframes lsPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  .ls-icon {
    color: var(--amber);
    margin-bottom: 16px;
    animation: lsBounce 1s ease-in-out infinite;
  }
  @keyframes lsBounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

export function LoadingScreen({ text = "Loading..." }: { text?: string }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="ls-wrap">
        <div className="ls-icon">
          <Target size={48} />
        </div>
        <div className="ls-spinner" />
        <p className="ls-text">{text}</p>
      </div>
    </>
  );
}