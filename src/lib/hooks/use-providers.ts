"use client";

import { useEffect } from "react";
import { useProviderStore } from "@/lib/stores/provider.store";

export function useProviders() {
  const store = useProviderStore();

  useEffect(() => {
    if (store.providers.length === 0 && !store.loading) {
      store.fetchProviders();
    }
  }, []);

  return {
    providers: store.providers,
    loading: store.loading,
    testing: store.testing,
    updateProvider: store.updateProvider,
    testProvider: store.testProvider,
    refetch: store.fetchProviders,
  };
}
