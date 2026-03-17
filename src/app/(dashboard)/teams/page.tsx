"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, Plus } from "lucide-react";
import { toast } from "sonner";
import { useTeams } from "@/lib/hooks/use-teams";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { TeamCard } from "@/components/teams/team-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Team } from "@/lib/types";

function TeamGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-4 rounded-xl border p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-18 rounded-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-18" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TeamsPage() {
  const router = useRouter();
  const { teams, presets, loading, error, deleteTeam } = useTeams();

  const customTeams = teams.filter((t) => !t.isPreset);
  const presetTeams = presets.length > 0 ? presets : teams.filter((t) => t.isPreset);

  const handleEdit = (team: Team) => {
    router.push(`/teams/${team.id}`);
  };

  const handleDelete = async (team: Team) => {
    try {
      await deleteTeam(team.id);
      toast.success(`"${team.name}" takımı silindi`);
    } catch {
      toast.error("Takım silinemedi");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Takımlar"
        description="AI ajan takım bileşimlerinizi yönetin"
        action={
          <Button asChild>
            <Link href="/teams/new">
              <Plus className="size-4" />
              Yeni Takım
            </Link>
          </Button>
        }
      />

      {loading ? (
        <TeamGridSkeleton />
      ) : error ? (
        <EmptyState
          icon={Users}
          title="Takımlar yüklenemedi"
          description={error}
        />
      ) : teams.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Henüz takım yok"
          description="AI ajan iş birliğine başlamak için ilk takımınızı oluşturun."
          action={
            <Button asChild>
              <Link href="/teams/new">
                <Plus className="size-4" />
                Takım Oluştur
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-8">
          {/* Preset teams */}
          {presetTeams.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Hazır Şablon Takımlar</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {presetTeams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            </section>
          )}

          {presetTeams.length > 0 && customTeams.length > 0 && <Separator />}

          {/* Custom teams */}
          {customTeams.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Özel Takımlar</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {customTeams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
