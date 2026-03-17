"use client";

import { X } from "lucide-react";
import type { TeamAgent } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeamAgentSlotProps {
  teamAgent: TeamAgent;
  agentName: string;
  onUpdate: (updated: TeamAgent) => void;
  onRemove: (agentId: string) => void;
}

export function TeamAgentSlot({
  teamAgent,
  agentName,
  onUpdate,
  onRemove,
}: TeamAgentSlotProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card p-3">
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{agentName}</span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onRemove(teamAgent.agentId)}
            aria-label={`${agentName} ajanını kaldır`}
          >
            <X className="size-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Rol</label>
            <Input
              placeholder="ör. Baş Geliştirici"
              value={teamAgent.role}
              onChange={(e) =>
                onUpdate({ ...teamAgent, role: e.target.value })
              }
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              Model Geçersiz Kılma
            </label>
            <Input
              placeholder="Varsayılan model"
              value={teamAgent.modelOverride ?? ""}
              onChange={(e) =>
                onUpdate({
                  ...teamAgent,
                  modelOverride: e.target.value || undefined,
                })
              }
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              Erişim Seviyesi
            </label>
            <Select
              value={teamAgent.accessLevel}
              onValueChange={(value: "full" | "read-only" | "restricted") =>
                onUpdate({ ...teamAgent, accessLevel: value })
              }
            >
              <SelectTrigger className="h-8 w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Tam</SelectItem>
                <SelectItem value="read-only">Salt Okunur</SelectItem>
                <SelectItem value="restricted">Kısıtlı</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
