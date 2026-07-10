"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Plus, ArrowRight, Compass, Search, Flame, Hash, Filter, X, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STYLES = `
  .disc-wrap{min-height:100vh;background:radial-gradient(ellipse at 50% 0%,rgba(245,158,11,0.04),transparent 60%),var(--bg-primary);padding:20px 14px;}
  @media(min-width:480px){.disc-wrap{padding:28px 20px;}}
  @media(min-width:768px){.disc-wrap{padding:32px;}}
  .disc-inner{max-width:1100px;margin:0 auto;}
  .disc-header{margin-bottom:24px;}
  @media(min-width:480px){.disc-header{margin-bottom:32px;}}
  .disc-title-row{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;}
  .disc-title{font-size:24px;font-weight:700;color:var(--text-primary);letter-spacing:-0.02em;display:flex;align-items:center;gap:10px;}
  @media(min-width:480px){.disc-title{font-size:32px;}}
  .disc-subtitle{font-size:13px;color:var(--text-muted);margin-top:2px;max-width:500px;}
  .create-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 18px;border-radius:11px;background:linear-gradient(135deg,var(--amber),var(--orange));color:var(--text-inverse);font-size:13px;font-weight:600;text-decoration:none;transition:all 0.3s ease;box-shadow:0 10px 24px -8px rgba(245,158,11,0.3);white-space:nowrap;}
  @media(min-width:480px){.create-btn{padding:12px 24px;border-radius:13px;font-size:14px;}}
  .create-btn:hover{transform:scale(1.03);box-shadow:0 16px 32px -10px rgba(245,158,11,0.4);}
  .stats-strip{display:flex;gap:20px;margin-bottom:20px;padding:14px 0;border-bottom:1px solid var(--border-subtle);flex-wrap:wrap;}
  @media(min-width:480px){.stats-strip{gap:32px;margin-bottom:24px;padding:16px 0;}}
  .stat-item{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted);}
  @media(min-width:480px){.stat-item{font-size:13px;}}
  .filter-row{display:flex;gap:8px;margin-bottom:20px;align-items:center;}
  @media(min-width:480px){.filter-row{margin-bottom:24px;}}
  .search-input-wrap{position:relative;flex:1;min-width:0;}
  .search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text-muted);z-index:2;}
  .search-input{width:100%;padding:11px 14px 11px 40px;border-radius:11px;border:1px solid var(--border-medium);background:var(--bg-input);color:var(--text-primary);font-size:13px;outline:none;font-family:'Inter',sans-serif;transition:all 0.3s;}
  @media(min-width:480px){.search-input{padding:13px 16px 13px 46px;border-radius:13px;font-size:14px;}}
  .search-input:focus{border-color:rgba(245,158,11,0.3);box-shadow:0 0 0 4px rgba(245,158,11,0.04);}
  .search-input::placeholder{color:var(--text-muted);opacity:0.5;}
  .filter-btn{display:flex;align-items:center;gap:6px;padding:11px 16px;border-radius:11px;border:1px solid var(--border-medium);background:var(--bg-input);color:var(--text-secondary);cursor:pointer;font-size:12px;font-weight:500;transition:all 0.25s;font-family:'Inter',sans-serif;white-space:nowrap;}
  @media(min-width:480px){.filter-btn{padding:13px 18px;border-radius:13px;font-size:13px;}}
  .filter-btn:hover{border-color:rgba(245,158,11,0.25);color:var(--text-primary);}
  .filter-btn.has-filter{border-color:rgba(245,158,11,0.35);background:rgba(245,158,11,0.06);color:var(--amber);}
  .filter-count{background:var(--amber);color:var(--text-inverse);font-size:9px;padding:2px 6px;border-radius:999px;font-weight:700;}

  .popup-overlay{position:fixed;inset:0;z-index:100;background:var(--bg-overlay);display:flex;align-items:center;justify-content:center;padding:16px;}
  .popup-card{width:100%;max-width:400px;max-height:80vh;background:var(--bg-card);border:1px solid var(--border-medium);border-radius:18px;padding:24px 20px;backdrop-filter:blur(20px);box-shadow:0 30px 60px rgba(0,0,0,0.5);overflow-y:auto;}
  @media(min-width:480px){.popup-card{padding:28px;border-radius:20px;}}
  .popup-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
  .popup-title{font-size:16px;font-weight:700;color:var(--text-primary);display:flex;align-items:center;gap:8px;}
  @media(min-width:480px){.popup-title{font-size:18px;}}
  .popup-close{background:none;border:none;color:var(--text-muted);cursor:pointer;padding:4px;border-radius:6px;transition:all 0.2s;}
  .popup-close:hover{color:var(--red);background:rgba(239,68,68,0.06);}
  .popup-section{margin-bottom:16px;}
  .popup-label{font-size:10px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;}
  @media(min-width:480px){.popup-label{font-size:11px;}}
  .cat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:5px;}
  @media(min-width:480px){.cat-grid{gap:6px;}}
  .cat-option{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:8px;border:1px solid var(--border-subtle);background:var(--bg-input);color:var(--text-secondary);cursor:pointer;font-size:12px;font-weight:500;transition:all 0.2s;font-family:'Inter',sans-serif;}
  @media(min-width:480px){.cat-option{padding:11px 14px;border-radius:10px;font-size:13px;}}
  .cat-option:hover{border-color:rgba(245,158,11,0.2);color:var(--text-primary);}
  .cat-option.active{border-color:rgba(245,158,11,0.4);background:rgba(245,158,11,0.06);color:var(--amber);}
  .cat-check{width:16px;height:16px;border-radius:4px;border:2px solid var(--border-medium);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s;}
  .cat-option.active .cat-check{background:var(--amber);border-color:var(--amber);}
  .popup-actions{display:flex;gap:6px;margin-top:6px;}
  .popup-apply{flex:1;padding:10px;border-radius:9px;border:none;background:linear-gradient(135deg,var(--amber),var(--orange));color:var(--text-inverse);font-size:13px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.3s;}
  @media(min-width:480px){.popup-apply{padding:12px;border-radius:11px;font-size:14px;}}
  .popup-clear{padding:10px 16px;border-radius:9px;border:1px solid rgba(239,68,68,0.15);background:rgba(239,68,68,0.03);color:var(--red);font-size:13px;font-weight:500;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.3s;}
  @media(min-width:480px){.popup-clear{padding:12px 20px;border-radius:11px;font-size:14px;}}
  .popup-clear:hover{background:rgba(239,68,68,0.08);}

  .squad-grid{display:grid;grid-template-columns:1fr;gap:12px;}
  @media(min-width:600px){.squad-grid{grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;}}
  .squad-card{display:block;text-decoration:none;padding:20px;border-radius:16px;background:var(--bg-card);border:1px solid var(--border-subtle);backdrop-filter:blur(12px);transition:all 0.35s cubic-bezier(0.22,0.61,0.36,1);cursor:pointer;}
  @media(min-width:480px){.squad-card{padding:24px;border-radius:20px;}}
  .squad-card:hover{border-color:rgba(245,158,11,0.25);background:var(--bg-card-hover);transform:translateY(-3px);box-shadow:0 16px 40px -16px rgba(0,0,0,0.3);}
  .squad-card-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px;}
  .squad-icon-wrap{display:flex;align-items:center;gap:12px;}
  .squad-icon{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.1);flex-shrink:0;transition:all 0.3s;}
  @media(min-width:480px){.squad-icon{width:48px;height:48px;border-radius:14px;font-size:22px;}}
  .squad-card:hover .squad-icon{background:rgba(245,158,11,0.14);border-color:rgba(245,158,11,0.2);transform:scale(1.05);}
  .squad-name{font-size:15px;font-weight:600;color:var(--text-primary);margin-bottom:1px;}
  @media(min-width:480px){.squad-name{font-size:16px;}}
  .squad-owner{font-size:11px;color:var(--text-muted);}
  .squad-category{padding:3px 10px;border-radius:999px;font-size:9px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;background:rgba(245,158,11,0.06);color:var(--amber);border:1px solid rgba(245,158,11,0.12);white-space:nowrap;}
  @media(min-width:480px){.squad-category{font-size:10px;padding:4px 12px;}}
  .squad-desc{font-size:12px;color:var(--text-secondary);line-height:1.6;margin-bottom:14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
  @media(min-width:480px){.squad-desc{font-size:13px;}}
  .squad-meta{display:flex;align-items:center;gap:12px;}
  .squad-meta-item{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text-muted);}
  @media(min-width:480px){.squad-meta-item{font-size:12px;}}
  .squad-arrow{margin-left:auto;color:var(--text-muted);transition:all 0.3s;}
  .squad-card:hover .squad-arrow{color:var(--amber);transform:translateX(3px);}
  .empty-state{text-align:center;padding:60px 16px;}
  @media(min-width:480px){.empty-state{padding:80px 20px;}}
  .empty-icon{opacity:0.12;margin-bottom:16px;}
  .empty-title{font-size:18px;font-weight:600;color:var(--text-primary);margin-bottom:6px;}
  @media(min-width:480px){.empty-title{font-size:20px;}}
  .empty-sub{font-size:13px;color:var(--text-muted);margin-bottom:20px;}
  @media(min-width:480px){.empty-sub{font-size:14px;margin-bottom:24px;}}
  .result-count{font-size:11px;color:var(--text-muted);margin-bottom:12px;}
  @media(min-width:480px){.result-count{font-size:12px;margin-bottom:16px;}}

  .sr{opacity:0;transform:translateY(20px);transition:all 0.6s cubic-bezier(0.22,0.61,0.36,1);}
  .sr.visible{opacity:1;transform:translateY(0);}
  .sr-d1{transition-delay:0.05s;}.sr-d2{transition-delay:0.1s;}.sr-d3{transition-delay:0.15s;}
`;

interface SquadData {
  id: string; name: string; icon: string; category: string;
  description: string; goal: string; memberCount: number;
  roomCount: number; ownerName: string; createdAt: string;
}

const CATEGORIES = ["Akademik", "Teknologi", "Bahasa", "Karir", "Kesehatan", "Kompetisi", "Startup", "Seni", "Umum"];

export function DiscoverContent({ squads }: { squads: SquadData[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }); },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".sr").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [squads, search, selectedCategories]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };

  const filtered = squads.filter((s) => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(s.category);
    return matchSearch && matchCategory;
  });

  const totalMembers = squads.reduce((a, s) => a + s.memberCount, 0);
  const totalRooms = squads.reduce((a, s) => a + s.roomCount, 0);
  const hasFilters = search !== "" || selectedCategories.length > 0;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="disc-wrap">
        <div className="disc-inner">
          <div className="disc-header sr">
            <div className="disc-title-row">
              <div>
                <h1 className="disc-title"><Compass size={24} style={{ color: "var(--amber)" }} />Discover Squads</h1>
                <p className="disc-subtitle">Find communities that share your ambition.</p>
              </div>
              <Link href="/squads/create" className="create-btn"><Plus size={14} /> Create Squad</Link>
            </div>
          </div>

          <div className="stats-strip sr sr-d1">
            <div className="stat-item"><Flame size={13} style={{ color: "var(--orange)" }} />{squads.length} Squads</div>
            <div className="stat-item"><Users size={13} style={{ color: "var(--amber)" }} />{totalMembers} Members</div>
            <div className="stat-item"><Hash size={13} style={{ color: "#a78bfa" }} />{totalRooms} Rooms</div>
            {hasFilters && <div className="stat-item"><Filter size={13} style={{ color: "var(--amber)" }} />{filtered.length} results</div>}
          </div>

          <div className="filter-row sr sr-d2">
            <div className="search-input-wrap">
              <Search size={15} className="search-icon" />
              <input className="search-input" placeholder="Search squads..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button className={`filter-btn ${hasFilters ? "has-filter" : ""}`} onClick={() => setShowFilter(true)}>
              <Filter size={14} />Filter{selectedCategories.length > 0 && <span className="filter-count">{selectedCategories.length}</span>}
            </button>
          </div>

          {hasFilters && <p className="result-count">Showing {filtered.length} of {squads.length} squads</p>}

          <AnimatePresence>
            {showFilter && (
              <motion.div className="popup-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFilter(false)}>
                <motion.div className="popup-card" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
                  <div className="popup-header">
                    <p className="popup-title"><Filter size={16} style={{ color: "var(--amber)" }} />Filter by Category</p>
                    <button className="popup-close" onClick={() => setShowFilter(false)}><X size={16} /></button>
                  </div>
                  <div className="popup-section">
                    <p className="popup-label">Categories</p>
                    <div className="cat-grid">
                      {CATEGORIES.map((cat) => (
                        <div key={cat} className={`cat-option ${selectedCategories.includes(cat) ? "active" : ""}`} onClick={() => toggleCategory(cat)}>
                          <div className="cat-check">{selectedCategories.includes(cat) && <Check size={9} style={{ color: "var(--text-inverse)" }} />}</div>
                          {cat}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="popup-actions">
                    <button className="popup-clear" onClick={() => { setSelectedCategories([]); setSearch(""); }}>Clear All</button>
                    <button className="popup-apply" onClick={() => setShowFilter(false)}>Apply Filters</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div className="squad-grid" key={selectedCategories.join(",") + search} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {filtered.map((squad, i) => (
                  <motion.div key={squad.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <Link href={`/squads/${squad.id}`} className="squad-card">
                      <div className="squad-card-top">
                        <div className="squad-icon-wrap">
                          <div className="squad-icon">{squad.icon}</div>
                          <div><p className="squad-name">{squad.name}</p><p className="squad-owner">by {squad.ownerName}</p></div>
                        </div>
                        <span className="squad-category">{squad.category}</span>
                      </div>
                      <p className="squad-desc">{squad.description}</p>
                      <div className="squad-meta">
                        <span className="squad-meta-item"><Users size={12} />{squad.memberCount} members</span>
                        <span className="squad-meta-item"><Hash size={12} />{squad.roomCount} rooms</span>
                        <ArrowRight size={15} className="squad-arrow" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="empty-state">
                <Users size={56} className="empty-icon" />
                <p className="empty-title">{hasFilters ? "No squads match your filters" : "No squads yet"}</p>
                <p className="empty-sub">{hasFilters ? "Try different keywords." : "Be the first to create a squad!"}</p>
                {!hasFilters && <Link href="/squads/create" className="create-btn"><Plus size={14} /> Create Squad</Link>}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}