"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { cn } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  Wifi,
  WifiOff,
  Server,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { ProviderConfig, ProviderName } from "@/lib/types";

// ---------------------------------------------------------------------------
// Status badge configuration
// ---------------------------------------------------------------------------
const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  connected: {
    label: "Bağlı",
    className: "bg-emerald-500/10 text-emerald-500",
  },
  error: {
    label: "Hata",
    className: "bg-red-500/10 text-red-500",
  },
  untested: {
    label: "Test Edilmedi",
    className: "bg-gray-500/10 text-gray-400",
  },
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface ProviderCardProps {
  provider: ProviderConfig;
  onUpdate: (name: ProviderName, patch: Partial<ProviderConfig>) => void;
  onTest: (name: ProviderName) => void;
  testing: boolean;
}

export function ProviderCard({
  provider,
  onUpdate,
  onTest,
  testing,
}: ProviderCardProps) {
  const [showKey, setShowKey] = useState(false);
  const [modelsExpanded, setModelsExpanded] = useState(false);

  const status = provider.status ?? "untested";
  const badge = statusConfig[status] ?? statusConfig.untested;

  // -----------------------------------------------------------------------
  // Mask the API key for the password field
  // -----------------------------------------------------------------------
  const maskedKey =
    provider.apiKey && !showKey
      ? `${"*".repeat(Math.min(provider.apiKey.length, 32))}`
      : provider.apiKey ?? "";

  return (
    <Card
      className={cn(
        "transition-shadow",
        provider.isEnabled ? "border-border" : "opacity-60"
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <CardTitle className="text-base">{provider.displayName}</CardTitle>
            <Badge variant="outline" className={cn("text-xs", badge.className)}>
              {badge.label}
            </Badge>
            {provider.isLocal && (
              <Badge
                variant="outline"
                className="text-xs bg-violet-500/10 text-violet-500"
              >
                <Server className="mr-1 size-3" />
                Yerel
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            {provider.name}
          </p>
        </div>

        {/* Enable/disable toggle */}
        <div className="flex items-center gap-2 shrink-0 pt-0.5">
          <span className="text-xs text-muted-foreground">
            {provider.isEnabled ? "Etkin" : "Devre Dışı"}
          </span>
          <Switch
            checked={provider.isEnabled}
            onCheckedChange={(checked) =>
              onUpdate(provider.name, { isEnabled: checked })
            }
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* API Key */}
        {!provider.isLocal && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              API Anahtarı
            </label>
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                value={showKey ? provider.apiKey ?? "" : maskedKey}
                onChange={(e) =>
                  onUpdate(provider.name, { apiKey: e.target.value })
                }
                placeholder="API anahtarını girin"
                className="pr-10 font-mono text-xs"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => setShowKey((v) => !v)}
                aria-label={showKey ? "API anahtarını gizle" : "API anahtarını göster"}
              >
                {showKey ? (
                  <EyeOff className="size-3.5" />
                ) : (
                  <Eye className="size-3.5" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Base URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Temel URL
          </label>
          <Input
            value={provider.baseUrl}
            onChange={(e) =>
              onUpdate(provider.name, { baseUrl: e.target.value })
            }
            placeholder="https://api.example.com"
            className="font-mono text-xs"
          />
        </div>

        {/* Test connection button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          disabled={testing || !provider.isEnabled}
          onClick={() => onTest(provider.name)}
        >
          {testing ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Test ediliyor...
            </>
          ) : (
            <>
              {status === "connected" ? (
                <Wifi className="mr-2 size-3.5 text-emerald-500" />
              ) : (
                <WifiOff className="mr-2 size-3.5" />
              )}
              Bağlantıyı Test Et
            </>
          )}
        </Button>

        {/* Models list */}
        {provider.models.length > 0 && (
          <>
            <Separator />
            <div>
              <button
                type="button"
                className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setModelsExpanded((v) => !v)}
              >
                <span>
                  Kullanılabilir Modeller ({provider.models.length})
                </span>
                {modelsExpanded ? (
                  <ChevronUp className="size-3.5" />
                ) : (
                  <ChevronDown className="size-3.5" />
                )}
              </button>

              {modelsExpanded && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {provider.models.map((model) => (
                    <Badge
                      key={model.id}
                      variant="secondary"
                      className="text-[10px] font-mono font-normal"
                    >
                      {model.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
