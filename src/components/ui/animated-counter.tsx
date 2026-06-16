"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export function AnimatedCounter({ value, duration = 1 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const diff = value - startValue;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / (duration * 1000);
      if (elapsed >= 1) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        // Ease out cubic
        const progress = 1 - Math.pow(1 - elapsed, 3);
        setDisplayValue(Math.round(startValue + diff * progress));
      }
    }, 16);

    return () => clearInterval(interval);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
}