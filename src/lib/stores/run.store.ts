"use client";

import { create } from "zustand";
import type { Run, RunEvent } from "@/lib/types";

interface RunStore {
  runs: Run[];
  currentRun: Run | null;
  events: RunEvent[];
  loading: boolean;
  error: string | null;

  fetchRuns: () => Promise<void>;
  fetchRunById: (id: string) => Promise<void>;
  stopRun: (id: string) => Promise<void>;
  addEvent: (event: RunEvent) => void;
  clearEvents: () => void;
}

export const useRunStore = create<RunStore>((set, get) => ({
  runs: [],
  currentRun: null,
  events: [],
  loading: false,
  error: null,

  fetchRuns: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/runs");
      const runs = await res.json();
      set({ runs, loading: false });
    } catch {
      set({ error: "Failed to fetch runs", loading: false });
    }
  },

  fetchRunById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/runs/${id}`);
      const run = await res.json();
      set({ currentRun: run, loading: false });
    } catch {
      set({ error: "Failed to fetch run", loading: false });
    }
  },

  stopRun: async (id) => {
    await fetch(`/api/runs/${id}/stop`, { method: "POST" });
    await get().fetchRunById(id);
    await get().fetchRuns();
  },

  addEvent: (event) => {
    set((state) => ({ events: [...state.events, event] }));
  },

  clearEvents: () => set({ events: [] }),
}));
