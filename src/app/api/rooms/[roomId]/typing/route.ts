import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { pusher } from "@/lib/pusher";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await pusher.trigger(`room-${roomId}`, "user-typing", {
      userId: session.id,
      userName: session.name || "Someone",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}