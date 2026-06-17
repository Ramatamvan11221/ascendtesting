import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const squad = await prisma.squad.findUnique({ where: { id }, select: { ownerId: true } });
    if (!squad || squad.ownerId !== session.id) {
      return NextResponse.json({ error: "Only owner can delete" }, { status: 403 });
    }

    await prisma.squad.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete squad" }, { status: 500 });
  }
}