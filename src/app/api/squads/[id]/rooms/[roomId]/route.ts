import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; roomId: string }> }
) {
  try {
    const { id: squadId, roomId } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const squad = await prisma.squad.findUnique({ where: { id: squadId }, select: { ownerId: true } });
    if (!squad || squad.ownerId !== session.id) {
      return NextResponse.json({ error: "Only owner can delete rooms" }, { status: 403 });
    }

    await prisma.room.delete({ where: { id: roomId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}