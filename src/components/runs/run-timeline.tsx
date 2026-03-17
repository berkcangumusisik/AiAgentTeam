"use client";

import { useEffect, useRef } from "react";
import {
  Brain,
  MessageSquare,
  Wrench,
  Terminal,
  AlertCircle,
  Play,
  CheckCircle,
  Square,
  Info,
  AlertTriangle,
  FileText,
  DollarSign,
  CornerDownRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RunEvent, RunEventType } from "@/lib/types";

interface RunTimelineProps {
  events: RunEvent[];
}

interface EventStyle {
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const eventStyleMap: Record<string, EventStyle> = {
  "run:started": {
    icon: Play,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  "run:completed": {
    icon: CheckCircle,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  "run:failed": {
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  "run:stopped": {
    icon: Square,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
  },
  "stage:started": {
    icon: Play,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  "stage:completed": {
    icon: CheckCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  "stage:failed": {
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  "agent:thinking": {
    icon: Brain,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  "agent:response": {
    icon: MessageSquare,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  "agent:tool-call": {
    icon: Wrench,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  "agent:tool-result": {
    icon: CornerDownRight,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  "agent:error": {
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  "agent:done": {
    icon: CheckCircle,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  "terminal:output": {
    icon: Terminal,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  "file:changed": {
    icon: FileText,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  "cost:updated": {
    icon: DollarSign,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  "log:info": {
    icon: Info,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  "log:warn": {
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  "log:error": {
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
};

function getEventStyle(type: RunEventType): EventStyle {
  return (
    eventStyleMap[type] ?? {
      icon: Info,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    }
  );
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function RunTimeline({ events }: RunTimelineProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events.length]);

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
        Olaylar bekleniyor...
      </div>
    );
  }

  return (
    <div className="relative space-y-0">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

      {events.map((event, index) => {
        const style = getEventStyle(event.type);
        const Icon = style.icon;
        const isLast = index === events.length - 1;

        return (
          <div
            key={event.id}
            className={cn(
              "relative flex gap-3 py-2 pl-0 pr-2",
              isLast && "animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full",
                style.bgColor
              )}
            >
              <Icon className={cn("size-4", style.color)} />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1 pt-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">
                  {formatTimestamp(event.timestamp)}
                </span>
                {event.agentName && (
                  <span className="text-xs font-medium text-foreground/80">
                    {event.agentName}
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {event.message}
              </p>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}
