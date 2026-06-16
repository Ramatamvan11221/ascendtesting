import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; userId: string }> }) {
  const { id, userId } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const squad = await prisma.squad.findUnique({ where: { id }, select: { ownerId: true } });
  const member = await prisma.squadMember.findUnique({ where: { squadId_userId: { squadId: id, userId: session.id } } });

  if (!squad || squad.ownerId !== session.id) {
    if (!member || member.role !== "MODERATOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  await prisma.squadMember.deleteMany({ where: { squadId: id, userId } });
  await prisma.squad.update({ where: { id }, data: { memberCount: { decrement: 1 } } });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string; userId: string }> }) {
  const { id, userId } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const squad = await prisma.squad.findUnique({ where: { id }, select: { ownerId: true } });
  if (!squad || squad.ownerId !== session.id) return NextResponse.json({ error: "Only owner" }, { status: 403 });

  const { role } = await req.json();
  await prisma.squadMember.update({ where: { squadId_userId: { squadId: id, userId } }, data: { role } });
  return NextResponse.json({ success: true });
}