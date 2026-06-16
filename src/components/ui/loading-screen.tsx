"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const STYLES = `
  .load-overlay{position:fixed;inset:0;z-index:200;background:rgba(7,12,20,0.95);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:20px;}
  .load-logo{width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#f59e0b,#f97316);display:flex;align-items:center;justify-content:center;box-shadow:0 16px 40px -12px rgba(245,158,11,0.4);}
  .load-bar{width:120px;height:3px;border-radius:2px;background:rgba(255,255,255,0.04);overflow:hidden;}
  .load-bar-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,#f59e0b,#f97316);animation:loadSlide 1.2s ease-in-out infinite;}
  @keyframes loadSlide{0%{width:0%;margin-left:0}50%{width:60%;margin-left:20%}100%{width:0%;margin-left:100%}}
  .load-text{font-size:13px;color:#5a6478;font-weight:400;letter-spacing:0.04em;}
`;

export function LoadingScreen({ text = "Loading..." }: { text?: string }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <motion.div className="load-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
        <div className="load-logo"><Zap size={22} style={{ color: "#0a0a0a" }} /></div>
        <div className="load-bar"><div className="load-bar-fill" /></div>
        <p className="load-text">{text}</p>
      </motion.div>
    </>
  );
}