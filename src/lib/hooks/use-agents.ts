"use client";

import { useEffect } from "react";
import { useAgentStore } from "@/lib/stores/agent.store";

export function useAgents() {
  const store = useAgentStore();

  useEffect(() => {
    if (store.agents.length === 0 && !store.loading) {
      store.fetchAgents();
    }
  }, []);

  return {
    agents: store.getFilteredAgents(),
    allAgents: store.agents,
    libraryAgents: store.libraryAgents,
    loading: store.loading,
    error: store.error,
    selectedCategory: store.selectedCategory,
    searchQuery: store.searchQuery,
    setSelectedCategory: store.setSelectedCategory,
    setSearchQuery: store.setSearchQuery,
    createAgent: store.createAgent,
    updateAgent: store.updateAgent,
    deleteAgent: store.deleteAgent,
    refetch: store.fetchAgents,
  };
}
