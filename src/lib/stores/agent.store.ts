"use client";

import { create } from "zustand";
import type { Agent, AgentCategory } from "@/lib/types";

interface AgentStore {
  agents: Agent[];
  libraryAgents: Agent[];
  customAgents: Agent[];
  loading: boolean;
  error: string | null;
  selectedCategory: AgentCategory | "all";
  searchQuery: string;

  setSelectedCategory: (category: AgentCategory | "all") => void;
  setSearchQuery: (query: string) => void;
  fetchAgents: () => Promise<void>;
  fetchLibraryAgents: () => Promise<void>;
  createAgent: (data: Partial<Agent>) => Promise<Agent>;
  updateAgent: (id: string, data: Partial<Agent>) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
  getFilteredAgents: () => Agent[];
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  agents: [],
  libraryAgents: [],
  customAgents: [],
  loading: false,
  error: null,
  selectedCategory: "all",
  searchQuery: "",

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  fetchAgents: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/agents");
      const agents = await res.json();
      set({
        agents,
        libraryAgents: agents.filter((a: Agent) => a.isLibrary),
        customAgents: agents.filter((a: Agent) => !a.isLibrary),
        loading: false,
      });
    } catch (err) {
      set({ error: "Failed to fetch agents", loading: false });
    }
  },

  fetchLibraryAgents: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/agents/library");
      const agents = await res.json();
      set({ libraryAgents: agents, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch library agents", loading: false });
    }
  },

  createAgent: async (data) => {
    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const agent = await res.json();
    await get().fetchAgents();
    return agent;
  },

  updateAgent: async (id, data) => {
    await fetch(`/api/agents/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await get().fetchAgents();
  },

  deleteAgent: async (id) => {
    await fetch(`/api/agents/${id}`, { method: "DELETE" });
    await get().fetchAgents();
  },

  getFilteredAgents: () => {
    const { agents, selectedCategory, searchQuery } = get();
    let filtered = agents;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((a) => a.category === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return filtered;
  },
}));
