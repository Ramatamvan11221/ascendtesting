import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { SquadHub } from "@/components/squads/squad-hub";
import { SquadLanding } from "@/components/squads/squads-landing";

export default async function SquadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();

  const squad = await prisma.squad.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, image: true } },
      members: { include: { user: { select: { id: true, name: true, image: true, currentGoal: true, streak: true } } } },
      rooms: { orderBy: { order: "asc" } },
    },
  });

  if (!squad) notFound();

  const isMember = session ? squad.members.some((m) => m.userId === session.id) : false;
  const isOwner = session ? squad.ownerId === session.id : false;
  const memberRole = session ? squad.members.find((m) => m.userId === session.id)?.role || null : null;
  const isModerator = memberRole === "MODERATOR";

  // KALO MEMBER DAN PUNYA ROOM → redirect ke room pertama
  if (isMember && squad.rooms.length > 0) {
    redirect(`/squads/${id}/rooms/${squad.rooms[0].id}`);
  }

  // KALO MEMBER DAN TIDAK PUNYA ROOM → tampilkan SquadHub dengan popup create room
  if (isMember && squad.rooms.length === 0) {
    return (
      <AppLayout>
        <SquadHub
          squadId={squad.id}
          squadName={squad.name}
          squadIcon={squad.icon || "🚀"}
          squadGoal={squad.goal || ""}
          squadCategory={squad.category || "Umum"}
          squadDescription={squad.description || ""}
          memberCount={squad.memberCount}
          createdAt={squad.createdAt.toISOString()}
          ownerName={squad.owner.name}
          isMember={true}
          isOwner={isOwner}
          isModerator={isModerator}
          currentUserId={session?.id || ""}
          currentUserName={session?.name || "You"}
          rooms={squad.rooms.map((r) => ({ id: r.id, name: r.name, type: r.type, order: r.order }))}
          members={squad.members.map((m) => ({
            id: m.user.id,
            name: m.user.name || "Anonymous",
            image: m.user.image,
            currentGoal: m.user.currentGoal,
            streak: m.user.streak || 0,
            role: m.role,
          }))}
          isNewSquad={true}  // ← FLAG: squad baru, belum punya room
        />
      </AppLayout>
    );
  }

  // KALO BUKAN MEMBER → tampilkan SquadLanding
  return (
    <AppLayout>
      <SquadLanding
        squadId={squad.id}
        squadName={squad.name}
        squadIcon={squad.icon || "🚀"}
        squadCategory={squad.category || "Umum"}
        squadGoal={squad.goal || ""}
        squadDescription={squad.description || ""}
        memberCount={squad.memberCount}
        roomCount={squad.rooms.length}
        ownerName={squad.owner.name}
        isLoggedIn={!!session}
      />
    </AppLayout>
  );
}