import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { pusher } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.text();
    const params = new URLSearchParams(body);
    const socketId = params.get("socket_id") || "";
    const channelName = params.get("channel_name") || "";

    // Only allow subscription to squad channels
    if (!channelName.startsWith("presence-squad-") && !channelName.startsWith("squad-")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const auth = pusher.authorizeChannel(socketId, channelName, {
      user_id: session.id,
      user_info: {
        name: session.name,
      },
    });

    return NextResponse.json(auth);
  } catch (error) {
    console.error("Pusher auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}