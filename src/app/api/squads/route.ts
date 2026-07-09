import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, goal, description, category, icon } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Squad name is required" }, { status: 400 });
    }

    // Check if squad with same name already exists for this user
    const existing = await prisma.squad.findFirst({
      where: { 
        name: name.trim(),
        ownerId: session.id 
      },
    });

    if (existing) {
      return NextResponse.json({ 
        error: "You already have a squad with this name",
        squad: { id: existing.id }
      }, { status: 409 });
    }

    const squad = await prisma.squad.create({
      data: {
        name: name.trim(),
        goal: goal || "",
        description: description || "",
        category: category || "Umum",
        icon: icon || "🚀",
        ownerId: session.id,
        memberCount: 1,
      },
    });

    await prisma.squadMember.create({
      data: {
        squadId: squad.id,
        userId: session.id,
        role: "OWNER",
      },
    });

    return NextResponse.json({ 
      success: true, 
      squad: {
        id: squad.id,
        name: squad.name,
        goal: squad.goal,
        description: squad.description,
        category: squad.category,
        icon: squad.icon,
        memberCount: squad.memberCount,
        createdAt: squad.createdAt,
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Create squad error:", error);
    return NextResponse.json({ 
      error: "Failed to create squad" 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const squads = await prisma.squad.findMany({
      where: {
        members: {
          some: { userId: session.id }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ squads });
  } catch (error) {
    console.error("Get squads error:", error);
    return NextResponse.json({ error: "Failed to get squads" }, { status: 500 });
  }
}