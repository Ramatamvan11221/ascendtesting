import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { currentGoal: true, futureSelfGoal: true, challenges: true },
    });

    if (!user?.currentGoal) {
      return NextResponse.json({ error: "Set your goal first in onboarding" }, { status: 400 });
    }

    const goal = user.futureSelfGoal || user.currentGoal;
    const challenges = user.challenges?.join(", ") || "berbagai tantangan";

    const prompt = `Kamu adalah AI coach untuk ASCEND, platform untuk orang-orang ambisius.

Seorang pengguna memiliki goal: "${goal}"
Tantangan yang dia hadapi: ${challenges}

TOLONG OUTPUT DALAM BAHASA INDONESIA.

Buatkan:
1. SEPUCUK SURAT SINGKAT (3-4 kalimat) dari "future self" (dirinya 5 tahun dari sekarang) untuk dirinya saat ini. Surat harus personal, memotivasi, dan menyebutkan goal spesifiknya.

2. ROADMAP 5 LANGKAH KONKRET untuk mencapai goal tersebut. Setiap langkah harus SPESIFIK dan ACTIONABLE.

Format output HARUS JSON valid:
{
  "letter": "Surat singkat 3-4 kalimat...",
  "steps": [
    "Langkah 1: ...",
    "Langkah 2: ...",
    "Langkah 3: ...",
    "Langkah 4: ...",
    "Langkah 5: ..."
  ]
}`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "ASCEND - Future Self",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
      }),
    });

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch {
      result = {
        letter: `Hai, aku dari masa depan. Semua kerja kerasmu untuk "${goal}" telah terbayar. Kamu berhasil. Teruslah melangkah, aku menunggumu di sini.`,
        steps: [
          `Tentukan target spesifik untuk ${goal}`,
          "Buat jadwal belajar/praktik rutin setiap hari",
          "Cari mentor atau komunitas yang sejalan",
          "Evaluasi progress setiap bulan",
          "Rayakan setiap pencapaian kecil",
        ],
      };
    }

    // Save to database
    await prisma.futureSelf.upsert({
      where: { userId: session.id },
      create: { userId: session.id, content: JSON.stringify(result), goal },
      update: { content: JSON.stringify(result), goal },
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Future self error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const fs = await prisma.futureSelf.findUnique({ where: { userId: session.id } });
    if (!fs) return NextResponse.json({ data: null });

    return NextResponse.json({ data: JSON.parse(fs.content) });
  } catch {
    return NextResponse.json({ data: null });
  }
}