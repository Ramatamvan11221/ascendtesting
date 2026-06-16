import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Hash password
  const password = await bcrypt.hash("password123", 12);

  // Create users
  const users = await Promise.all([
    prisma.user.create({ data: { name: "Rama Putra", email: "rama@ascend.com", password, currentGoal: "Masuk UGM", commitmentLevel: 9, challenges: ["Sering menunda", "Kurang motivasi"], futureSelfGoal: "Mahasiswa UGM", xp: 450, level: 5, streak: 7, longestStreak: 14 } }),
    prisma.user.create({ data: { name: "Dinda Ayu", email: "dinda@ascend.com", password, currentGoal: "Software Engineer", commitmentLevel: 8, challenges: ["Bingung mulai", "Sulit konsisten"], futureSelfGoal: "Software Engineer di Google", xp: 320, level: 4, streak: 5, longestStreak: 10 } }),
    prisma.user.create({ data: { name: "Bima Sakti", email: "bima@ascend.com", password, currentGoal: "Bangun Startup", commitmentLevel: 10, challenges: ["Overthinking", "Takut gagal"], futureSelfGoal: "Founder Startup Unicorn", xp: 600, level: 7, streak: 12, longestStreak: 20 } }),
    prisma.user.create({ data: { name: "Sari Dewi", email: "sari@ascend.com", password, currentGoal: "Dokter", commitmentLevel: 9, challenges: ["Sering menunda", "Distraksi sosmed"], futureSelfGoal: "Dokter Spesialis", xp: 280, level: 3, streak: 3, longestStreak: 8 } }),
    prisma.user.create({ data: { name: "Dimas Ardian", email: "dimas@ascend.com", password, currentGoal: "Financial Freedom", commitmentLevel: 7, challenges: ["Kurang motivasi", "Sulit konsisten"], futureSelfGoal: "Investor & Entrepreneur", xp: 500, level: 6, streak: 9, longestStreak: 15 } }),
  ]);

  // Create squads
  const squads = await Promise.all([
    prisma.squad.create({ data: { name: "Pejuang PTN 2026", description: "Squad untuk yang berjuang masuk PTN impian. Belajar bareng, tryout bareng, lolos bareng!", goal: "Lolos SNBT masuk PTN impian", category: "Akademik", icon: "🎓", ownerId: users[0].id, memberCount: 3 } }),
    prisma.squad.create({ data: { name: "Code Warriors", description: "Belajar coding dari nol sampai jago. Sharing resource, project bareng, dan persiapan karir tech.", goal: "Menjadi Software Engineer profesional", category: "Teknologi", icon: "💻", ownerId: users[1].id, memberCount: 3 } }),
    prisma.squad.create({ data: { name: "Startup Builder", description: "Dari ide sampai launch. Diskusi ide bisnis, validasi, MVP, dan pitching.", goal: "Membangun startup yang profitable", category: "Startup", icon: "🚀", ownerId: users[2].id, memberCount: 2 } }),
    prisma.squad.create({ data: { name: "Bahasa Jepang Lovers", description: "Nonton anime tanpa subtitle? Bisa! Belajar N5-N1 bareng.", goal: "Fasih bahasa Jepang level N2", category: "Bahasa", icon: "🇯🇵", ownerId: users[3].id, memberCount: 2 } }),
  ]);

  // Add squad members
  await Promise.all([
    prisma.squadMember.create({ data: { squadId: squads[0].id, userId: users[0].id, role: "OWNER" } }),
    prisma.squadMember.create({ data: { squadId: squads[0].id, userId: users[1].id, role: "MEMBER" } }),
    prisma.squadMember.create({ data: { squadId: squads[0].id, userId: users[3].id, role: "MEMBER" } }),
    prisma.squadMember.create({ data: { squadId: squads[1].id, userId: users[1].id, role: "OWNER" } }),
    prisma.squadMember.create({ data: { squadId: squads[1].id, userId: users[0].id, role: "MEMBER" } }),
    prisma.squadMember.create({ data: { squadId: squads[1].id, userId: users[2].id, role: "MEMBER" } }),
    prisma.squadMember.create({ data: { squadId: squads[2].id, userId: users[2].id, role: "OWNER" } }),
    prisma.squadMember.create({ data: { squadId: squads[2].id, userId: users[4].id, role: "MEMBER" } }),
    prisma.squadMember.create({ data: { squadId: squads[3].id, userId: users[3].id, role: "OWNER" } }),
    prisma.squadMember.create({ data: { squadId: squads[3].id, userId: users[1].id, role: "MEMBER" } }),
  ]);

  // Create rooms
  const rooms = await Promise.all([
    prisma.room.create({ data: { name: "general-chat", type: "CHAT", squadId: squads[0].id, order: 0 } }),
    prisma.room.create({ data: { name: "study-room", type: "STUDY", squadId: squads[0].id, order: 1 } }),
    prisma.room.create({ data: { name: "diskusi-coding", type: "CHAT", squadId: squads[1].id, order: 0 } }),
    prisma.room.create({ data: { name: "pair-programming", type: "STUDY", squadId: squads[1].id, order: 1 } }),
    prisma.room.create({ data: { name: "ide-bisnis", type: "CHAT", squadId: squads[2].id, order: 0 } }),
    prisma.room.create({ data: { name: "nihongo-kaiwa", type: "CHAT", squadId: squads[3].id, order: 0 } }),
  ]);

  // Create tasks
  await Promise.all([
    prisma.task.create({ data: { title: "Kerjakan 10 soal Matematika", userId: users[0].id } }),
    prisma.task.create({ data: { title: "Review materi Biologi", userId: users[0].id, isCompleted: true } }),
    prisma.task.create({ data: { title: "Baca 1 chapter Clean Code", userId: users[1].id } }),
    prisma.task.create({ data: { title: "Selesaikan LeetCode harian", userId: users[1].id, isCompleted: true } }),
    prisma.task.create({ data: { title: "Validasi 3 ide bisnis", userId: users[2].id } }),
  ]);

  // Create squad tasks
  await Promise.all([
    prisma.squadTask.create({ data: { title: "Tryout mingguan", squadId: squads[0].id } }),
    prisma.squadTask.create({ data: { title: "Bahas soal sulit bareng", squadId: squads[0].id, isCompleted: true } }),
    prisma.squadTask.create({ data: { title: "Code review session", squadId: squads[1].id } }),
    prisma.squadTask.create({ data: { title: "Presentasi ide pitch", squadId: squads[2].id } }),
  ]);

  // Create roadmap nodes
  await Promise.all([
    prisma.roadmapNode.create({ data: { title: "Kuasai materi dasar SNBT", order: 1, userId: users[0].id, isCompleted: true } }),
    prisma.roadmapNode.create({ data: { title: "Ikuti tryout setiap minggu", order: 2, userId: users[0].id, isCompleted: true } }),
    prisma.roadmapNode.create({ data: { title: "Analisis kelemahan per mapel", order: 3, userId: users[0].id } }),
    prisma.roadmapNode.create({ data: { title: "Pelajari HTML & CSS dasar", order: 1, userId: users[1].id, isCompleted: true } }),
    prisma.roadmapNode.create({ data: { title: "Kuasai JavaScript", order: 2, userId: users[1].id, isCompleted: true } }),
    prisma.roadmapNode.create({ data: { title: "Belajar React & Next.js", order: 3, userId: users[1].id } }),
    prisma.roadmapNode.create({ data: { title: "Buat portfolio project", order: 4, userId: users[1].id } }),
  ]);

  // Create future self
  await Promise.all([
    prisma.futureSelf.create({ data: { userId: users[0].id, goal: "Mahasiswa UGM", content: JSON.stringify({ letter: "Hai, aku dari masa depan. Semua begadang dan tryout yang kamu lakukan terbayar sudah. Kamu diterima di UGM, jurusan impianmu. Aku bangga padamu. Teruslah berjuang.", steps: ["Kuasai materi dasar semua mapel", "Ikuti tryout rutin tiap minggu", "Analisis dan perbaiki kelemahan", "Jaga kesehatan dan mental", "Doa dan tawakal"] }) } }),
    prisma.futureSelf.create({ data: { userId: users[1].id, goal: "Software Engineer di Google", content: JSON.stringify({ letter: "Kamu berhasil! Sekarang kamu Software Engineer di tech company top. Semua malam belajar coding, project yang gagal, dan rasa frustrasi—semuanya worth it. Aku menunggumu di sini.", steps: ["Kuasai fundamental programming", "Bangun 5+ project nyata", "Kontribusi ke open source", "Apply dan interview practice", "Negosiasi offer dengan percaya diri"] }) } }),
  ]);

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });