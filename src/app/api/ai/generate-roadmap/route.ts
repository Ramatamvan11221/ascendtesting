import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { currentGoal: true, challenges: true },
    });

    if (!user?.currentGoal) {
      return NextResponse.json({ error: "Set your goal first" }, { status: 400 });
    }

    const prompt = `Kamu adalah AI career coach untuk ASCEND, platform untuk orang-orang ambisius.

Seorang pengguna memiliki goal: "${user.currentGoal}"
Tantangan yang dia hadapi: ${user.challenges?.join(", ") || "berbagai tantangan"}

Buatkan ROADMAP DETAIL 15-20 LANGKAH dari awal sampai goal tercapai.
Setiap langkah HARUS berbeda, SPESIFIK, dan ACTIONABLE.
JANGAN ulangi langkah yang sama. Gunakan Bahasa Indonesia.
Format output HARUS JSON valid dengan key "steps" berisi array string.
Contoh: {"steps": ["Langkah 1: Riset tentang...", "Langkah 2: Mulai belajar...", ...]}
Jangan tambahkan teks apapun selain JSON. Jangan pakai markdown code block.`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "ASCEND - Roadmap Generator",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1200,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";

    // Clean response
    let cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .replace(/```/g, "")
      .trim();

    // Try to extract just the JSON part
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }

    let steps: string[] = [];

    try {
      const parsed = JSON.parse(cleaned);
      if (parsed.steps && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
        steps = parsed.steps;
      } else if (Array.isArray(parsed)) {
        steps = parsed;
      }
    } catch {
      // Try line-by-line extraction
      const lines = text
        .split("\n")
        .map((l: string) => l.trim())
        .filter((l: string) => l.length > 10 && (l.match(/^\d+[\.\)]\s/) || l.startsWith("Langkah") || l.startsWith("-")));

      if (lines.length >= 5) {
        steps = lines.slice(0, 20).map((l: string) => l.replace(/^\d+[\.\)]\s*/, "").replace(/^-\s*/, "").trim());
      }
    }

    // Fallback if all parsing fails
    if (steps.length === 0) {
      steps = [
        `Riset mendalam tentang ${user.currentGoal}`,
        `Tentukan target spesifik dan terukur untuk ${user.currentGoal}`,
        `Buat jadwal belajar atau praktik rutin setiap hari`,
        `Cari mentor atau komunitas yang relevan dengan ${user.currentGoal}`,
        `Bangun portfolio atau proyek nyata sebagai bukti kemampuan`,
        `Ikuti kursus online atau sertifikasi resmi di bidang ini`,
        `Networking dengan profesional yang sudah sukses di bidang ini`,
        `Cari magang atau kerja sukarela untuk dapat pengalaman`,
        `Kuasai skill teknis utama yang dibutuhkan`,
        `Pelajari soft skill: komunikasi, leadership, time management`,
        `Bangun personal branding di LinkedIn dan media sosial`,
        `Cari peluang freelance atau part-time untuk jam terbang`,
        `Evaluasi progress setiap bulan dan sesuaikan strategi`,
        `Ikuti konferensi, workshop, atau meetup industri`,
        `Apply ke perusahaan target secara strategis dan terencana`,
        `Persiapkan CV, portfolio, dan interview dengan matang`,
        `Negosiasi gaji dan benefit dengan percaya diri`,
        `Mulai bekerja dan terus belajar dari rekan kerja`,
        `Bangun koneksi dan relasi di tempat kerja baru`,
        `Rayakan pencapaian dan tetapkan goal berikutnya yang lebih tinggi`,
      ];
    }

    // Ensure unique steps
    steps = [...new Set(steps)];

    // Save to database
    await prisma.roadmapNode.deleteMany({ where: { userId: session.id } });
    for (let i = 0; i < steps.length; i++) {
      await prisma.roadmapNode.create({
        data: {
          title: steps[i],
          order: i + 1,
          userId: session.id,
        },
      });
    }

    const roadmap = await prisma.roadmapNode.findMany({
      where: { userId: session.id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, roadmap });
  } catch (error) {
    console.error("Roadmap error:", error);
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 });
  }
}