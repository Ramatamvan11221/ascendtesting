import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rooms = await prisma.room.findMany({
      where: { squadId: id },
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { roomMessages: true },
        },
      },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Fetch rooms error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if owner
    const squad = await prisma.squad.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!squad || squad.ownerId !== session.id) {
      return NextResponse.json({ error: "Only owner can create rooms" }, { status: 403 });
    }

    const { name, type } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: "Room name is required" }, { status: 400 });
    }

    const roomCount = await prisma.room.count({ where: { squadId: id } });

    const room = await prisma.room.create({
      data: {
        name: name.trim(),
        type: type || "CHAT",
        squadId: id,
        order: roomCount,
      },
    });

    return NextResponse.json({ success: true, room });
  } catch (error) {
    console.error("Create room error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}