import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const members = await prisma.squadMember.findMany({
      where: { squadId: id },
      include: { user: { select: { name: true } } },
      orderBy: { joinedAt: "desc" },
      take: 30,
    });

    const notifications = members.map((m) => ({
      id: m.id,
      text: `${m.user.name} joined the squad`,
      time: new Date(m.joinedAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    return NextResponse.json(notifications);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}