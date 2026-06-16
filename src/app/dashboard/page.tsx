import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Target, Plus, ArrowRight, Compass, Map, Sparkles, CheckSquare, Zap, Flame, Star, TrendingUp } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { CheckInButton } from "@/components/gamification/check-in-button";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      memberships: {
        include: {
          squad: { select: { id: true, name: true, icon: true, memberCount: true, goal: true } },
        },
      },
    },
  });

  if (!user) redirect("/login");

  const mySquads = user.memberships.map((m) => m.squad);
  const roadmapCount = await prisma.roadmapNode.count({ where: { userId: session.id } });
  const futureSelf = await prisma.futureSelf.findUnique({ where: { userId: session.id } });
  const taskCount = await prisma.task.count({ where: { userId: session.id } });
  const completedTaskCount = await prisma.task.count({ where: { userId: session.id, isCompleted: true } });

  return (
    <AppLayout>
      <DashboardContent
        userName={user.name || "Dreamer"}
        currentGoal={user.currentGoal || ""}
        commitmentLevel={user.commitmentLevel}
        streak={user.streak}
        longestStreak={user.longestStreak}
        xp={user.xp}
        level={user.level}
        lastCheckIn={user.lastCheckIn?.toISOString() || null}
        roadmapCount={roadmapCount}
        hasFutureSelf={!!futureSelf}
        taskCount={taskCount}
        completedTaskCount={completedTaskCount}
        mySquads={mySquads}
      />
    </AppLayout>
  );
}