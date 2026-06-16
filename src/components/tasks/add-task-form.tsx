"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

export function AddTaskForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (!res.ok) throw new Error("Failed");

      setTitle("");
      toast.success("Task added!");
      router.refresh();
    } catch {
      toast.error("Failed to add task");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What do you want to achieve today?"
        className="bg-neutral-900 border-neutral-800 text-neutral-50 flex-1 h-12"
        disabled={loading}
      />
      <Button
        type="submit"
        disabled={!title.trim() || loading}
        className="bg-indigo-500 hover:bg-indigo-600 text-white h-12 px-4"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}