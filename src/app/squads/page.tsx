import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, Plus, ArrowRight, Star, TrendingUp, Compass, Target } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DiscoverContent } from "@/components/squads/discover-content";

export default async function SquadsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  
  const squads = await prisma.squad.findMany({
    where: { isPublic: true },
    include: {
      owner: { select: { name: true, image: true } },
      members: { select: { id: true } },
      rooms: { select: { id: true } },
    },
    orderBy: { memberCount: "desc" },
  });

  const formattedSquads = squads.map((squad) => ({
    id: squad.id,
    name: squad.name,
    icon: squad.icon,
    category: squad.category,
    description: squad.description || squad.goal,
    goal: squad.goal,
    memberCount: squad.memberCount,
    roomCount: squad.rooms.length,
    ownerName: squad.owner.name,
    createdAt: squad.createdAt.toISOString(),
  }));

  return (
    <AppLayout>
      <DiscoverContent squads={formattedSquads} />
    </AppLayout>
  );
}