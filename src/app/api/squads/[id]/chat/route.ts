import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { pusher } from "@/lib/pusher";

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

    const { content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }

    // Check if user is member
    const membership = await prisma.squadMember.findUnique({
      where: {
        squadId_userId: {
          squadId: id,
          userId: session.id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Not a member" }, { status: 403 });
    }

    // Save to database
    const message = await prisma.chatMessage.create({
      data: {
        content: content.trim(),
        squadId: id,
        userId: session.id,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    // Trigger Pusher event
    await pusher.trigger(`squad-${id}`, "new-message", {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      user: {
        id: message.user.id,
        name: message.user.name,
        image: message.user.image,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const messages = await prisma.chatMessage.findMany({
      where: { squadId: id },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Chat fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}