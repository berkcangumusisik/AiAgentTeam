"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, ListChecks } from "lucide-react";
import type { TaskStatus } from "@/lib/types";
import { useTasks } from "@/lib/hooks/use-tasks";
import { useTeams } from "@/lib/hooks/use-teams";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TaskCard } from "@/components/tasks/task-card";

type FilterTab = "all" | "draft" | "running" | "completed" | "failed";

const filterTabs: { value: FilterTab; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "draft", label: "Taslak" },
  { value: "running", label: "Çalışıyor" },
  { value: "completed", label: "Tamamlandı" },
  { value: "failed", label: "Başarısız" },
];

export default function TasksPage() {
  const router = useRouter();
  const { tasks, loading } = useTasks();
  const { getTeamById } = useTeams();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filteredTasks = useMemo(() => {
    if (activeTab === "all") return tasks;
    return tasks.filter((t) => t.status === (activeTab as TaskStatus));
  }, [tasks, activeTab]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Görevler"
        description="Ajan takımlarınız için görev oluşturun ve yönetin."
        action={
          <Button asChild>
            <Link href="/tasks/new">
              <Plus className="size-4" />
              Yeni Görev
            </Link>
          </Button>
        }
      />

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as FilterTab)}
      >
        <TabsList>
          {filterTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {filterTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {filteredTasks.length === 0 ? (
              <EmptyState
                icon={ListChecks}
                title="Görev bulunamadı"
                description={
                  activeTab === "all"
                    ? "Başlamak için ilk görevinizi oluşturun."
                    : `"${activeTab}" durumunda görev yok.`
                }
                action={
                  activeTab === "all" ? (
                    <Button asChild variant="outline">
                      <Link href="/tasks/new">
                        <Plus className="size-4" />
                        Yeni Görev
                      </Link>
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTasks.map((task) => {
                  const team = getTeamById(task.teamId);
                  return (
                    <TaskCard
                      key={task.id}
                      task={task}
                      teamName={team?.name}
                      onClick={() =>
                        router.push(`/tasks/${task.id}`)
                      }
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
