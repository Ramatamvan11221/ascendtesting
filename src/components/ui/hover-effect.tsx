"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HoverEffectProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function HoverEffect({ children, className, glow = false }: HoverEffectProps) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: glow ? "0 0 30px rgba(99, 102, 241, 0.15)" : "0 4px 20px rgba(0,0,0,0.2)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn("transition-colors duration-200", className)}
    >
      {children}
    </motion.div>
  );
}