import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { DailyQuest } from "@/components/tasks/daily-quest";

export default async function TasksPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const tasks = await prisma.task.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
  });

  const formattedTasks = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    isCompleted: t.isCompleted,
    createdAt: t.createdAt.toISOString(),
  }));

  // FIX: Gunakan timezone Indonesia (UTC+7)
  const now = new Date();
  // Convert ke UTC+7 (WIB)
  const offset = 7 * 60; // 7 hours in minutes
  const localDate = new Date(now.getTime() + offset * 60 * 1000);
  const todayStr = localDate.toISOString().split("T")[0];
  
  console.log("Today string (fixed):", todayStr); // Harusnya 2026-06-16

  const tasksByDate: Record<string, typeof formattedTasks> = {};
  formattedTasks.forEach((task) => {
    // Fix: Convert task date ke UTC+7 juga
    const taskDate = new Date(task.createdAt);
    const taskLocalDate = new Date(taskDate.getTime() + offset * 60 * 1000);
    const dateStr = taskLocalDate.toISOString().split("T")[0];
    
    if (!tasksByDate[dateStr]) tasksByDate[dateStr] = [];
    tasksByDate[dateStr].push(task);
  });

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    // Fix: Convert ke UTC+7
    const dLocal = new Date(d.getTime() + offset * 60 * 1000);
    const ds = dLocal.toISOString().split("T")[0];
    
    const dayTasks = tasksByDate[ds] || [];
    const completed = dayTasks.filter((t) => t.isCompleted).length;
    const total = dayTasks.length;
    return {
      date: ds,
      dayName: d.toLocaleDateString("id-ID", { weekday: "short", timeZone: "Asia/Jakarta" }),
      dayNumber: d.getDate(),
      completed,
      total,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }).reverse();

  return (
    <AppLayout>
      <DailyQuest
        key={todayStr}
        tasks={formattedTasks}
        last7Days={last7Days}
        todayStr={todayStr}
      />
    </AppLayout>
  );
}