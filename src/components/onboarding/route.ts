import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, goal, commitment, challenges, futureSelf } = await req.json();

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || session.user.name,
        currentGoal: goal,
        commitmentLevel: commitment,
        challenges: challenges || [],
        futureSelfGoal: futureSelf,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}