"use client";

import { useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Square,
  Clock,
  Play,
  Users,
  ActivitySquare,
} from "lucide-react";
import Link from "next/link";
import { useRunEvents } from "@/lib/hooks/use-run-events";
import { useRunStore } from "@/lib/stores/run.store";
import { RunTimeline } from "@/components/runs/run-timeline";
import { RunTerminal } from "@/components/runs/run-terminal";
import { RunAgentStatus } from "@/components/runs/run-agent-status";
import { RunCostTracker } from "@/components/runs/run-cost-tracker";
import { RunFileChanges } from "@/components/runs/run-file-changes";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { StatusDot } from "@/components/shared/status-dot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { RunStatus } from "@/lib/types";

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
    second: "2-digit",
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

function RunDetailSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Info bar skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-6 w-20 ml-auto" />
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-[500px] w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function RunDetailPage() {
  const params = useParams();
  const runId = params.runId as string;

  const { events, currentRun } = useRunEvents(runId);
  const { stopRun, loading, fetchRunById } = useRunStore();

  // Periodically refresh run data when running
  useEffect(() => {
    if (!currentRun || currentRun.status !== "running") return;

    const interval = setInterval(() => {
      fetchRunById(runId);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentRun?.status, runId, fetchRunById]);

  // Extract terminal output from events
  const terminalOutput = useMemo(() => {
    return events
      .filter((e) => e.type === "terminal:output")
      .map((e) => e.message)
      .join("\n");
  }, [events]);

  const handleStop = useCallback(() => {
    stopRun(runId);
  }, [runId, stopRun]);

  if (loading && !currentRun) {
    return <RunDetailSkeleton />;
  }

  if (!currentRun) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <ActivitySquare className="size-12 text-muted-foreground" />
        <p className="text-muted-foreground">Çalıştırma bulunamadı</p>
        <Button variant="outline" asChild>
          <Link href="/runs">
            <ArrowLeft className="size-4" />
            Çalıştırmalara Dön
          </Link>
        </Button>
      </div>
    );
  }

  const isRunning = currentRun.status === "running";

  return (
    <div className="space-y-6 p-6">
      {/* Top info bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/runs">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <StatusDot
              status={statusToDotStatus[currentRun.status] as "success" | "error" | "warning" | "info" | "idle" | "running" | "pending"}
              pulse={isRunning}
            />
            <h1 className="text-lg font-semibold font-mono">
              {currentRun.id.slice(0, 8)}
            </h1>
          </div>

          <Badge
            variant="outline"
            className={cn(statusBadgeStyles[currentRun.status])}
          >
            {statusLabels[currentRun.status]}
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Play className="size-3" />
              {formatDate(currentRun.startedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {formatDuration(currentRun.startedAt, currentRun.completedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              Takım: {currentRun.teamId}
            </span>
          </div>

          {/* Stop button */}
          {isRunning && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleStop}
            >
              <Square className="size-4" />
              Çalıştırmayı Durdur
            </Button>
          )}
        </div>
      </div>

      {/* Task info */}
      <div className="text-sm text-muted-foreground">
        Görev: <span className="font-mono">{currentRun.taskId}</span>
      </div>

      <Separator />

      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: Timeline & Terminal */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="timeline">
            <TabsList>
              <TabsTrigger value="timeline">Zaman Çizelgesi</TabsTrigger>
              <TabsTrigger value="terminal">Terminal</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Olay Zaman Çizelgesi</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <RunTimeline events={events} />
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terminal">
              <RunTerminal output={terminalOutput} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column: Status panels */}
        <div className="space-y-4">
          <RunAgentStatus agentStates={currentRun.agentStates} />
          <RunCostTracker cost={currentRun.cost} />
          <RunFileChanges fileChanges={currentRun.fileChanges} />
        </div>
      </div>

      {/* Error display */}
      {currentRun.error && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-sm text-red-600">Hata</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 font-mono whitespace-pre-wrap">
              {currentRun.error}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
