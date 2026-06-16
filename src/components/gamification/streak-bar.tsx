import { Flame } from "lucide-react";

export function StreakBar({ streak, longestStreak }: { streak: number; longestStreak: number }) {
  const milestones = [7, 14, 30, 60, 100];
  const nextMilestone = milestones.find((m) => m > streak) || 100;
  const progress = Math.min((streak / nextMilestone) * 100, 100);

  return (
    <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-400" />
          <span className="text-sm font-medium text-neutral-200">{streak} Day Streak</span>
        </div>
        <span className="text-xs text-neutral-500">
          Next milestone: {nextMilestone} days 🔥
        </span>
      </div>
      <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-orange-500 to-red-500 transition-all duration-700 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs text-neutral-600">0</span>
        <span className="text-xs text-neutral-600">{nextMilestone}</span>
      </div>
      {streak >= 7 && (
        <p className="text-xs text-green-400 mt-2 text-center">
          🎉 You&apos;re on fire! Keep going!
        </p>
      )}
    </div>
  );
}