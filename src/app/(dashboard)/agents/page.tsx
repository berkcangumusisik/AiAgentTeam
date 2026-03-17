"use client";

import { useRouter } from "next/navigation";
import { Bot } from "lucide-react";
import { useAgents } from "@/lib/hooks/use-agents";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { AgentCategoryFilter } from "@/components/agents/agent-category-filter";
import { AgentSearch } from "@/components/agents/agent-search";
import { AgentGrid } from "@/components/agents/agent-grid";
import { Skeleton } from "@/components/ui/skeleton";
import type { Agent } from "@/lib/types";

function AgentGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-4 rounded-xl border p-6">
          <div className="flex items-start gap-3">
            <Skeleton className="size-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-8 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  );
}

export default function AgentsPage() {
  const router = useRouter();
  const {
    agents,
    loading,
    error,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
  } = useAgents();

  const handleSelectAgent = (agent: Agent) => {
    router.push(`/agents/${agent.id}`);
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Ajan Kütüphanesi"
        description="Takımlarınız için yapay zeka ajanlarını keşfedin ve yönetin"
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AgentCategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <AgentSearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Content */}
      {loading ? (
        <AgentGridSkeleton />
      ) : error ? (
        <EmptyState
          icon={Bot}
          title="Ajanlar yüklenemedi"
          description={error}
        />
      ) : agents.length === 0 ? (
        <EmptyState
          icon={Bot}
          title="Ajan bulunamadı"
          description={
            searchQuery || selectedCategory !== "all"
              ? "Arama veya kategori filtrenizi değiştirmeyi deneyin."
              : "Henüz hiç ajan oluşturulmamış."
          }
        />
      ) : (
        <AgentGrid agents={agents} onSelectAgent={handleSelectAgent} />
      )}
    </div>
  );
}
