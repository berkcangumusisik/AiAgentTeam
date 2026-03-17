"use client";

import { useEffect } from "react";
import { useRunStore } from "@/lib/stores/run.store";

export function useRuns() {
  const store = useRunStore();

  useEffect(() => {
    if (store.runs.length === 0 && !store.loading) {
      store.fetchRuns();
    }
  }, []);

  return {
    runs: store.runs,
    loading: store.loading,
    error: store.error,
    fetchRuns: store.fetchRuns,
    stopRun: store.stopRun,
  };
}
