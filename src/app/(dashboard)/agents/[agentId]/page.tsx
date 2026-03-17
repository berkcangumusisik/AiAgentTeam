"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { AgentDetail } from "@/components/agents/agent-detail";
import type { Agent } from "@/lib/types";

function AgentDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header card skeleton */}
      <div className="flex flex-col gap-4 rounded-xl border p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="size-14 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      {/* Section skeletons */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border p-6 space-y-3">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ))}
    </div>
  );
}

export default function AgentDetailPage() {
  const params = useParams<{ agentId: string }>();
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.agentId) return;

    let cancelled = false;

    async function fetchAgent() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/agents/${params.agentId}`);
        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? "Ajan bulunamadı"
              : "Ajan yüklenemedi"
          );
        }
        const data: Agent = await res.json();
        if (!cancelled) {
          setAgent(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Ajan yüklenemedi"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchAgent();

    return () => {
      cancelled = true;
    };
  }, [params.agentId]);

  return (
    <div className="space-y-6 p-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/agents")}
      >
        <ArrowLeft className="mr-1.5 size-4" />
        Ajan Kütüphanesine Dön
      </Button>

      {/* Content */}
      {loading ? (
        <AgentDetailSkeleton />
      ) : error ? (
        <EmptyState
          icon={Bot}
          title="Hata"
          description={error}
          action={
            <Button variant="outline" onClick={() => router.push("/agents")}>
              Kütüphaneye Dön
            </Button>
          }
        />
      ) : agent ? (
        <AgentDetail agent={agent} />
      ) : null}
    </div>
  );
}
