import { DollarSign, ArrowDown, ArrowUp, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { RunCost } from "@/lib/types";

interface RunCostTrackerProps {
  cost: RunCost;
}

function formatCost(value: number): string {
  return `$${value.toFixed(2)}`;
}

function formatTokens(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

export function RunCostTracker({ cost }: RunCostTrackerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <DollarSign className="size-4" />
          Maliyet & Tokenler
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Estimated cost */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tahmini Maliyet</span>
            <span className="text-lg font-semibold tabular-nums">
              {formatCost(cost.estimatedCost)}
            </span>
          </div>

          <Separator />

          {/* Token breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <ArrowDown className="size-3" />
                Girdi Tokenleri
              </span>
              <span className="font-medium tabular-nums">
                {formatTokens(cost.inputTokens)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <ArrowUp className="size-3" />
                Çıktı Tokenleri
              </span>
              <span className="font-medium tabular-nums">
                {formatTokens(cost.outputTokens)}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Hash className="size-3" />
                Toplam Token
              </span>
              <span className="font-semibold tabular-nums">
                {formatTokens(cost.totalTokens)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
