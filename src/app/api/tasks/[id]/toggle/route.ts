import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params untuk Next.js 15+
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const task = await prisma.task.findUnique({
      where: { id: id },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (task.userId !== session.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.task.update({
      where: { id: id },
      data: { isCompleted: !task.isCompleted },
    });

    return NextResponse.json({
      task: {
        id: updated.id,
        title: updated.title,
        isCompleted: updated.isCompleted,
        createdAt: updated.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Toggle task error:", error);
    return NextResponse.json(
      { error: "Failed to toggle task" },
      { status: 500 }
    );
  }
}