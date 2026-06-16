interface RoadmapStep {
  title: string;
  description: string;
}

export async function generateRoadmap(goal: string, challenges: string[]): Promise<RoadmapStep[]> {
  const prompt = `Kamu adalah AI coach yang membantu orang mencapai tujuan mereka.

Seorang pengguna ASCEND memiliki goal: "${goal}"

Tantangan yang dia hadapi: ${challenges.join(", ") || "tidak disebutkan"}

Buatkan roadmap langkah demi langkah yang SPESIFIK dan ACTIONABLE untuk mencapai goal tersebut.
Maksimal 7 langkah.
Gunakan Bahasa Indonesia yang memotivasi.

Format output HARUS JSON valid dengan struktur berikut, tanpa teks lain:
[
  {
    "title": "Judul Langkah",
    "description": "Deskripsi detail dan actionable"
  }
]`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
      }),
    });

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";

    // Clean up markdown code blocks
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    return JSON.parse(cleaned) as RoadmapStep[];
  } catch {
    // Fallback
    return [
      { title: "Mulai perjalananmu", description: `Langkah pertama menuju: ${goal}` },
      { title: "Bangun kebiasaan", description: "Konsisten setiap hari" },
      { title: "Evaluasi progress", description: "Cek perkembanganmu secara berkala" },
      { title: "Rayakan pencapaian", description: `Kamu berhasil mencapai: ${goal}! 🎉` },
    ];
  }
}