import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { pusher } from "@/lib/pusher";

export async function POST(req: Request, { params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { note } = await req.json();
  await pusher.trigger(`study-${roomId}`, "note-changed", { userId: session.id, note });
  return NextResponse.json({ success: true });
}