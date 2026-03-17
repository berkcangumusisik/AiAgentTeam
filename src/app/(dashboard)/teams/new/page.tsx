"use client";

import { useRouter } from "next/navigation";
import { useTeams } from "@/lib/hooks/use-teams";
import { PageHeader } from "@/components/shared/page-header";
import { TeamBuilder } from "@/components/teams/team-builder";
import { TeamPresetPicker } from "@/components/teams/team-preset-picker";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import type { Team } from "@/lib/types";

export default function NewTeamPage() {
  const router = useRouter();
  const { presets, fetchPresets } = useTeams();
  const [presetSeed, setPresetSeed] = useState<Team | undefined>(undefined);

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  const handleSaved = () => {
    router.push("/teams");
  };

  const handlePresetSelect = (preset: Team) => {
    setPresetSeed(preset);
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Takım Oluştur"
        description="Yeni bir AI ajan takım bileşimi oluşturun"
      />

      {/* Preset picker */}
      {presets.length > 0 && !presetSeed && (
        <>
          <TeamPresetPicker presets={presets} onSelect={handlePresetSelect} />
          <Separator />
        </>
      )}

      <TeamBuilder existingTeam={presetSeed} onSaved={handleSaved} />
    </div>
  );
}
