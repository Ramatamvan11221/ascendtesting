import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { pusher } from "@/lib/pusher";

export async function POST(req: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const { roomId } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { messageIds } = await req.json();
    if (!messageIds?.length) return NextResponse.json({ error: "No IDs" }, { status: 400 });

    // Only delete own messages
    const deleted = await prisma.roomMessage.updateMany({
      where: { id: { in: messageIds }, userId: session.id },
      data: { content: "This message was deleted" },
    });

    // Broadcast deletion
    for (const id of messageIds) {
      await pusher.trigger(`room-${roomId}`, "message-deleted", { messageId: id });
    }

    return NextResponse.json({ success: true, count: deleted.count });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}