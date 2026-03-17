"use client";

import type { TaskStage } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Circle,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

interface TaskPipelineProps {
  stages: TaskStage[];
  agents: Record<string, string>;
}

function StageStatusIcon({ status }: { status: TaskStage["status"] }) {
  switch (status) {
    case "running":
      return (
        <Loader2 className="size-5 animate-spin text-yellow-500" />
      );
    case "completed":
      return <CheckCircle2 className="size-5 text-green-500" />;
    case "failed":
      return <XCircle className="size-5 text-red-500" />;
    default:
      return <Circle className="size-5 text-muted-foreground" />;
  }
}

function statusBorderClass(status: TaskStage["status"]): string {
  switch (status) {
    case "running":
      return "border-yellow-500";
    case "completed":
      return "border-green-500";
    case "failed":
      return "border-red-500";
    default:
      return "border-muted";
  }
}

function connectorColorClass(status: TaskStage["status"]): string {
  switch (status) {
    case "completed":
      return "text-green-500";
    default:
      return "text-muted-foreground/40";
  }
}

export function TaskPipeline({ stages, agents }: TaskPipelineProps) {
  const sortedStages = [...stages].sort((a, b) => a.order - b.order);

  if (sortedStages.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Bu görev için yapılandırılmış aşama yok.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-start gap-2">
      {sortedStages.map((stage, index) => (
        <div key={stage.id} className="flex items-center gap-2">
          <div
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border-2 bg-card p-3 text-center min-w-[140px] max-w-[180px]",
              statusBorderClass(stage.status)
            )}
          >
            <StageStatusIcon status={stage.status} />
            <div className="space-y-0.5">
              <p className="text-sm font-medium leading-tight">
                {stage.name}
              </p>
              {agents[stage.agentId] && (
                <p className="text-xs text-muted-foreground truncate max-w-full">
                  {agents[stage.agentId]}
                </p>
              )}
            </div>
            {stage.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {stage.description}
              </p>
            )}
          </div>
          {index < sortedStages.length - 1 && (
            <ArrowRight
              className={cn("size-5 shrink-0", connectorColorClass(stage.status))}
            />
          )}
        </div>
      ))}
    </div>
  );
}
