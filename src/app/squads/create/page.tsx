import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Zap, Users, Target, Sparkles } from "lucide-react";

const STYLES = `
  .cs-wrap{min-height:100vh;background:radial-gradient(ellipse at 50% 30%,rgba(245,158,11,0.05),transparent 60%),#070c14;padding:20px 14px;display:flex;align-items:center;justify-content:center;}
  @media(min-width:480px){.cs-wrap{padding:28px 20px;}}
  @media(min-width:768px){.cs-wrap{padding:32px;}}
  .cs-card{width:100%;max-width:520px;border-radius:20px;background:rgba(15,22,36,0.55);border:1px solid rgba(255,255,255,0.05);backdrop-filter:blur(18px);padding:24px 20px;position:relative;overflow:hidden;}
  @media(min-width:480px){.cs-card{padding:36px;border-radius:22px;}}
  .cs-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(245,158,11,0.4),rgba(249,115,22,0.3),transparent);border-radius:2px 2px 0 0;}
  .back-link{display:inline-flex;align-items:center;gap:5px;color:#5a6478;text-decoration:none;font-size:12px;margin-bottom:22px;transition:color 0.3s;}
  @media(min-width:480px){.back-link{font-size:13px;margin-bottom:28px;}}
  .back-link:hover{color:#f59e0b;}
  .form-title{font-size:22px;font-weight:700;color:#edeff2;margin-bottom:4px;letter-spacing:-0.02em;}
  @media(min-width:480px){.form-title{font-size:24px;}}
  .form-sub{font-size:12px;color:#5a6478;margin-bottom:22px;}
  @media(min-width:480px){.form-sub{font-size:13px;margin-bottom:28px;}}
  .form-group{margin-bottom:14px;}
  @media(min-width:480px){.form-group{margin-bottom:18px;}}
  .form-label{font-size:10px;font-weight:600;color:#9aa4b8;margin-bottom:5px;display:block;letter-spacing:0.06em;text-transform:uppercase;}
  @media(min-width:480px){.form-label{font-size:11px;}}
  .form-input{width:100%;padding:10px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);color:#edeff2;font-size:13px;font-family:'Inter',sans-serif;outline:none;transition:all 0.3s ease;}
  @media(min-width:480px){.form-input{padding:12px 16px;border-radius:12px;font-size:14px;}}
  .form-input:focus{border-color:rgba(245,158,11,0.4);box-shadow:0 0 0 4px rgba(245,158,11,0.04);}
  .form-input::placeholder{color:#3a4458;}
  .icon-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;}
  @media(min-width:480px){.icon-grid{grid-template-columns:repeat(6,1fr);gap:8px;}}
  .icon-opt{padding:8px;border-radius:10px;border:1px solid rgba(255,255,255,0.05);background:rgba(255,255,255,0.015);cursor:pointer;font-size:18px;text-align:center;transition:all 0.2s ease;position:relative;}
  @media(min-width:480px){.icon-opt{padding:10px;border-radius:12px;font-size:22px;}}
  .icon-opt:hover{border-color:rgba(245,158,11,0.3);background:rgba(245,158,11,0.04);}
  .icon-opt input{display:none;}
  .icon-opt:has(input:checked){border-color:rgba(245,158,11,0.5);background:rgba(245,158,11,0.08);box-shadow:0 0 16px rgba(245,158,11,0.06);}
  .icon-opt.selected{border-color:rgba(245,158,11,0.5);background:rgba(245,158,11,0.08);box-shadow:0 0 16px rgba(245,158,11,0.06);}
  .cat-grid{display:flex;flex-wrap:wrap;gap:5px;}
  @media(min-width:480px){.cat-grid{gap:6px;}}
  .cat-opt{padding:5px 10px;border-radius:7px;border:1px solid rgba(255,255,255,0.05);background:rgba(255,255,255,0.015);cursor:pointer;font-size:11px;color:#5a6478;transition:all 0.2s ease;font-family:'Inter',sans-serif;position:relative;}
  @media(min-width:480px){.cat-opt{padding:6px 12px;border-radius:8px;font-size:12px;}}
  .cat-opt:hover{border-color:rgba(245,158,11,0.3);color:#9aa4b8;}
  .cat-opt input{display:none;}
  .cat-opt:has(input:checked){border-color:rgba(245,158,11,0.5);background:rgba(245,158,11,0.08);color:#f59e0b;}
  .cat-opt.selected{border-color:rgba(245,158,11,0.5);background:rgba(245,158,11,0.08);color:#f59e0b;}
  .submit-btn{width:100%;padding:12px;border-radius:12px;margin-top:6px;background:linear-gradient(135deg,#f59e0b,#f97316);color:#0a0a0a;font-size:14px;font-weight:600;border:none;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.3s ease;box-shadow:0 12px 30px -10px rgba(245,158,11,0.3);}
  @media(min-width:480px){.submit-btn{padding:14px;border-radius:14px;margin-top:8px;font-size:15px;}}
  .submit-btn:hover{transform:scale(1.02);box-shadow:0 16px 40px -12px rgba(245,158,11,0.4);}
  .sr{opacity:0;transform:translateY(20px);transition:all 0.6s cubic-bezier(0.22,0.61,0.36,1);}
  .sr.visible{opacity:1;transform:translateY(0);}
`;

const ICONS = ["🚀", "🎓", "💻", "🇯🇵", "🏆", "💰", "💪", "📖", "🎨", "✍️", "🎯", "🧠"];
const CATEGORIES = ["Akademik", "Teknologi", "Bahasa", "Karir", "Kesehatan", "Kompetisi", "Startup", "Seni", "Umum"];

export default async function CreateSquadPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  async function createSquad(formData: FormData) {
    "use server";
    const userSession = await getSession();
    if (!userSession) redirect("/login");
    const name = formData.get("name") as string;
    if (!name) return;
    const goal = formData.get("goal") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const icon = formData.get("icon") as string;
    const squad = await prisma.squad.create({
      data: { name, goal: goal || "", description: description || "", category: category || "Umum", icon: icon || "🚀", ownerId: userSession.id, memberCount: 1 },
    });
    await prisma.squadMember.create({ data: { squadId: squad.id, userId: userSession.id, role: "OWNER" } });
    redirect(`/squads/${squad.id}`);
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="cs-wrap">
        <div className="cs-card">
          <Link href="/squads" className="back-link"><ArrowLeft size={13} /> Back to Discover</Link>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "linear-gradient(135deg, #f59e0b, #f97316)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Users size={15} style={{ color: "#0a0a0a" }} />
            </div>
            <h1 className="form-title">Create Your Squad</h1>
          </div>
          <p className="form-sub">Gather people who share your ambition.</p>

          <form action={createSquad}>
            <div className="form-group">
              <label className="form-label">Squad Name *</label>
              <input name="name" className="form-input" placeholder="e.g., Pejuang SNBT 2026" required />
            </div>
            <div className="form-group">
              <label className="form-label">Goal</label>
              <input name="goal" className="form-input" placeholder="e.g., Lolos SNBT masuk PTN impian" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input name="description" className="form-input" placeholder="What is this squad about?" />
            </div>
            <div className="form-group">
              <label className="form-label">Icon</label>
              <div className="icon-grid">
                {ICONS.map((icon) => (
                  <label key={icon} className="icon-opt">
                    <input type="radio" name="icon" value={icon} defaultChecked={icon === "🚀"} />
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
                    <input type="radio" name="category" value={cat} defaultChecked={cat === "Umum"} />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="submit-btn">
              <Sparkles size={14} style={{ marginRight: "6px", display: "inline" }} />
              Create Squad
            </button>
          </form>
        </div>
      </div>
    </>
  );
}