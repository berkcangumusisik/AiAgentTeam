"use client";

import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Flag } from "lucide-react";

interface TaskCardProps {
  task: Task;
  teamName?: string;
  onClick?: () => void;
}

const statusConfig: Record<
  Task["status"],
  { label: string; className: string }
> = {
  draft: {
    label: "Taslak",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  ready: {
    label: "Hazır",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  running: {
    label: "Çalışıyor",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 animate-pulse",
  },
  completed: {
    label: "Tamamlandı",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  failed: {
    label: "Başarısız",
    className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
  cancelled: {
    label: "İptal Edildi",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
};

const priorityConfig: Record<
  Task["priority"],
  { label: string; className: string }
> = {
  low: {
    label: "Düşük",
    className: "text-gray-500",
  },
  medium: {
    label: "Orta",
    className: "text-blue-500",
  },
  high: {
    label: "Yüksek",
    className: "text-orange-500",
  },
  critical: {
    label: "Kritik",
    className: "text-red-500",
  },
};

function getStageProgress(task: Task): number {
  if (task.stages.length === 0) return 0;
  const completed = task.stages.filter(
    (s) => s.status === "completed"
  ).length;
  return Math.round((completed / task.stages.length) * 100);
}

export function TaskCard({ task, teamName, onClick }: TaskCardProps) {
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const progress = getStageProgress(task);
  const completedStages = task.stages.filter(
    (s) => s.status === "completed"
  ).length;

  return (
    <Card
      className={cn(
        "transition-colors",
        onClick && "cursor-pointer hover:border-primary/50"
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{task.title}</CardTitle>
          <Badge variant="outline" className={cn("shrink-0", status.className)}>
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {teamName && (
            <span className="truncate">{teamName}</span>
          )}
          <span className={cn("flex items-center gap-1", priority.className)}>
            <Flag className="size-3" />
            {priority.label}
          </span>
        </div>

        {task.stages.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>İlerleme</span>
              <span>
                {completedStages} / {task.stages.length} aşama
              </span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="size-3" />
          <span>
            {new Date(task.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
