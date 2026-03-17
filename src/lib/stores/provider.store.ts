"use client";

import { create } from "zustand";
import type { ProviderConfig, ProviderName } from "@/lib/types";

interface ProviderStore {
  providers: ProviderConfig[];
  loading: boolean;
  testing: ProviderName | null;

  fetchProviders: () => Promise<void>;
  updateProvider: (name: ProviderName, data: Partial<ProviderConfig>) => Promise<void>;
  testProvider: (name: ProviderName) => Promise<{ success: boolean; message: string }>;
}

export const useProviderStore = create<ProviderStore>((set, get) => ({
  providers: [],
  loading: false,
  testing: null,

  fetchProviders: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/providers");
      const providers = await res.json();
      set({ providers, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  updateProvider: async (name, data) => {
    await fetch("/api/providers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, ...data }),
    });
    await get().fetchProviders();
  },

  testProvider: async (name) => {
    set({ testing: name });
    try {
      const res = await fetch("/api/providers/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const result = await res.json();
      await get().fetchProviders();
      return result;
    } finally {
      set({ testing: null });
    }
  },
}));
