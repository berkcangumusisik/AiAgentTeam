"use client";

import { create } from "zustand";
import type { Team, TeamAgent } from "@/lib/types";

interface TeamStore {
  teams: Team[];
  presets: Team[];
  loading: boolean;
  error: string | null;

  fetchTeams: () => Promise<void>;
  fetchPresets: () => Promise<void>;
  createTeam: (data: Partial<Team>) => Promise<Team>;
  updateTeam: (id: string, data: Partial<Team>) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  getTeamById: (id: string) => Team | undefined;
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  teams: [],
  presets: [],
  loading: false,
  error: null,

  fetchTeams: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/teams");
      const teams = await res.json();
      set({
        teams,
        presets: teams.filter((t: Team) => t.isPreset),
        loading: false,
      });
    } catch {
      set({ error: "Failed to fetch teams", loading: false });
    }
  },

  fetchPresets: async () => {
    try {
      const res = await fetch("/api/teams/presets");
      const presets = await res.json();
      set({ presets });
    } catch {
      // ignore
    }
  },

  createTeam: async (data) => {
    const res = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const team = await res.json();
    await get().fetchTeams();
    return team;
  },

  updateTeam: async (id, data) => {
    await fetch(`/api/teams/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await get().fetchTeams();
  },

  deleteTeam: async (id) => {
    await fetch(`/api/teams/${id}`, { method: "DELETE" });
    await get().fetchTeams();
  },

  getTeamById: (id) => {
    return get().teams.find((t) => t.id === id);
  },
}));
