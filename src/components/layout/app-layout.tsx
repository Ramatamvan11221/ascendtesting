"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "../theme-toggle";
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Map, 
  Sparkles, 
  Compass, 
  Plus,
  LogOut,
  ChevronLeft,
  Menu,
  Zap,
  MessageCircle
} from "lucide-react";

const STYLES = `
  :root {
    --bg-sidebar: rgba(10, 15, 24, 0.9);
    --text-sidebar: #edeff2;
    --text-sidebar-secondary: #9aa4b8;
    --text-sidebar-muted: #5a6478;
  }

  [data-theme="light"] {
    --bg-sidebar: rgba(255, 255, 255, 0.92);
    --text-sidebar: #0f172a;
    --text-sidebar-secondary: #475569;
    --text-sidebar-muted: #94a3b8;
  }

  .layout-root { 
    display: flex; 
    height: 100vh; 
    overflow: hidden; 
    background: var(--bg-primary); 
  }

  /* Overlay */
  .mobile-overlay { 
    position: fixed; 
    inset: 0; 
    z-index: 40; 
    background: var(--bg-overlay); 
  }

  /* Sidebar */
  .sidebar {
    height: 100vh; 
    position: absolute; 
    top: 0; 
    left: 0; 
    bottom: 0; 
    z-index: 50;
    display: flex; 
    flex-direction: column;
    background: var(--bg-sidebar);
    backdrop-filter: blur(30px); 
    -webkit-backdrop-filter: blur(30px);
    border-right: 1px solid var(--border-subtle);
    transition: all 0.35s cubic-bezier(0.22,0.61,0.36,1);
    width: 220px;
  }
  .sidebar.collapsed { width: 72px; }
  .sidebar.mobile-hidden { transform: translateX(-100%); }
  .sidebar.mobile-shown { transform: translateX(0); }

  @media (min-width: 1024px) {
    .sidebar { position: fixed; }
    .sidebar.mobile-hidden { transform: translateX(0); }
  }

  /* Logo area */
  .sidebar-logo {
    display: flex; 
    align-items: center; 
    justify-content: space-between;
    padding: 18px 18px; 
    border-bottom: 1px solid var(--border-subtle);
    min-height: 64px;
  }
  .logo-link { 
    display: flex; 
    align-items: center; 
    gap: 10px; 
    text-decoration: none; 
    overflow: hidden; 
  }
  .logo-icon {
    width: 30px; 
    height: 30px; 
    border-radius: 9px;
    background: linear-gradient(135deg, var(--amber), var(--orange));
    display: flex; 
    align-items: center; 
    justify-content: center; 
    flex-shrink: 0;
    box-shadow: 0 8px 20px -8px rgba(245,158,11,0.3);
  }
  .logo-text { 
    font-weight: 700; 
    color: var(--text-sidebar); 
    font-size: 17px; 
    letter-spacing: 0.03em; 
    white-space: nowrap; 
  }

  .collapse-btn {
    background: none; 
    border: none; 
    color: var(--text-sidebar-muted); 
    cursor: pointer;
    padding: 6px; 
    border-radius: 8px; 
    transition: all 0.3s ease;
    display: flex; 
    align-items: center; 
    justify-content: center;
  }
  .collapse-btn:hover { 
    color: var(--amber); 
    background: rgba(245,158,11,0.06); 
  }
  .collapse-icon { transition: transform 0.35s ease; }
  .collapse-icon.flipped { transform: rotate(180deg); }

  /* Navigation */
  .sidebar-nav { 
    flex: 1; 
    padding: 14px 10px; 
    overflow-y: auto; 
    display: flex; 
    flex-direction: column; 
    gap: 3px; 
  }
  .nav-item {
    display: flex; 
    align-items: center; 
    gap: 12px; 
    padding: 10px 14px;
    border-radius: 12px; 
    text-decoration: none; 
    font-size: 13px; 
    font-weight: 500;
    color: var(--text-sidebar-secondary); 
    transition: all 0.3s ease; 
    position: relative; 
    white-space: nowrap;
  }
  .nav-item:hover { 
    color: var(--text-sidebar); 
    background: var(--border-subtle); 
  }
  .nav-item.active {
    color: var(--amber); 
    background: rgba(245,158,11,0.06);
    border: 1px solid rgba(245,158,11,0.12);
    box-shadow: 0 0 20px rgba(245,158,11,0.04);
  }
  .nav-item.active::before {
    content: ''; 
    position: absolute; 
    left: 0; 
    top: 10px; 
    bottom: 10px;
    width: 2px; 
    background: var(--amber); 
    border-radius: 0 2px 2px 0;
  }
  .nav-icon { flex-shrink: 0; }

  .sidebar.collapsed .nav-item { 
    justify-content: center; 
    padding: 10px; 
  }
  .sidebar.collapsed .nav-item::before { display: none; }

  /* Bottom actions */
  .sidebar-bottom { 
    padding: 14px 10px; 
    border-top: 1px solid var(--border-subtle); 
    display: flex; 
    flex-direction: column; 
    gap: 6px; 
  }
  .create-btn {
    display: flex; 
    align-items: center; 
    gap: 8px; 
    padding: 11px 14px;
    border-radius: 12px; 
    text-decoration: none; 
    font-size: 13px; 
    font-weight: 600;
    background: linear-gradient(135deg, var(--amber), var(--orange));
    color: var(--text-inverse); 
    transition: all 0.3s ease;
    box-shadow: 0 12px 30px -12px rgba(245,158,11,0.3);
  }
  .create-btn:hover { 
    transform: scale(1.03); 
    box-shadow: 0 16px 36px -12px rgba(245,158,11,0.45); 
  }
  .sidebar.collapsed .create-btn { 
    justify-content: center; 
    padding: 11px; 
  }

  .logout-btn {
    display: flex; 
    align-items: center; 
    gap: 8px; 
    padding: 10px 14px;
    border-radius: 12px; 
    border: none; 
    background: none; 
    cursor: pointer;
    font-size: 13px; 
    font-weight: 400; 
    color: var(--text-sidebar-muted);
    transition: all 0.3s ease; 
    width: 100%; 
    font-family: 'Inter', sans-serif;
  }
  .logout-btn:hover { 
    color: var(--red); 
    background: rgba(239,68,68,0.04); 
  }
  .sidebar.collapsed .logout-btn { 
    justify-content: center; 
    padding: 10px; 
  }

  /* Mobile header */
  .mobile-header {
    position: fixed; 
    top: 0; 
    left: 0; 
    right: 0; 
    z-index: 30; 
    height: 56px;
    background: var(--bg-secondary); 
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px); 
    border-bottom: 1px solid var(--border-subtle);
    display: flex; 
    align-items: center; 
    padding: 0 16px;
  }
  @media (min-width: 1024px) { .mobile-header { display: none; } }

  .menu-btn { 
    background: none; 
    border: none; 
    color: var(--text-secondary); 
    cursor: pointer; 
    padding: 8px; 
    border-radius: 8px; 
    transition: all 0.3s ease; 
  }
  .menu-btn:hover { 
    color: var(--amber); 
    background: rgba(245,158,11,0.06); 
  }

  /* Main content — scrollable */
  .main-content { 
    flex: 1; 
    height: 100vh; 
    overflow-y: auto; 
    overflow-x: hidden;
    margin-left: 220px;
    transition: margin-left 0.35s cubic-bezier(0.22,0.61,0.36,1);
  }
  .main-content.sidebar-collapsed { margin-left: 72px; }

  @media (max-width: 1023px) {
    .main-content { margin-left: 0 !important; padding-top: 56px; }
  }

  /* Theme Toggle Button */
  .theme-toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid var(--border-subtle);
    background: var(--bg-card);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s ease;
    width: 36px;
    height: 36px;
  }

  .theme-toggle-btn:hover {
    border-color: var(--border-medium);
    color: var(--text-primary);
    background: var(--bg-card-hover);
  }

  .sidebar.collapsed .theme-toggle-btn {
    width: 32px;
    height: 32px;
    padding: 6px;
  }
`;

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Daily Quest", href: "/tasks", icon: CheckSquare },
  { name: "Dream Map", href: "/roadmap", icon: Map },
  { name: "Future Self", href: "/future-self", icon: Sparkles },
  { name: "Discover", href: "/squads", icon: Compass },
  { name: "Profile", href: "/profile", icon: Users },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out");
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="layout-root">
        {/* Mobile overlay */}
        {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}

        {/* Sidebar — fixed, full height */}
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-shown' : 'mobile-hidden'}`}>
          {/* Logo */}
          <div className="sidebar-logo">
            <Link href="/dashboard" className="logo-link" onClick={() => setMobileOpen(false)}>
              <div className="logo-icon">
                <Zap size={15} style={{ color: "var(--text-inverse)" }} />
              </div>
              {!collapsed && <span className="logo-text">ASCEND</span>}
            </Link>
            <button 
              className="collapse-btn"
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronLeft size={16} className={`collapse-icon ${collapsed ? 'flipped' : ''}`} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={19} className="nav-icon" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="sidebar-bottom">
            {/* Theme Toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
              <ThemeToggle />
            </div>

            <Link href="/squads/create" className="create-btn" onClick={() => setMobileOpen(false)}>
              <Plus size={17} />
              {!collapsed && <span>Create Squad</span>}
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={17} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Mobile header */}
        <div className="mobile-header">
          <button className="menu-btn" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "10px" }}>
            <div className="logo-icon" style={{ width: "24px", height: "24px", borderRadius: "7px" }}>
              <Zap size={12} style={{ color: "var(--text-inverse)" }} />
            </div>
            <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "15px" }}>ASCEND</span>
          </div>
        </div>

        {/* Main content — scrollable independently */}
        <main className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
          {children}
        </main>
      </div>
    </>
  );
}