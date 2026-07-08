import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 10 versi berbeda untuk Future Self dengan format template
const FUTURE_SELF_VERSIONS = [
  {
    title: "A Letter From Your Future",
    letter: "Hai. Kalau kamu sedang membaca surat ini, berarti kamu masih berada di titik ketika semuanya terasa sulit. Aku hanya ingin bilang satu hal: jangan menyerah. Semua malam begadang, rasa takut, dan keraguan yang kamu rasakan hari ini ternyata menjadi fondasi kehidupan yang sekarang sedang aku jalani. Terus melangkah, meski pelan.",
    quote: "Success is the product of daily habits—not once-in-a-lifetime transformations.",
    author: "James Clear",
    steps: [
      "Mulai dari satu kebiasaan kecil yang mendukung goal-mu hari ini",
      "Konsisten setiap hari, meski hanya 15 menit",
      "Cari mentor atau komunitas yang sejalan dengan goal-mu",
      "Evaluasi progres mingguan dan catat perkembanganmu",
      "Nikmati setiap perkembangan sekecil apapun"
    ]
  },
  {
    title: "A Letter From Your Future",
    letter: "Hari ini mungkin terasa berat, tapi percayalah, semua ini tidak sia-sia. Aku adalah bukti bahwa kamu berhasil melewati fase yang sekarang sedang kamu hadapi. Setiap tetes keringat dan air mata yang kamu keluarkan sedang membangun versi terbaik dari dirimu. Teruslah berjuang, karena aku di sini menunggumu.",
    quote: "The future depends on what you do today.",
    author: "Mahatma Gandhi",
    steps: [
      "Tentukan target mingguan yang spesifik untuk goal-mu",
      "Fokus pada satu prioritas utama setiap harinya",
      "Kurangi distraksi yang menghambat progressmu",
      "Bangun rutinitas belajar yang konsisten",
      "Refleksi setiap akhir minggu dan sesuaikan strategi"
    ]
  },
  {
    title: "A Letter From Your Future",
    letter: "Aku tahu kamu sering membandingkan dirimu dengan orang lain. Berhenti. Perlombaanmu bukan dengan mereka, tetapi dengan dirimu yang kemarin. Setiap langkah kecil yang kamu ambil hari ini adalah kemenangan atas versi dirimu yang dulu. Teruslah melangkah, aku sangat bangga padamu.",
    quote: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    steps: [
      "Fokus pada progress dirimu sendiri, bukan orang lain",
      "Catat setiap pencapaian kecil yang kamu raih",
      "Buat target yang menantang namun realistis",
      "Rayakan setiap kemenangan, sekecil apapun",
      "Terus bergerak maju meski pelan-pelan"
    ]
  },
  {
    title: "A Letter From Your Future",
    letter: "Suatu hari nanti kamu akan tersenyum mengingat semua perjuangan ini. Yang sekarang terlihat mustahil, ternyata hanya membutuhkan waktu dan konsistensi. Percayalah pada proses, karena setiap usaha yang kamu lakukan sekarang sedang membentuk masa depan yang indah. Aku adalah buktinya.",
    quote: "Everything you've ever wanted is on the other side of fear.",
    author: "George Addair",
    steps: [
      "Hadapi ketakutanmu dengan langkah kecil setiap hari",
      "Buat timeline pencapaian yang jelas dan terukur",
      "Konsisten dalam menjalankan rencana yang sudah dibuat",
      "Belajar dari setiap kegagalan dan bangkit kembali",
      "Percaya bahwa semua usaha tidak akan sia-sia"
    ]
  },
  {
    title: "A Letter From Your Future",
    letter: "Terima kasih sudah tidak menyerah. Keputusan-keputusan kecil yang kamu ambil setiap hari ternyata mengubah seluruh hidup kita. Dari bangun pagi, memilih belajar daripada bermalas-malasan, hingga tetap berjuang saat lelah—semua itu berarti. Aku di sini karena kamu tidak pernah berhenti.",
    quote: "Discipline is the bridge between goals and accomplishment.",
    author: "Jim Rohn",
    steps: [
      "Bangun disiplin diri dengan rutinitas harian",
      "Buat keputusan kecil yang mendukung goal besar",
      "Tetap konsisten meski motivasi menurun",
      "Fokus pada proses, bukan hanya hasil akhir",
      "Terus bergerak maju satu langkah demi satu"
    ]
  },
  {
    title: "A Letter From Your Future",
    letter: "Aku bangga karena kamu tetap berjalan bahkan saat tidak ada yang bertepuk tangan untukmu. Ketika semua orang meragukanmu, kamu tetap percaya pada dirimu sendiri. Itulah yang membuat kita sampai di sini. Teruslah berjalan, karena perjalanan ini milikmu sepenuhnya.",
    quote: "Fall seven times, stand up eight.",
    author: "Japanese Proverb",
    steps: [
      "Bangkit setiap kali kamu jatuh dan gagal",
      "Jangan pedulikan pendapat negatif orang lain",
      "Tetaplah percaya pada kemampuan dirimu sendiri",
      "Terus melangkah meski terasa berat",
      "Jadikan setiap kegagalan sebagai guru terbaik"
    ]
  },
  {
    title: "A Letter From Your Future",
    letter: "Kamu tidak membutuhkan bakat yang luar biasa. Kamu hanya membutuhkan keberanian untuk terus mencoba. Setiap kali kamu mencoba, setiap kali kamu gagal lalu bangkit, kamu sedang menciptakan versi terbaik dari dirimu. Keberanianmu adalah kunci dari semua pencapaian kita.",
    quote: "Dream big and dare to fail.",
    author: "Norman Vaughan",
    steps: [
      "Beranilah untuk memulai dari awal jika perlu",
      "Jangan takut gagal, itu bagian dari proses",
      "Coba pendekatan baru jika yang lama tidak berhasil",
      "Terus belajar dari setiap kesalahan",
      "Percaya bahwa keberanian lebih penting dari bakat"
    ]
  },
  {
    title: "A Letter From Your Future",
    letter: "Teruslah belajar. Setiap halaman yang kamu baca dan setiap kesalahan yang kamu perbaiki sedang membangun masa depan kita. Pengetahuan yang kamu kumpulkan hari ini adalah fondasi dari semua pencapaian kita di masa depan. Jangan pernah berhenti belajar, karena itulah kunci kesuksesan.",
    quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
    steps: [
      "Baca buku dan artikel yang relevan setiap hari",
      "Ikuti kursus atau pelatihan untuk mengasah skill",
      "Belajar dari kesalahan dan perbaiki terus menerus",
      "Cari pengetahuan dari berbagai sumber",
      "Terapkan ilmu yang dipelajari dalam tindakan nyata"
    ]
  },
  {
    title: "A Letter From Your Future",
    letter: "Aku tidak datang untuk mengatakan semuanya mudah. Aku datang untuk mengatakan semuanya layak diperjuangkan. Setiap rintangan yang kamu hadapi hari ini adalah batu loncatan menuju kesuksesan. Jangan pernah menyerah, karena semua perjuanganmu akan terbayar. Aku menunggumu di sana.",
    quote: "Great things are done by a series of small things brought together.",
    author: "Vincent van Gogh",
    steps: [
      "Hargai setiap proses dan perjuangan yang kamu lalui",
      "Gabungkan hal-hal kecil menjadi pencapaian besar",
      "Tetap semangat meski jalannya terjal",
      "Ingat bahwa semua usaha tidak pernah sia-sia",
      "Nikmati perjalanan menuju goal-mu"
    ]
  },
  {
    title: "A Letter From Your Future",
    letter: "Kalau ada satu hal yang ingin aku ubah dari masa lalu, itu adalah berharap kamu lebih percaya pada dirimu sendiri sejak awal. Kamu lebih kuat, lebih pintar, dan lebih mampu dari yang kamu kira. Percayalah pada dirimu sendiri, karena aku adalah bukti dari keyakinan itu.",
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    steps: [
      "Mulai percaya pada kemampuan dirimu sendiri",
      "Hilangkan keraguan dan self-doubt",
      "Fokus pada kekuatan dan potensimu",
      "Ambil tindakan berani meski ada rasa takut",
      "Yakin bahwa kamu mampu mencapai goal-mu"
    ]
  }
];

// Track used versions per user (in memory)
const usedVersions = new Map<string, Set<number>>();

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
    const userId = session.id;

    // Get or create used versions set for this user
    if (!usedVersions.has(userId)) {
      usedVersions.set(userId, new Set<number>());
    }

    const used = usedVersions.get(userId)!;
    
    // If user has used all 10 versions, reset the pool
    if (used.size >= FUTURE_SELF_VERSIONS.length) {
      used.clear();
    }

    // Find available versions (not yet used)
    const availableIndices = FUTURE_SELF_VERSIONS
      .map((_, index) => index)
      .filter(index => !used.has(index));

    if (availableIndices.length === 0) {
      used.clear();
    }

    // Pick a random available version
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    const selectedVersion = FUTURE_SELF_VERSIONS[randomIndex];
    
    // Mark as used
    used.add(randomIndex);

    // Format the result with all fields
    const result = {
      letter: selectedVersion.letter,
      quote: selectedVersion.quote,
      author: selectedVersion.author,
      steps: selectedVersion.steps.map(step => 
        step
          .replace(/goal-mu|Goal-mu/g, goal)
          .replace(/goal|Goal/g, goal)
      )
    };

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