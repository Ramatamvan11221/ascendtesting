"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    
    // Tambah class transition
    document.documentElement.classList.add('theme-transitioning');
    
    // Ganti theme
    setTheme(newTheme);
    
    // Hapus class setelah transisi selesai
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 400);
  };

  if (!mounted) {
    return (
      <button className="theme-toggle-btn" aria-label="Toggle theme">
        <Sun size={18} />
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className="theme-toggle-btn"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}