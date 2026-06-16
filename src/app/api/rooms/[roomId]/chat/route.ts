import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { pusher } from "@/lib/pusher";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const messages = await prisma.roomMessage.findMany({
      where: { roomId },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "asc" },
      take: 50,
    });
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const { roomId } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { content, type, fileUrl, fileName, fileSize } = await req.json();
    if (!content?.trim() && !fileUrl) return NextResponse.json({ error: "Empty" }, { status: 400 });

    const msg = await prisma.roomMessage.create({
      data: { content: content?.trim() || "", roomId, userId: session.id },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    await pusher.trigger(`room-${roomId}`, "new-message", {
      id: msg.id, content: msg.content, type: type || "text",
      fileUrl: fileUrl || null, fileName: fileName || null, fileSize: fileSize || null,
      createdAt: msg.createdAt.toISOString(), user: msg.user,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}