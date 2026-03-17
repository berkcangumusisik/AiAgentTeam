"use client";

import { type LucideIcon } from "lucide-react";
import {
  Bot,
  Lightbulb,
  ClipboardList,
  BarChart3,
  GitBranch,
  Calendar,
  Pen,
  Palette,
  Smartphone,
  Layout,
  Zap,
  Server,
  Plug,
  Layers,
  TestTubes,
  Bug,
  Eye,
  Wrench,
  Box,
  Rocket,
  GitPullRequest,
  Activity,
  FileText,
  Search,
  MessageSquare,
  FolderSearch,
  UserPlus,
  Cpu,
  Shield,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AGENT_CATEGORIES, RISK_LEVELS } from "@/lib/utils/constants";
import type { Agent } from "@/lib/types";

// ----------------------------------------------------------------
// Icon mapping: maps avatar string names to Lucide icon components.
// For names that don't exist in lucide-react we substitute close
// equivalents (Figma -> Pen, Atom -> Zap, TestTube -> Flask,
// Container -> Box).
// ----------------------------------------------------------------
const ICON_MAP: Record<string, LucideIcon> = {
  Bot,
  Lightbulb,
  ClipboardList,
  BarChart3,
  GitBranch,
  Calendar,
  Figma: Pen,
  Pen,
  Palette,
  Smartphone,
  Layout,
  Atom: Zap,
  Zap,
  Server,
  Plug,
  Layers,
  TestTube: TestTubes,
  TestTubes,
  Bug,
  Eye,
  Wrench,
  Container: Box,
  Box,
  Rocket,
  GitPullRequest,
  Activity,
  FileText,
  Search,
  MessageSquare,
  FolderSearch,
  Cpu,
  Shield,
};

function getAgentIcon(avatar: string): LucideIcon {
  return ICON_MAP[avatar] ?? Bot;
}

// ----------------------------------------------------------------
// Risk level badge colour mapping
// ----------------------------------------------------------------
const RISK_BADGE_VARIANT: Record<
  string,
  { bg: string; text: string }
> = {
  low: { bg: "bg-green-500/10", text: "text-green-500" },
  medium: { bg: "bg-yellow-500/10", text: "text-yellow-500" },
  high: { bg: "bg-red-500/10", text: "text-red-500" },
};

// ----------------------------------------------------------------
// Props
// ----------------------------------------------------------------
interface AgentCardProps {
  agent: Agent;
  onSelect?: (agent: Agent) => void;
}

export function AgentCard({ agent, onSelect }: AgentCardProps) {
  const Icon = getAgentIcon(agent.avatar);
  const category = AGENT_CATEGORIES[agent.category];
  const risk = RISK_LEVELS[agent.riskLevel];
  const riskColor = RISK_BADGE_VARIANT[agent.riskLevel];

  return (
    <Card
      className="group relative flex flex-col cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => onSelect?.(agent)}
    >
      <CardHeader>
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg text-white",
              category.color
            )}
          >
            <Icon className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-base">{agent.name}</CardTitle>

            {/* Category badge */}
            <Badge
              variant="secondary"
              className={cn("mt-1 text-[10px]", category.color, "text-white")}
            >
              {category.label}
            </Badge>
          </div>
        </div>

        <CardDescription className="mt-2 line-clamp-2 text-xs">
          {agent.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        {/* Meta row: risk level, model, local-friendly */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Risk level */}
          <Badge
            variant="outline"
            className={cn("text-[10px]", riskColor.bg, riskColor.text)}
          >
            {risk.label}
          </Badge>

          {/* Model */}
          <Badge variant="outline" className="text-[10px]">
            <Cpu className="mr-1 size-3" />
            {agent.defaultModel}
          </Badge>

          {/* Local-friendly */}
          {agent.localFriendly && (
            <Badge
              variant="outline"
              className="text-[10px] bg-emerald-500/10 text-emerald-500"
            >
              Yerel
            </Badge>
          )}
        </div>

        {/* Tags */}
        {agent.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {agent.tags.slice(0, 4).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] font-normal"
              >
                {tag}
              </Badge>
            ))}
            {agent.tags.length > 4 && (
              <Badge variant="secondary" className="text-[10px] font-normal">
                +{agent.tags.length - 4}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            // Visual-only for now
          }}
        >
          <UserPlus className="mr-1.5 size-3.5" />
          Takıma Ekle
        </Button>
      </CardFooter>
    </Card>
  );
}
