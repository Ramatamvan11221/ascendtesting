import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if already a member
    const existing = await prisma.squadMember.findUnique({
      where: {
        squadId_userId: {
          squadId: id,
          userId: session.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Already a member" }, { status: 400 });
    }

    // Join squad
    await prisma.squadMember.create({
      data: {
        squadId: id,
        userId: session.id,
        role: "MEMBER",
      },
    });

    // Update member count
    await prisma.squad.update({
      where: { id },
      data: { memberCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Join squad error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}