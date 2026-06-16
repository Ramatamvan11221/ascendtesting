"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: Date | string;
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleToggle = async (taskId: string) => {
    setTogglingId(taskId);
    try {
      const res = await fetch(`/api/tasks/${taskId}/toggle`, { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } catch {
      toast.error("Failed to update task");
    }
    setTogglingId(null);
  };

  const handleDelete = async (taskId: string) => {
    setDeletingId(taskId);
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Task deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete task");
    }
    setDeletingId(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">📝</div>
        <p className="text-neutral-500">No tasks yet. Add your first quest!</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${
            task.isCompleted
              ? "border-neutral-800 bg-neutral-900/30 opacity-60"
              : "border-neutral-800 bg-neutral-950/50 hover:border-neutral-700"
          }`}
        >
          <button
            onClick={() => handleToggle(task.id)}
            disabled={togglingId === task.id}
            className="shrink-0"
          >
            {togglingId === task.id ? (
              <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
            ) : (
              <Checkbox
                checked={task.isCompleted}
                className="h-5 w-5 border-neutral-600 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
              />
            )}
          </button>
          <span
            className={`flex-1 text-sm ${
              task.isCompleted
                ? "text-neutral-600 line-through"
                : "text-neutral-200"
            }`}
          >
            {task.title}
          </span>
          <Button
            onClick={() => handleDelete(task.id)}
            disabled={deletingId === task.id}
            size="sm"
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-400 transition-all"
          >
            {deletingId === task.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}