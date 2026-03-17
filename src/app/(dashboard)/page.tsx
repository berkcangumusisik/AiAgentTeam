"use client";

import { useAgents } from "@/lib/hooks/use-agents";
import { useTeams } from "@/lib/hooks/use-teams";
import { useTasks } from "@/lib/hooks/use-tasks";
import { useRuns } from "@/lib/hooks/use-runs";
import { useProviders } from "@/lib/hooks/use-providers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { cn } from "@/lib/utils";
import {
  Bot,
  Users,
  ListTodo,
  Play,
  ArrowRight,
  Clock,
  Plug,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";
import type { Run, Task } from "@/lib/types";

// ---------------------------------------------------------------------------
// Status colour mapping for run badges
// ---------------------------------------------------------------------------
const runStatusColor: Record<string, string> = {
  pending: "bg-gray-500/10 text-gray-500",
  running: "bg-yellow-500/10 text-yellow-500",
  paused: "bg-blue-500/10 text-blue-500",
  completed: "bg-emerald-500/10 text-emerald-500",
  failed: "bg-red-500/10 text-red-500",
  stopped: "bg-gray-500/10 text-gray-500",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}sn önce`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}dk önce`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}sa önce`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}g önce`;
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------
interface StatCardProps {
  label: string;
  count: number;
  icon: React.ElementType;
  iconClassName?: string;
  href: string;
}

function StatCard({ label, count, icon: Icon, iconClassName, href }: StatCardProps) {
  return (
    <Link href={href}>
      <Card className="group cursor-pointer transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{label}</CardTitle>
          <Icon className={cn("size-4", iconClassName)} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{count}</div>
          <p className="text-xs text-muted-foreground">
            Tümünü gör <ArrowRight className="ml-1 inline size-3 transition-transform group-hover:translate-x-0.5" />
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Quick action card
// ---------------------------------------------------------------------------
interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  iconBg: string;
}

function QuickAction({ title, description, icon: Icon, href, iconBg }: QuickActionProps) {
  return (
    <Link href={href}>
      <Card className="group cursor-pointer transition-shadow hover:shadow-md h-full">
        <CardContent className="flex items-start gap-4 pt-6">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg text-white",
              iconBg
            )}
          >
            <Icon className="size-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold leading-none">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Dashboard page
// ---------------------------------------------------------------------------
export default function DashboardPage() {
  const { allAgents, loading: agentsLoading } = useAgents();
  const { teams, loading: teamsLoading } = useTeams();
  const { tasks, loading: tasksLoading } = useTasks();
  const { runs, loading: runsLoading } = useRuns();
  const { providers, loading: providersLoading } = useProviders();

  const loading =
    agentsLoading || teamsLoading || tasksLoading || runsLoading || providersLoading;

  const activeRuns = runs.filter(
    (r) => r.status === "running" || r.status === "pending"
  );
  const recentRuns = [...runs]
    .sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    )
    .slice(0, 5);

  const connectedProviders = providers.filter(
    (p) => p.status === "connected" && p.isEnabled
  );

  // Build a lookup for task titles keyed by id
  const taskMap = new Map(tasks.map((t: Task) => [t.id, t]));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="AI Agent Team OS"
        description="Yazılım geliştirme için AI ajan takımları oluşturun, yönetin ve orkestra edin."
      />

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Toplam Ajan"
          count={allAgents.length}
          icon={Bot}
          iconClassName="text-blue-500"
          href="/agents"
        />
        <StatCard
          label="Takımlar"
          count={teams.length}
          icon={Users}
          iconClassName="text-violet-500"
          href="/teams"
        />
        <StatCard
          label="Görevler"
          count={tasks.length}
          icon={ListTodo}
          iconClassName="text-amber-500"
          href="/tasks"
        />
        <StatCard
          label="Aktif Çalıştırmalar"
          count={activeRuns.length}
          icon={Play}
          iconClassName="text-emerald-500"
          href="/runs"
        />
      </div>

      {/* Two-column bottom section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent runs -- spans 2 cols */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Son Çalıştırmalar</CardTitle>
            <CardDescription>Son 5 görev yürütmesi</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRuns.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Henüz çalıştırma yok. Başlamak için bir görev yürütün.
              </p>
            ) : (
              <div className="space-y-3">
                {recentRuns.map((run: Run) => {
                  const task = taskMap.get(run.taskId);
                  return (
                    <Link
                      key={run.id}
                      href={`/runs/${run.id}`}
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Badge
                          variant="outline"
                          className={cn("text-xs shrink-0", runStatusColor[run.status])}
                        >
                          {run.status}
                        </Badge>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {task?.title ?? run.taskId.substring(0, 12)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {run.agentStates?.length ?? 0} ajan &middot;{" "}
                            {run.cost?.totalTokens?.toLocaleString() ?? 0} token
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                        <Clock className="size-3" />
                        {formatRelativeTime(run.startedAt)}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right column: quick actions + system status */}
        <div className="space-y-6">
          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuickAction
                title="Ajanları Görüntüle"
                description="Mevcut AI ajanlarını ve yeteneklerini keşfedin"
                icon={Search}
                href="/agents"
                iconBg="bg-blue-600"
              />
              <QuickAction
                title="Takım Oluştur"
                description="İş birliği için yeni bir ajan takımı oluşturun"
                icon={Plus}
                href="/teams"
                iconBg="bg-violet-600"
              />
              <QuickAction
                title="Yeni Görev"
                description="Yeni bir çok aşamalı görev tanımlayın ve yürütün"
                icon={ListTodo}
                href="/tasks"
                iconBg="bg-amber-600"
              />
            </CardContent>
          </Card>

          {/* System status */}
          <Card>
            <CardHeader>
              <CardTitle>Sistem Durumu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Plug className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {connectedProviders.length} / {providers.length} sağlayıcı
                    bağlı
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {connectedProviders.length === 0
                      ? "Sağlayıcıları Ayarlar'dan yapılandırın"
                      : `Aktif: ${connectedProviders.map((p) => p.displayName).join(", ")}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
