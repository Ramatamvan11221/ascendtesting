"use client";
import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Sparkles, Plus, X } from "lucide-react";
import { toast } from "sonner";

const STYLES = `
  .cs-wrap{min-height:100vh;background:radial-gradient(ellipse at 50% 30%,rgba(245,158,11,0.05),transparent 60%),var(--bg-primary);padding:20px 14px;display:flex;align-items:center;justify-content:center;}
  @media(min-width:480px){.cs-wrap{padding:28px 20px;}}
  @media(min-width:768px){.cs-wrap{padding:32px;}}
  .cs-card{width:100%;max-width:520px;border-radius:20px;background:var(--bg-card);border:1px solid var(--border-subtle);backdrop-filter:blur(18px);padding:24px 20px;position:relative;overflow:hidden;}
  @media(min-width:480px){.cs-card{padding:36px;border-radius:22px;}}
  .cs-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(245,158,11,0.4),rgba(249,115,22,0.3),transparent);border-radius:2px 2px 0 0;}
  .back-link{display:inline-flex;align-items:center;gap:5px;color:var(--text-muted);text-decoration:none;font-size:12px;margin-bottom:22px;transition:color 0.3s;}
  @media(min-width:480px){.back-link{font-size:13px;margin-bottom:28px;}}
  .back-link:hover{color:var(--amber);}
  .form-title{font-size:22px;font-weight:700;color:var(--text-primary);margin-bottom:4px;letter-spacing:-0.02em;}
  @media(min-width:480px){.form-title{font-size:24px;}}
  .form-sub{font-size:12px;color:var(--text-muted);margin-bottom:22px;}
  @media(min-width:480px){.form-sub{font-size:13px;margin-bottom:28px;}}
  .form-group{margin-bottom:14px;}
  @media(min-width:480px){.form-group{margin-bottom:18px;}}
  .form-label{font-size:10px;font-weight:600;color:var(--text-secondary);margin-bottom:5px;display:block;letter-spacing:0.06em;text-transform:uppercase;}
  @media(min-width:480px){.form-label{font-size:11px;}}
  .form-input{width:100%;padding:10px 14px;border-radius:10px;border:1px solid var(--border-medium);background:var(--bg-input);color:var(--text-primary);font-size:13px;font-family:'Inter',sans-serif;outline:none;transition:all 0.3s ease;}
  @media(min-width:480px){.form-input{padding:12px 16px;border-radius:12px;font-size:14px;}}
  .form-input:focus{border-color:rgba(245,158,11,0.4);box-shadow:0 0 0 4px rgba(245,158,11,0.04);}
  .form-input::placeholder{color:var(--text-muted);opacity:0.5;}
  .form-input:disabled{opacity:0.4;cursor:not-allowed;}
  .icon-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;}
  @media(min-width:480px){.icon-grid{grid-template-columns:repeat(6,1fr);gap:8px;}}
  .icon-opt{padding:8px;border-radius:10px;border:1px solid var(--border-medium);background:var(--bg-input);cursor:pointer;font-size:18px;text-align:center;transition:all 0.2s ease;position:relative;}
  @media(min-width:480px){.icon-opt{padding:10px;border-radius:12px;font-size:22px;}}
  .icon-opt:hover{border-color:rgba(245,158,11,0.3);background:rgba(245,158,11,0.04);}
  .icon-opt input{display:none;}
  .icon-opt:has(input:checked){border-color:rgba(245,158,11,0.5);background:rgba(245,158,11,0.08);box-shadow:0 0 16px rgba(245,158,11,0.06);}
  .icon-opt input:disabled + *{opacity:0.4;cursor:not-allowed;}
  .cat-grid{display:flex;flex-wrap:wrap;gap:5px;}
  @media(min-width:480px){.cat-grid{gap:6px;}}
  .cat-opt{padding:5px 10px;border-radius:7px;border:1px solid var(--border-medium);background:var(--bg-input);cursor:pointer;font-size:11px;color:var(--text-muted);transition:all 0.2s ease;font-family:'Inter',sans-serif;position:relative;}
  @media(min-width:480px){.cat-opt{padding:6px 12px;border-radius:8px;font-size:12px;}}
  .cat-opt:hover{border-color:rgba(245,158,11,0.3);color:var(--text-secondary);}
  .cat-opt input{display:none;}
  .cat-opt:has(input:checked){border-color:rgba(245,158,11,0.5);background:rgba(245,158,11,0.08);color:var(--amber);}
  .cat-opt input:disabled + *{opacity:0.4;cursor:not-allowed;}

  /* ===== Custom category ===== */
  .custom-cat-box{display:flex;gap:8px;margin-top:10px;}
  .custom-cat-box input{flex:1;padding:8px 12px;border-radius:8px;border:1px dashed rgba(245,158,11,0.28);background:rgba(245,158,11,0.02);color:var(--text-primary);font-size:12px;font-family:'Inter',sans-serif;outline:none;transition:all 0.3s ease;}
  @media(min-width:480px){.custom-cat-box input{font-size:13px;padding:9px 14px;}}
  .custom-cat-box input:focus{border-color:rgba(245,158,11,0.5);border-style:solid;background:rgba(245,158,11,0.04);}
  .custom-cat-box input::placeholder{color:var(--text-muted);opacity:0.5;}
  .btn-add-cat{flex-shrink:0;width:34px;height:34px;border-radius:8px;background:linear-gradient(135deg,var(--amber),var(--orange));border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-inverse);transition:all 0.3s ease;box-shadow:0 8px 20px -10px rgba(245,158,11,0.4);}
  @media(min-width:480px){.btn-add-cat{width:38px;height:38px;}}
  .btn-add-cat:hover{transform:scale(1.06) rotate(90deg);}
  .btn-add-cat:disabled{opacity:0.35;cursor:not-allowed;transform:none;}
  .custom-cat-chip{display:flex;align-items:center;gap:5px;padding:5px 6px 5px 10px;border-radius:7px;font-size:11px;font-weight:500;border:1px solid rgba(245,158,11,0.28);background:rgba(245,158,11,0.05);color:#f0b657;cursor:pointer;transition:all 0.2s ease;font-family:'Inter',sans-serif;}
  @media(min-width:480px){.custom-cat-chip{padding:6px 7px 6px 12px;font-size:12px;border-radius:8px;}}
  .custom-cat-chip.active{background:linear-gradient(135deg,rgba(245,158,11,0.2),rgba(249,115,22,0.1));color:var(--amber);box-shadow:0 0 16px rgba(245,158,11,0.1);border-color:rgba(245,158,11,0.5);}
  .custom-cat-chip .chip-x{background:none;border:none;color:inherit;cursor:pointer;display:flex;align-items:center;padding:1px;opacity:0.5;transition:opacity 0.2s;}
  .custom-cat-chip .chip-x:hover{opacity:1;}

  .submit-btn{width:100%;padding:12px;border-radius:12px;margin-top:6px;background:linear-gradient(135deg,var(--amber),var(--orange));color:var(--text-inverse);font-size:14px;font-weight:600;border:none;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.3s ease;box-shadow:0 12px 30px -10px rgba(245,158,11,0.3);display:flex;align-items:center;justify-content:center;gap:8px;}
  @media(min-width:480px){.submit-btn{padding:14px;border-radius:14px;margin-top:8px;font-size:15px;}}
  .submit-btn:hover:not(:disabled){transform:scale(1.02);box-shadow:0 16px 40px -12px rgba(245,158,11,0.4);}
  .submit-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
  .spinner{width:18px;height:18px;border:2px solid rgba(0,0,0,0.2);border-top-color:var(--text-inverse);border-radius:50%;animation:spin 0.6s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg)}}
  .error-banner{margin-bottom:16px;padding:10px 14px;border-radius:10px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:var(--red);font-size:13px;display:flex;align-items:center;gap:8px;}
`;

const ICONS = ["🚀", "🎓", "💻", "🇯🇵", "🏆", "💰", "💪", "📖", "🎨", "✍️", "🎯", "🧠"];
const CATEGORIES = ["Akademik", "Teknologi", "Bahasa", "Karir", "Kesehatan", "Olahraga", "Kompetisi", "Startup", "Seni", "Umum"];

export default function CreateSquadPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // ===== category state (supports custom categories) =====
  const [selectedCategory, setSelectedCategory] = useState("Umum");
  const [customCatInput, setCustomCatInput] = useState("");
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ascend_custom_squad_categories");
      if (saved) setCustomCategories(JSON.parse(saved));
    } catch {
      // ignore malformed storage
    }
  }, []);

  const persistCustomCategories = (cats: string[]) => {
    setCustomCategories(cats);
    try {
      localStorage.setItem("ascend_custom_squad_categories", JSON.stringify(cats));
    } catch {
      // storage unavailable, ignore silently
    }
  };

  const addCustomCategory = () => {
    const trimmed = customCatInput.trim();
    if (!trimmed) return;
    if (trimmed.length > 30) {
      toast.error("Maksimal 30 karakter ya");
      return;
    }
    const updated = customCategories.includes(trimmed) ? customCategories : [...customCategories, trimmed];
    persistCustomCategories(updated);
    setSelectedCategory(trimmed);
    setCustomCatInput("");
    toast.success("Kategori baru ditambahkan!");
  };

  const removeCustomCategory = (cat: string) => {
    const updated = customCategories.filter((c) => c !== cat);
    persistCustomCategories(updated);
    if (selectedCategory === cat) setSelectedCategory("Umum");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    if (!name || !name.trim()) {
      setError("Squad name is required");
      toast.error("Squad name is required");
      return;
    }
    startTransition(async () => {
      try {
        const response = await fetch("/api/squads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            goal: formData.get("goal") as string || "",
            description: formData.get("description") as string || "",
            category: selectedCategory || "Umum",
            icon: formData.get("icon") as string || "🚀",
          }),
        });
        if (!response.ok) {
          let errorMessage = "Failed to create squad";
          try {
            const data = await response.json();
            errorMessage = data.error || errorMessage;
          } catch {
            errorMessage = `Error ${response.status}: ${response.statusText || "Unknown error"}`;
          }
          throw new Error(errorMessage);
        }
        const data = await response.json();

        if (!data.squad) {
          throw new Error("Invalid response from server");
        }
        toast.success("Squad created successfully! 🎉");
        router.push(`/squads/${data.squad.id}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create squad";
        setError(message);
        toast.error(message);
      }
    });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="cs-wrap">
        <div className="cs-card">
          <Link href="/squads" className="back-link"><ArrowLeft size={13} /> Back to Discover</Link>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "linear-gradient(135deg, var(--amber), var(--orange))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Users size={15} style={{ color: "var(--text-inverse)" }} />
            </div>
            <h1 className="form-title">Create Your Squad</h1>
          </div>
          <p className="form-sub">Gather people who share your ambition.</p>
          {error && (
            <div className="error-banner">
              <span>⚠️</span> {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Squad Name *</label>
              <input
                name="name"
                className="form-input"
                placeholder="e.g., Pejuang SNBT 2026"
                required
                disabled={isPending}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Goal</label>
              <input
                name="goal"
                className="form-input"
                placeholder="e.g., Lolos SNBT masuk PTN impian"
                disabled={isPending}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                name="description"
                className="form-input"
                placeholder="What is this squad about?"
                disabled={isPending}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Icon</label>
              <div className="icon-grid">
                {ICONS.map((icon) => (
                  <label key={icon} className="icon-opt">
                    <input type="radio" name="icon" value={icon} defaultChecked={icon === "🚀"} disabled={isPending} />
                    {icon}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <div className="cat-grid">
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="cat-opt">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      disabled={isPending}
                    />
                    {cat}
                  </label>
                ))}
              </div>

              {/* Custom category input */}
              <div className="custom-cat-box">
                <input
                  placeholder="Kategori lain? Ketik sendiri..."
                  value={customCatInput}
                  onChange={(e) => setCustomCatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomCategory(); } }}
                  disabled={isPending}
                />
                <button type="button" className="btn-add-cat" onClick={addCustomCategory} disabled={isPending || !customCatInput.trim()}>
                  <Plus size={16} />
                </button>
              </div>

              {/* Custom category chips */}
              {customCategories.length > 0 && (
                <div className="cat-grid" style={{ marginTop: "8px" }}>
                  {customCategories.map((cat) => (
                    <div
                      key={cat}
                      className={`custom-cat-chip ${selectedCategory === cat ? "active" : ""}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      <Sparkles size={10} /> {cat}
                      <button
                        type="button"
                        className="chip-x"
                        onClick={(e) => { e.stopPropagation(); removeCustomCategory(cat); }}
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" className="submit-btn" disabled={isPending}>
              {isPending ? (
                <>
                  <span className="spinner" />
                  Creating Squad...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Create Squad
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}