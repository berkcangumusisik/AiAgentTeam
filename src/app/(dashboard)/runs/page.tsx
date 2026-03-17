"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Clock,
  Hash,
  Filter,
  ActivitySquare,
} from "lucide-react";
import { useRuns } from "@/lib/hooks/use-runs";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { StatusDot } from "@/components/shared/status-dot";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { RunStatus } from "@/lib/types";

const statusFilters: { label: string; value: RunStatus | "all" }[] = [
  { label: "Tümü", value: "all" },
  { label: "Çalışıyor", value: "running" },
  { label: "Tamamlandı", value: "completed" },
  { label: "Başarısız", value: "failed" },
  { label: "Durduruldu", value: "stopped" },
  { label: "Beklemede", value: "pending" },
];

const statusLabels: Record<RunStatus, string> = {
  pending: "Beklemede",
  running: "Çalışıyor",
  paused: "Duraklatıldı",
  completed: "Tamamlandı",
  failed: "Başarısız",
  stopped: "Durduruldu",
};

const statusToDotStatus: Record<RunStatus, string> = {
  pending: "pending",
  running: "running",
  paused: "warning",
  completed: "success",
  failed: "error",
  stopped: "idle",
};

const statusBadgeStyles: Record<RunStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  running: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  paused: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  failed: "bg-red-500/10 text-red-600 border-red-500/20",
  stopped: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("tr-TR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(startedAt: string, completedAt?: string): string {
  const start = new Date(startedAt).getTime();
  const end = completedAt ? new Date(completedAt).getTime() : Date.now();
  const diffMs = end - start;

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

function RunCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RunsPage() {
  const router = useRouter();
  const { runs, loading } = useRuns();
  const [statusFilter, setStatusFilter] = useState<RunStatus | "all">("all");

  const filteredRuns = useMemo(() => {
    if (statusFilter === "all") return runs;
    return runs.filter((run) => run.status === statusFilter);
  }, [runs, statusFilter]);

  // Sort by most recent first
  const sortedRuns = useMemo(() => {
    return [...filteredRuns].sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  }, [filteredRuns]);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Çalıştırmalar"
        description="Ajan çalıştırma geçmişini izleyin ve inceleyin"
      />

      {/* Status filter */}
      <div className="flex items-center gap-2">
        <Filter className="size-4 text-muted-foreground" />
        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={statusFilter === filter.value ? "default" : "outline"}
              size="xs"
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <RunCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && sortedRuns.length === 0 && (
        <EmptyState
          icon={ActivitySquare}
          title="Çalıştırma bulunamadı"
          description={
            statusFilter === "all"
              ? "Sonuçları burada görmek için bir görev çalıştırın."
              : `"${statusFilter}" durumunda çalıştırma yok.`
          }
        />
      )}

      {/* Runs list */}
      {!loading && sortedRuns.length > 0 && (
        <div className="grid gap-3">
          {sortedRuns.map((run) => (
            <Card
              key={run.id}
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => router.push(`/runs/${run.id}`)}
            >
              <CardContent className="pt-6">
                <div className="space-y-2">
                  {/* Top row: ID and status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusDot
                        status={statusToDotStatus[run.status] as "success" | "error" | "warning" | "info" | "idle" | "running" | "pending"}
                        pulse={run.status === "running"}
                      />
                      <span className="font-mono text-sm font-medium">
                        {run.id.slice(0, 8)}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(statusBadgeStyles[run.status])}
                    >
                      {statusLabels[run.status]}
                    </Badge>
                  </div>

                  {/* Task ID */}
                  <p className="text-sm text-muted-foreground">
                    Görev: {run.taskId}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Play className="size-3" />
                      {formatDate(run.startedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {formatDuration(run.startedAt, run.completedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Hash className="size-3" />
                      {run.cost.totalTokens.toLocaleString()} token
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
