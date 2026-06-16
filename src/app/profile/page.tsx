import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { ProfileContent } from "@/components/profile/profile-content";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      name: true, email: true, image: true, currentGoal: true,
      commitmentLevel: true, xp: true, level: true, streak: true,
      longestStreak: true, createdAt: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <AppLayout>
      <ProfileContent user={user} />
    </AppLayout>
  );
}