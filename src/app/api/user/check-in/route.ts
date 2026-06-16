import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { lastCheckIn: true, streak: true, longestStreak: true, xp: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastCheckIn = user.lastCheckIn
      ? new Date(user.lastCheckIn.getFullYear(), user.lastCheckIn.getMonth(), user.lastCheckIn.getDate())
      : null;

    // Check if already checked in today
    if (lastCheckIn && lastCheckIn.getTime() === today.getTime()) {
      return NextResponse.json({ error: "Already checked in today", streak: user.streak });
    }

    // Calculate streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = 1;
    if (lastCheckIn && lastCheckIn.getTime() === yesterday.getTime()) {
      newStreak = user.streak + 1;
    }

    const newLongestStreak = Math.max(newStreak, user.longestStreak);

    // XP calculation: 10 base + streak bonus
    const xpGained = 10 + (newStreak > 1 ? newStreak * 2 : 0);
    const totalXp = user.xp + xpGained;

    const updated = await prisma.user.update({
      where: { id: session.id },
      data: {
        streak: newStreak,
        longestStreak: newLongestStreak,
        lastCheckIn: now,
        xp: totalXp,
        level: Math.floor(totalXp / 100) + 1,
      },
      select: {
        streak: true,
        longestStreak: true,
        xp: true,
        level: true,
        lastCheckIn: true,
      },
    });

    return NextResponse.json({
      success: true,
      streak: updated.streak,
      longestStreak: updated.longestStreak,
      xp: updated.xp,
      level: updated.level,
      xpGained,
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}