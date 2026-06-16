import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const node = await prisma.roadmapNode.findUnique({ where: { id } });
    if (!node || node.userId !== session.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.roadmapNode.update({
      where: { id },
      data: { isCompleted: !node.isCompleted },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Toggle roadmap error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}