import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 10 versi berbeda untuk Roadmap (masing-masing 15-20 langkah)
const ROADMAP_VERSIONS = [
  [
    "Riset mendalam tentang bidang yang ingin digeluti",
    "Tentukan target spesifik dan terukur yang ingin dicapai",
    "Buat jadwal belajar atau praktik rutin setiap hari",
    "Cari mentor atau komunitas yang relevan",
    "Bangun portfolio atau proyek nyata sebagai bukti kemampuan",
    "Ikuti kursus online atau sertifikasi resmi di bidang ini",
    "Networking dengan profesional yang sudah sukses",
    "Cari magang atau kerja sukarela untuk dapat pengalaman",
    "Kuasai skill teknis utama yang dibutuhkan",
    "Pelajari soft skill: komunikasi, leadership, time management",
    "Bangun personal branding di LinkedIn dan media sosial",
    "Cari peluang freelance atau part-time untuk jam terbang",
    "Evaluasi progress setiap bulan dan sesuaikan strategi",
    "Ikuti konferensi, workshop, atau meetup industri",
    "Apply ke perusahaan target secara strategis",
    "Persiapkan CV, portfolio, dan interview dengan matang",
    "Negosiasi gaji dan benefit dengan percaya diri",
    "Mulai bekerja dan terus belajar dari rekan kerja",
    "Bangun koneksi dan relasi di tempat kerja baru",
    "Rayakan pencapaian dan tetapkan goal berikutnya"
  ],
  [
    "Tentukan visi 5 tahun ke depan",
    "Breakdown visi menjadi milestone tahunan yang jelas",
    "Identifikasi skill utama yang perlu dikuasai",
    "Cari sumber belajar terbaik (buku, kursus, mentor)",
    "Buat jadwal belajar mingguan yang konsisten",
    "Bergabung dengan komunitas praktisi di bidang ini",
    "Mulai proyek kecil sebagai pembelajaran praktis",
    "Ikuti kompetisi atau hackathon untuk mengasah skill",
    "Cari internship atau proyek kolaborasi",
    "Bangun network dengan para ahli di bidang ini",
    "Kembangkan portofolio yang showcase kemampuan terbaik",
    "Pelajari best practices dari industri terkait",
    "Terapkan knowledge ke proyek nyata",
    "Minta feedback dari mentor dan rekan sejawat",
    "Iterasi dan perbaiki berdasarkan feedback",
    "Scale up proyek ke level yang lebih tinggi",
    "Mulai personal branding melalui konten atau publikasi",
    "Apply ke posisi yang sesuai dengan passion",
    "Tunjukkan value proposition yang unik",
    "Capai goal dan mulai tantangan baru"
  ],
  [
    "Riset pasar dan peluang di bidang ini",
    "Identifikasi gap skill yang perlu dikejar",
    "Buat learning path yang terstruktur dan terukur",
    "Mulai dengan fundamental yang kuat",
    "Praktekkan langsung setiap konsep yang dipelajari",
    "Cari proyek open source untuk berkontribusi",
    "Bangun relasi dengan profesional di LinkedIn",
    "Ikuti webinar dan workshop industri",
    "Baca buku dan artikel dari para pemikir terbaik",
    "Terapkan pengetahuan dalam simulasi kasus nyata",
    "Minta mentorship dari senior yang berpengalaman",
    "Kerjakan proyek capstone yang comprehensive",
    "Dokumentasikan perjalanan belajar di blog atau portfolio",
    "Ikuti program sertifikasi untuk validasi skill",
    "Bangun side project yang solve real problem",
    "Presentasikan karya ke komunitas untuk feedback",
    "Cari peluang kerja atau kolaborasi profesional",
    "Tunjukkan growth mindset dan kemampuan adaptasi",
    "Rayakan setiap pencapaian sebagai motivasi",
    "Lanjutkan ke level selanjutnya dengan target lebih tinggi"
  ],
  [
    "Mulai dengan menentukan tujuan akhir yang jelas",
    "Buat peta jalan 6 bulan pertama",
    "Identifikasi resources yang dibutuhkan",
    "Bangun kebiasaan belajar harian",
    "Cari teman belajar atau study group",
    "Ikuti kursus online untuk memperdalam pengetahuan",
    "Praktekkan teori ke dalam proyek sederhana",
    "Minta feedback dari orang yang lebih ahli",
    "Perbaiki dan iterasi berdasarkan feedback",
    "Tantang diri dengan proyek yang lebih kompleks",
    "Bagikan hasil karya ke publik",
    "Bangun personal brand sebagai expert",
    "Cari peluang kolaborasi dengan sesama profesional",
    "Ikuti event atau seminar industri",
    "Terapkan network untuk mencari peluang",
    "Persiapkan diri untuk transisi karir",
    "Apply ke posisi impian",
    "Negosiasi dengan percaya diri",
    "Mulai karir baru dengan semangat",
    "Terus belajar dan berkembang"
  ],
  [
    "Fokus pada penguasaan skill inti",
    "Buat jadwal praktik terstruktur setiap hari",
    "Cari proyek nyata untuk mengasah kemampuan",
    "Bergabung dengan forum atau komunitas online",
    "Ikuti challenge atau kompetisi",
    "Pelajari case study dari expert",
    "Terapkan knowledge ke proyek personal",
    "Minta review dari senior",
    "Revisi dan perbaiki berdasarkan saran",
    "Dokumentasikan proses belajar",
    "Bagikan insight di blog atau sosial media",
    "Bangun network dengan praktisi lain",
    "Cari mentor yang bisa membimbing",
    "Ikuti workshop atau bootcamp",
    "Kembangkan portofolio yang kuat",
    "Siapkan CV dan LinkedIn yang profesional",
    "Cari lowongan yang sesuai",
    "Persiapkan interview dengan matang",
    "Dapatkan pekerjaan impian",
    "Terus upgrade skill dan karir"
  ],
  [
    "Tentukan goal yang spesifik dan terukur",
    "Buat timeline 12 bulan ke depan",
    "Identifikasi skill gap yang harus diisi",
    "Cari kursus atau pelatihan yang tepat",
    "Alokasikan waktu belajar setiap minggu",
    "Praktekkan ilmu di proyek nyata",
    "Cari feedback untuk improvement",
    "Iterasi dan tingkatkan kualitas",
    "Bangun portofolio yang solid",
    "Networking dengan profesional",
    "Cari kesempatan magang atau freelance",
    "Kembangkan soft skill yang dibutuhkan",
    "Ikuti webinar dan seminar",
    "Baca buku-buku inspiratif",
    "Terapkan ilmu ke bisnis atau karir",
    "Evaluasi progress setiap bulan",
    "Sesuaikan strategi jika perlu",
    "Persiapkan diri untuk step selanjutnya",
    "Ambil action dan eksekusi",
    "Rayakan kesuksesan dan tetap rendah hati"
  ],
  [
    "Mulai dengan self-assessment",
    "Tentukan area yang perlu dikembangkan",
    "Buat rencana pengembangan diri",
    "Cari mentor atau coach",
    "Ikuti program training yang sesuai",
    "Praktekkan langsung di pekerjaan",
    "Minta feedback dari atasan atau rekan",
    "Perbaiki kelemahan dan tingkatkan kekuatan",
    "Bangun reputasi di bidang ini",
    "Kembangkan network profesional",
    "Cari peluang untuk showcase kemampuan",
    "Ikuti konferensi atau seminar",
    "Baca jurnal atau artikel terkini",
    "Terapkan knowledge ke project besar",
    "Evaluasi dampak dari usaha yang dilakukan",
    "Sesuaikan goal jika diperlukan",
    "Persiapkan diri untuk promosi",
    "Ambil tanggung jawab lebih besar",
    "Kembangkan kepemimpinan",
    "Capai posisi yang diimpikan"
  ],
  [
    "Tentukan mimpi besar yang ingin dicapai",
    "Breakdown menjadi goal tahunan",
    "Buat rencana aksi harian",
    "Bangun habit positif",
    "Cari inspirasi dari role model",
    "Ikuti kursus atau sertifikasi",
    "Praktekkan 10.000 jam rule",
    "Cari feedback terus menerus",
    "Perbaiki secara incremental",
    "Bangun personal brand",
    "Network dengan para ahli",
    "Cari mentor yang tepat",
    "Ikuti program akselerasi",
    "Kerjakan proyek yang impactful",
    "Dokumentasikan perjalanan",
    "Bagikan knowledge ke orang lain",
    "Bangun bisnis atau karir yang solid",
    "Scale up dan ekspansi",
    "Jadi pemimpin di bidang ini",
    "Inspirasi orang lain"
  ],
  [
    "Mulai dengan mengetahui passion",
    "Konversi passion menjadi skill",
    "Buat roadmap pengembangan skill",
    "Cari sumber belajar yang kredibel",
    "Praktekkan setiap hari",
    "Join komunitas passion yang sama",
    "Ikuti workshop dan training",
    "Cari proyek untuk mengasah skill",
    "Minta feedback konstruktif",
    "Terus iterasi dan perbaiki",
    "Bangun portofolio yang menarik",
    "Networking dengan para profesional",
    "Cari peluang kerja di bidang passion",
    "Persiapkan diri dengan matang",
    "Apply ke posisi yang diinginkan",
    "Dapatkan pekerjaan impian",
    "Kembangkan karir lebih jauh",
    "Jadi expert di bidang ini",
    "Berbagi ilmu dengan komunitas",
    "Capai financial freedom"
  ],
  [
    "Tentukan tujuan karir jangka panjang",
    "Buat peta jalan 5 tahun",
    "Identifikasi kompetensi yang dibutuhkan",
    "Cari pelatihan dan sertifikasi",
    "Bangun jaringan profesional",
    "Cari pengalaman praktis",
    "Kerjakan proyek-proyek menantang",
    "Evaluasi dan refleksi berkala",
    "Perbaiki kelemahan diri",
    "Kembangkan keahlian khusus",
    "Bangun reputation di industri",
    "Cari opportunity untuk berkembang",
    "Ikuti perkembangan tren terkini",
    "Adaptasi dengan perubahan",
    "Tingkatkan value proposition",
    "Cari posisi strategis",
    "Ambil peran kepemimpinan",
    "Kembangkan tim dan budaya",
    "Capai peak performance",
    "Inspirasi dan mentoring orang lain"
  ]
];

// Track used versions per user (in memory)
const usedVersions = new Map<string, Set<number>>();

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

    const userId = session.id;
    const goal = user.currentGoal;

    // Get or create used versions set for this user
    if (!usedVersions.has(userId)) {
      usedVersions.set(userId, new Set<number>());
    }

    const used = usedVersions.get(userId)!;
    
    // If user has used all 10 versions, reset the pool
    if (used.size >= ROADMAP_VERSIONS.length) {
      used.clear();
    }

    // Find available versions (not yet used)
    const availableIndices = ROADMAP_VERSIONS
      .map((_, index) => index)
      .filter(index => !used.has(index));

    if (availableIndices.length === 0) {
      used.clear();
    }

    // Pick a random available version
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    let steps = ROADMAP_VERSIONS[randomIndex];
    
    // Mark as used
    used.add(randomIndex);

    // Replace goal placeholder
    steps = steps.map(step => 
      step
        .replace(/goal ini|Goal ini/g, goal)
        .replace(/goal|Goal|bidang ini|Bidang ini/g, goal)
    );

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