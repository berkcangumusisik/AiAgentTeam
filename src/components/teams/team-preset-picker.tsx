"use client";

import { Star, Users } from "lucide-react";
import type { Team } from "@/lib/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TeamPresetPickerProps {
  presets: Team[];
  onSelect: (team: Team) => void;
}

export function TeamPresetPicker({ presets, onSelect }: TeamPresetPickerProps) {
  if (presets.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Star className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Hazır Şablondan Başla</h3>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {presets.map((preset) => (
          <Card
            key={preset.id}
            className="cursor-pointer transition-colors hover:border-primary/50 hover:bg-accent/50"
            onClick={() => onSelect(preset)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="size-3.5 text-muted-foreground" />
                {preset.name}
              </CardTitle>
              <CardDescription className="text-xs">
                {preset.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-xs">
                {preset.agents.length}{" "}
                {preset.agents.length === 1 ? "ajan" : "ajan"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
