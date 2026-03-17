"use client";

import { Users, Pencil, Trash2, Star } from "lucide-react";
import type { Team } from "@/lib/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TeamCardProps {
  team: Team;
  onEdit?: (team: Team) => void;
  onDelete?: (team: Team) => void;
}

export function TeamCard({ team, onEdit, onDelete }: TeamCardProps) {
  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />
            {team.name}
          </CardTitle>
          {team.isPreset && (
            <Badge variant="secondary" className="gap-1">
              <Star className="size-3" />
              Hazır Şablon
            </Badge>
          )}
        </div>
        <CardDescription>{team.description}</CardDescription>
        <CardAction>
          <Badge variant="outline">
            {team.agents.length} {team.agents.length === 1 ? "ajan" : "ajan"}
          </Badge>
        </CardAction>
      </CardHeader>

      {team.tags.length > 0 && (
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {team.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      )}

      {(onEdit || onDelete) && (
        <CardFooter className="gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(team)}
            >
              <Pencil className="size-3.5" />
              Düzenle
            </Button>
          )}
          {onDelete && !team.isPreset && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(team)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
              Sil
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
