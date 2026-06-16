import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, goal, commitment, challenges, futureSelf } = await req.json();

    await prisma.user.update({
      where: { id: session.id },
      data: {
        name: name || session.name,
        currentGoal: goal,
        commitmentLevel: commitment,
        challenges: challenges || [],
        futureSelfGoal: futureSelf,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}