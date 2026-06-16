import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { SquadHub } from "@/components/squads/squad-hub";

export default async function RoomPage({ params }: { params: Promise<{ id: string; roomId: string }> }) {
  const { id: squadId, roomId } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const squad = await prisma.squad.findUnique({
    where: { id: squadId },
    include: {
      members: { include: { user: { select: { id: true, name: true, image: true, currentGoal: true, streak: true } } } },
      rooms: { orderBy: { order: "asc" } },
    },
  });

  if (!squad) notFound();

  const room = squad.rooms.find((r) => r.id === roomId);
  if (!room) {
    if (squad.rooms.length > 0) redirect(`/squads/${squadId}/rooms/${squad.rooms[0].id}`);
    redirect(`/squads/${squadId}`);
  }

  const isMember = squad.members.some((m) => m.userId === session.id);
  if (!isMember) redirect(`/squads/${squadId}`);

  const isOwner = squad.members.some((m) => m.userId === session.id && m.role === "OWNER");
  const memberRole = squad.members.find((m) => m.userId === session.id)?.role || null;
  const isModerator = memberRole === "MODERATOR";

  return (
    <AppLayout>
      <SquadHub
        squadId={squad.id}
        squadName={squad.name}
        squadIcon={squad.icon}
        squadGoal={squad.goal}
        squadCategory={squad.category}
        squadDescription={squad.description || ""}
        memberCount={squad.memberCount}
        createdAt={squad.createdAt.toISOString()}
        ownerName={squad.owner?.name || "Unknown"}
        isMember={isMember}
        isOwner={isOwner}
        isModerator={isModerator}
        currentUserId={session.id}
        currentUserName={session.name || "You"}
        rooms={squad.rooms.map((r) => ({ id: r.id, name: r.name, type: r.type, order: r.order }))}
        members={squad.members.map((m) => ({
          id: m.user.id, name: m.user.name, image: m.user.image,
          currentGoal: m.user.currentGoal, streak: m.user.streak, role: m.role,
        }))}
        activeRoomId={room.id}
        activeView={room.type === "CHAT" ? "chat" : "study"}
      />
    </AppLayout>
  );
}