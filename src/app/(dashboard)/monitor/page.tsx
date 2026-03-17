"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, Play, Square, Clock, Cpu, DollarSign, Zap, RefreshCw } from "lucide-react";
import type { Run } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

const statusColors: Record<string, string> = {
  pending: "bg-gray-500",
  running: "bg-yellow-500",
  completed: "bg-green-500",
  failed: "bg-red-500",
  stopped: "bg-gray-500",
  paused: "bg-blue-500",
};

const statusLabels: Record<string, string> = {
  pending: "Beklemede",
  running: "Çalışıyor",
  completed: "Tamamlandı",
  failed: "Başarısız",
  stopped: "Durduruldu",
  paused: "Duraklatıldı",
};

export default function MonitorPage() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRuns = async () => {
    try {
      const res = await fetch("/api/runs");
      const data = await res.json();
      setRuns(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRuns();
    const interval = setInterval(fetchRuns, 3000);
    return () => clearInterval(interval);
  }, []);

  const activeRuns = runs.filter((r) => r.status === "running" || r.status === "pending");
  const completedRuns = runs.filter((r) => r.status === "completed");
  const failedRuns = runs.filter((r) => r.status === "failed");

  const totalTokens = runs.reduce((sum, r) => sum + (r.cost?.totalTokens || 0), 0);
  const totalCost = runs.reduce((sum, r) => sum + (r.cost?.estimatedCost || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">İzleme</h1>
          <p className="text-muted-foreground">Gerçek zamanlı sistem izleme panosu</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchRuns}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Yenile
        </Button>
      </div>

      {/* Global Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Çalıştırmalar</CardTitle>
            <Play className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRuns.length}</div>
            <p className="text-xs text-muted-foreground">Şu anda çalışıyor</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tamamlanan</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedRuns.length}</div>
            <p className="text-xs text-muted-foreground">Başarıyla tamamlandı</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Token</CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTokens.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Tüm çalıştırmalar genelinde</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tahmini Maliyet</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(4)}</div>
            <p className="text-xs text-muted-foreground">Toplam harcama</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Runs Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Aktif Çalıştırmalar</h2>
        {activeRuns.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aktif çalıştırma yok</p>
              <p className="text-sm text-muted-foreground">
                Burada görmek için bir görev çalıştırın
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeRuns.map((run) => (
              <Link key={run.id} href={`/runs/${run.id}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-mono">
                        {run.id.substring(0, 12)}...
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={cn("text-white text-xs", statusColors[run.status])}
                      >
                        {statusLabels[run.status] || run.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Aşama {run.currentStageIndex + 1}</span>
                        <span>{run.cost?.totalTokens?.toLocaleString() || 0} token</span>
                      </div>
                      <Progress value={30} className="h-1" />
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {run.agentStates?.map((agent) => (
                        <div
                          key={agent.agentId}
                          className="flex items-center gap-1"
                        >
                          <div
                            className={cn(
                              "h-2 w-2 rounded-full",
                              agent.status === "thinking" && "bg-yellow-500 animate-pulse",
                              agent.status === "tool-calling" && "bg-blue-500 animate-pulse",
                              agent.status === "done" && "bg-green-500",
                              agent.status === "error" && "bg-red-500",
                              agent.status === "idle" && "bg-gray-500"
                            )}
                          />
                          <span className="text-xs text-muted-foreground">
                            {agent.agentName}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(run.startedAt).toLocaleTimeString()}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Completed/Failed */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Son Çalıştırmalar</h2>
        <div className="space-y-2">
          {runs.slice(0, 10).map((run) => (
            <Link key={run.id} href={`/runs/${run.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center justify-between py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        statusColors[run.status]
                      )}
                    />
                    <span className="font-mono text-sm">{run.id.substring(0, 16)}</span>
                    <Badge variant="outline" className="text-xs">
                      {statusLabels[run.status] || run.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{run.agentStates?.length || 0} ajan</span>
                    <span>{run.cost?.totalTokens?.toLocaleString() || 0} token</span>
                    <span>{new Date(run.startedAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {runs.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Henüz çalıştırma yok. Başlamak için bir görev oluşturun ve çalıştırın.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
