"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { TeamBuilder } from "@/components/teams/team-builder";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import type { Team } from "@/lib/types";
import Link from "next/link";

export default function EditTeamPage() {
  const router = useRouter();
  const params = useParams<{ teamId: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeam() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/teams/${params.teamId}`);
        if (!res.ok) {
          throw new Error("Takım bulunamadı");
        }
        const data = await res.json();
        setTeam(data);
      } catch {
        setError("Takım yüklenemedi. Silinmiş olabilir.");
      } finally {
        setLoading(false);
      }
    }

    if (params.teamId) {
      fetchTeam();
    }
  }, [params.teamId]);

  const handleSaved = () => {
    router.push("/teams");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="p-6">
        <EmptyState
          icon={Users}
          title="Takım bulunamadı"
          description={error ?? "İstenen takım yüklenemedi."}
          action={
            <Button asChild variant="outline">
              <Link href="/teams">Takımlara Dön</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={`Düzenle: ${team.name}`}
        description="Takım bileşiminizi ve ayarlarınızı güncelleyin"
      />

      <TeamBuilder existingTeam={team} onSaved={handleSaved} />
    </div>
  );
}
