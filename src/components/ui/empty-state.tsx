import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="mb-4 text-neutral-700">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-neutral-400 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-600 max-w-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}