import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { DailyQuest } from "@/components/tasks/daily-quest";

// Helper: Get today's date in WIB (UTC+7) menggunakan Intl
function getTodayWIB(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(now);
  const year = parts.find(p => p.type === 'year')?.value || '';
  const month = parts.find(p => p.type === 'month')?.value || '';
  const day = parts.find(p => p.type === 'day')?.value || '';
  return `${year}-${month}-${day}`;
}

// Helper: Convert any date to WIB date string
function toWIBDate(dateStr: string): string {
  const date = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find(p => p.type === 'year')?.value || '';
  const month = parts.find(p => p.type === 'month')?.value || '';
  const day = parts.find(p => p.type === 'day')?.value || '';
  return `${year}-${month}-${day}`;
}

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

  // Get today in WIB
  const todayStr = getTodayWIB();

  console.log("Today WIB (Intl):", todayStr);
  console.log("Total tasks:", formattedTasks.length);

  // Group tasks by date (WIB)
  const tasksByDate: Record<string, typeof formattedTasks> = {};
  formattedTasks.forEach((task) => {
    const dateStr = toWIBDate(task.createdAt);
    if (!tasksByDate[dateStr]) tasksByDate[dateStr] = [];
    tasksByDate[dateStr].push(task);
  });

  console.log("Dates with tasks:", Object.keys(tasksByDate).sort());

  // Get all dates that have tasks
  const allDatesWithTasks = Object.keys(tasksByDate).sort();

  // Get last 7 days including today (WIB)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    // Konversi ke WIB pake Intl
    const formatter = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.formatToParts(d);
    const year = parts.find(p => p.type === 'year')?.value || '';
    const month = parts.find(p => p.type === 'month')?.value || '';
    const day = parts.find(p => p.type === 'day')?.value || '';
    const ds = `${year}-${month}-${day}`;
    
    const dayTasks = tasksByDate[ds] || [];
    const completed = dayTasks.filter((t) => t.isCompleted).length;
    const total = dayTasks.length;
    return {
      date: ds,
      dayName: d.toLocaleDateString("id-ID", { weekday: "short", timeZone: "Asia/Jakarta" }),
      dayNumber: parseInt(day),
      completed,
      total,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }).reverse();

  // Add other dates that have tasks but not in last 7 days
  const allDates = [...last7Days];
  allDatesWithTasks.forEach((dateStr) => {
    const exists = last7Days.some((d) => d.date === dateStr);
    if (!exists) {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      const dayTasks = tasksByDate[dateStr] || [];
      const completed = dayTasks.filter((t) => t.isCompleted).length;
      const total = dayTasks.length;
      allDates.push({
        date: dateStr,
        dayName: d.toLocaleDateString("id-ID", { weekday: "short", timeZone: "Asia/Jakarta" }),
        dayNumber: day,
        completed,
        total,
        progress: total > 0 ? Math.round((completed / total) * 100) : 0,
      });
    }
  });

  // Sort by date (oldest to newest)
  allDates.sort((a, b) => a.date.localeCompare(b.date));

  console.log("Calendar dates:", allDates.map(d => ({ date: d.date, total: d.total })));

  return (
    <AppLayout>
      <DailyQuest
        key={todayStr}
        tasks={formattedTasks}
        calendarDays={allDates}
        todayStr={todayStr}
      />
    </AppLayout>
  );
}