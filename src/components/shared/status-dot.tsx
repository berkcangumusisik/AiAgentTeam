import { cn } from "@/lib/utils";

type StatusType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "idle"
  | "running"
  | "pending";

interface StatusDotProps {
  status: StatusType;
  pulse?: boolean;
  className?: string;
}

const statusColorMap: Record<StatusType, string> = {
  success: "bg-emerald-500",
  error: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
  idle: "bg-gray-400",
  running: "bg-emerald-500",
  pending: "bg-amber-500",
};

export function StatusDot({ status, pulse = false, className }: StatusDotProps) {
  return (
    <span className={cn("relative inline-flex", className)}>
      {pulse && (
        <span
          className={cn(
            "absolute inline-flex size-full animate-ping rounded-full opacity-75",
            statusColorMap[status]
          )}
        />
      )}
      <span
        className={cn(
          "relative inline-flex size-2 rounded-full",
          statusColorMap[status]
        )}
      />
    </span>
  );
}
