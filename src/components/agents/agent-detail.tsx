"use client";

import { useState } from "react";
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
  Cpu,
  Shield,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ListChecks,
  Sparkles,
  Thermometer,
  Hash,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AGENT_CATEGORIES, RISK_LEVELS } from "@/lib/utils/constants";
import type { Agent } from "@/lib/types";

// ----------------------------------------------------------------
// Icon mapping (duplicated from agent-card for self-containment)
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

const RISK_BADGE_VARIANT: Record<string, { bg: string; text: string }> = {
  low: { bg: "bg-green-500/10", text: "text-green-500" },
  medium: { bg: "bg-yellow-500/10", text: "text-yellow-500" },
  high: { bg: "bg-red-500/10", text: "text-red-500" },
};

// ----------------------------------------------------------------
// Props
// ----------------------------------------------------------------
interface AgentDetailProps {
  agent: Agent;
}

export function AgentDetail({ agent }: AgentDetailProps) {
  const [showPrompt, setShowPrompt] = useState(false);

  const Icon = getAgentIcon(agent.avatar);
  const category = AGENT_CATEGORIES[agent.category];
  const risk = RISK_LEVELS[agent.riskLevel];
  const riskColor = RISK_BADGE_VARIANT[agent.riskLevel];

  return (
    <div className="space-y-6">
      {/* Header card */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex size-14 shrink-0 items-center justify-center rounded-xl text-white",
                category.color
              )}
            >
              <Icon className="size-7" />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <CardTitle className="text-xl">{agent.name}</CardTitle>
              <CardDescription className="text-sm">
                {agent.description}
              </CardDescription>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                {/* Category badge */}
                <Badge
                  variant="secondary"
                  className={cn("text-xs", category.color, "text-white")}
                >
                  {category.label}
                </Badge>

                {/* Risk level */}
                <Badge
                  variant="outline"
                  className={cn("text-xs", riskColor.bg, riskColor.text)}
                >
                  {risk.label}
                </Badge>

                {/* Model */}
                <Badge variant="outline" className="text-xs">
                  <Cpu className="mr-1 size-3" />
                  {agent.defaultModel}
                </Badge>

                {/* Local-friendly */}
                {agent.localFriendly && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-emerald-500/10 text-emerald-500"
                  >
                    Yerel Uyumlu
                  </Badge>
                )}

                {/* Library / Active flags */}
                {agent.isLibrary && (
                  <Badge variant="outline" className="text-xs">
                    Kütüphane
                  </Badge>
                )}
                {!agent.isActive && (
                  <Badge variant="destructive" className="text-xs">
                    Pasif
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Responsibilities */}
      {agent.responsibilities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="size-4" />
              Sorumluluklar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {agent.responsibilities.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Suggested Tasks */}
      {agent.suggestedTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ListChecks className="size-4" />
              Önerilen Görevler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {agent.suggestedTasks.map((task, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-muted-foreground" />
                  {task}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Capabilities */}
      {agent.capabilities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4" />
              Yetenekler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {agent.capabilities.map((cap, i) => (
                <div
                  key={i}
                  className="rounded-lg border p-3"
                >
                  <p className="text-sm font-medium">{cap.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {cap.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Model & Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Cpu className="size-4" />
            Model Yapılandırması
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Varsayılan Model</p>
              <p className="text-sm font-medium">{agent.defaultModel}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Thermometer className="size-3" />
                Sıcaklık
              </p>
              <p className="text-sm font-medium">{agent.temperature}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Hash className="size-3" />
                Maks Token
              </p>
              <p className="text-sm font-medium">
                {agent.maxTokens.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {agent.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Etiketler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {agent.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Prompt (collapsible) */}
      {agent.systemPrompt && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Sistem Prompt'u</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrompt((prev) => !prev)}
              >
                {showPrompt ? (
                  <>
                    <ChevronUp className="mr-1 size-4" />
                    Gizle
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-1 size-4" />
                    Göster
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          {showPrompt && (
            <CardContent>
              <Separator className="mb-4" />
              <pre className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-xs leading-relaxed">
                {agent.systemPrompt}
              </pre>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
