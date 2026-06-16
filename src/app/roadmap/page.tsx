import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { RoadmapView } from "@/components/roadmap/roadmap-view";

export default async function RoadmapPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { currentGoal: true },
  });

  const nodes = await prisma.roadmapNode.findMany({
    where: { userId: session.id },
    orderBy: { order: "asc" },
  });

  return (
    <AppLayout>
      <RoadmapView nodes={nodes} goal={user?.currentGoal || ""} />
    </AppLayout>
  );
}