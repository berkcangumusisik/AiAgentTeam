"use client";

import { useProviders } from "@/lib/hooks/use-providers";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ProviderCard } from "@/components/providers/provider-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import type { ProviderConfig, ProviderName } from "@/lib/types";

export default function ProvidersPage() {
  const { providers, loading, testing, updateProvider, testProvider, refetch } =
    useProviders();

  // -----------------------------------------------------------------------
  // Handler wrappers
  // -----------------------------------------------------------------------
  const handleUpdate = (name: ProviderName, patch: Partial<ProviderConfig>) => {
    updateProvider(name, patch);
  };

  const handleTest = (name: ProviderName) => {
    testProvider(name);
  };

  // -----------------------------------------------------------------------
  // Derived stats
  // -----------------------------------------------------------------------
  const connectedCount = providers.filter(
    (p) => p.status === "connected"
  ).length;
  const enabledCount = providers.filter((p) => p.isEnabled).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Sağlayıcıları"
        description="Her sağlayıcı için API anahtarlarını, uç noktaları ve bağlantı ayarlarını yapılandırın."
        action={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {connectedCount} bağlı &middot; {enabledCount} etkin
            </Badge>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="mr-2 size-3.5" />
              Yenile
            </Button>
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 size-3.5" />
                Ayarlar'a Dön
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {providers.map((provider) => (
          <ProviderCard
            key={provider.name}
            provider={provider}
            onUpdate={handleUpdate}
            onTest={handleTest}
            testing={testing === provider.name}
          />
        ))}
      </div>

      {providers.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Yapılandırılmış sağlayıcı yok. Sunucu yapılandırmanızı kontrol edin.
        </p>
      )}
    </div>
  );
}
