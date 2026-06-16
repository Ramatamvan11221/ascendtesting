import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string; taskId: string }> }) {
  try {
    const { id, taskId } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const task = await prisma.squadTask.findUnique({ where: { id: taskId } });
    if (!task || task.squadId !== id) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.squadTask.update({ where: { id: taskId }, data: { isCompleted: !task.isCompleted } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}