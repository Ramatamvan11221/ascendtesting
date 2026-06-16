import { cn } from "@/lib/utils";

export function PulseDot({ color = "green", className }: { color?: "green" | "yellow" | "red"; className?: string }) {
  const colorMap = {
    green: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]",
    yellow: "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]",
    red: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]",
  };

  return (
    <span className={cn("relative flex h-3 w-3", className)}>
      <span className={cn(
        "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
        color === "green" && "bg-green-400",
        color === "yellow" && "bg-yellow-400",
        color === "red" && "bg-red-400"
      )} />
      <span className={cn("relative inline-flex rounded-full h-3 w-3", colorMap[color])} />
    </span>
  );
}