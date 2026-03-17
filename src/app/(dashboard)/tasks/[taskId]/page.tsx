"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Play,
  Trash2,
  ArrowLeft,
  Flag,
  Users,
  FolderOpen,
  Calendar,
} from "lucide-react";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTasks } from "@/lib/hooks/use-tasks";
import { useTeams } from "@/lib/hooks/use-teams";
import { useAgents } from "@/lib/hooks/use-agents";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TaskPipeline } from "@/components/tasks/task-pipeline";

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
  low: { label: "Düşük", className: "text-gray-500" },
  medium: { label: "Orta", className: "text-blue-500" },
  high: { label: "Yüksek", className: "text-orange-500" },
  critical: { label: "Kritik", className: "text-red-500" },
};

export default function TaskDetailPage() {
  const params = useParams<{ taskId: string }>();
  const router = useRouter();
  const { tasks, loading, getTaskById, executeTask, deleteTask, refetch } =
    useTasks();
  const { getTeamById } = useTeams();
  const { allAgents } = useAgents();
  const [executing, setExecuting] = useState(false);

  const task = getTaskById(params.taskId);
  const team = task ? getTeamById(task.teamId) : undefined;

  // Build agent name lookup for pipeline
  const agentNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const agent of allAgents) {
      map[agent.id] = agent.name;
    }
    return map;
  }, [allAgents]);

  useEffect(() => {
    if (!loading && tasks.length === 0) {
      refetch();
    }
  }, [loading, tasks.length, refetch]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="space-y-6">
        <PageHeader title="Görev Bulunamadı" />
        <p className="text-sm text-muted-foreground">
          Aradığınız görev mevcut değil veya silinmiş.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/tasks")}
        >
          <ArrowLeft className="size-4" />
          Görevlere Dön
        </Button>
      </div>
    );
  }

  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const canExecute = task.status === "draft" || task.status === "ready";

  const handleExecute = async () => {
    if (!canExecute || executing) return;
    setExecuting(true);
    try {
      const runId = await executeTask(task.id);
      router.push(`/runs/${runId}`);
    } finally {
      setExecuting(false);
    }
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
    router.push("/tasks");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={task.title}
        description={task.description || undefined}
        action={
          <div className="flex items-center gap-2">
            {canExecute && (
              <Button onClick={handleExecute} disabled={executing}>
                <Play className="size-4" />
                {executing ? "Başlatılıyor..." : "Çalıştır"}
              </Button>
            )}
            <ConfirmDialog
              title="Görevi Sil"
              description="Bu görevi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
              confirmLabel="Sil"
              variant="destructive"
              onConfirm={handleDelete}
              trigger={
                <Button variant="outline" className="text-destructive">
                  <Trash2 className="size-4" />
                  Sil
                </Button>
              }
            />
          </div>
        }
      />

      {/* Task Info */}
      <Card>
        <CardHeader>
          <CardTitle>Detaylar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Durum
              </p>
              <Badge
                variant="outline"
                className={cn(status.className)}
              >
                {status.label}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Öncelik
              </p>
              <span
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  priority.className
                )}
              >
                <Flag className="size-3" />
                {priority.label}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Takım
              </p>
              <span className="flex items-center gap-1 text-sm">
                <Users className="size-3 text-muted-foreground" />
                {team?.name ?? "Bilinmiyor"}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Çalışma Dizini
              </p>
              <span className="flex items-center gap-1 text-sm">
                <FolderOpen className="size-3 text-muted-foreground" />
                <span className="truncate">{task.workingDirectory}</span>
              </span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              Oluşturulma{" "}
              {new Date(task.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              Güncelleme{" "}
              {new Date(task.updatedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>İş Hattı</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskPipeline stages={task.stages} agents={agentNameMap} />
        </CardContent>
      </Card>

      {/* Back link */}
      <Button
        variant="ghost"
        onClick={() => router.push("/tasks")}
      >
        <ArrowLeft className="size-4" />
        Görevlere Dön
      </Button>
    </div>
  );
}
