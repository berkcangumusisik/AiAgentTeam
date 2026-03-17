"use client";

import { useEffect } from "react";
import { useTeamStore } from "@/lib/stores/team.store";

export function useTeams() {
  const store = useTeamStore();

  useEffect(() => {
    if (store.teams.length === 0 && !store.loading) {
      store.fetchTeams();
    }
  }, []);

  return {
    teams: store.teams,
    presets: store.presets,
    loading: store.loading,
    error: store.error,
    createTeam: store.createTeam,
    updateTeam: store.updateTeam,
    deleteTeam: store.deleteTeam,
    getTeamById: store.getTeamById,
    refetch: store.fetchTeams,
    fetchPresets: store.fetchPresets,
  };
}
