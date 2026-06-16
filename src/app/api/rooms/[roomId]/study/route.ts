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

    const sessions = await prisma.studySession.findMany({
      where: { roomId, status: "STUDYING" },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { startTime: "desc" },
    });

    const participants = sessions.map((s) => ({
      userId: s.userId,
      userName: s.user.name,
      mode: "FOCUS",
      note: "",
      duration: Math.floor((Date.now() - s.startTime.getTime()) / 1000),
    }));

    return NextResponse.json(participants);
  } catch (error) {
    console.error("Study GET error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { action } = await req.json();

    if (action === "start") {
      // Delete old sessions for this user in this room
      await prisma.studySession.deleteMany({
        where: { roomId, userId: session.id, status: "STUDYING" },
      });

      // Create new session
      const newSession = await prisma.studySession.create({
        data: {
          roomId,
          userId: session.id,
          status: "STUDYING",
          startTime: new Date(),
        },
        include: { user: { select: { id: true, name: true, image: true } } },
      });

      await pusher.trigger(`study-${roomId}`, "user-joined", {
        userId: session.id,
        userName: session.name || "Unknown",
        mode: "FOCUS",
        note: "",
        duration: 0,
      });

      return NextResponse.json({ success: true, session: newSession });
    }

    if (action === "stop") {
      const activeSession = await prisma.studySession.findFirst({
        where: { roomId, userId: session.id, status: "STUDYING" },
        orderBy: { startTime: "desc" },
      });

      if (activeSession) {
        const endTime = new Date();
        const duration = Math.floor((endTime.getTime() - activeSession.startTime.getTime()) / 1000);

        await prisma.studySession.update({
          where: { id: activeSession.id },
          data: { status: "COMPLETED", endTime, duration },
        });
      }

      await pusher.trigger(`study-${roomId}`, "user-left", { userId: session.id });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Study POST error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}