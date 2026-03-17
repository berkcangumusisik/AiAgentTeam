"use client";

import { useState, useCallback } from "react";
import { nanoid } from "nanoid";
import type { TaskPriority, TaskStageConfig } from "@/lib/types";
import { useTeams } from "@/lib/hooks/use-teams";
import { useAgents } from "@/lib/hooks/use-agents";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react";

interface TaskCreateFormData {
  title: string;
  description: string;
  teamId: string;
  workingDirectory: string;
  priority: TaskPriority;
  stages: TaskStageConfig[];
}

interface TaskCreateFormProps {
  onSubmit: (data: TaskCreateFormData) => void;
}

const priorities: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Düşük" },
  { value: "medium", label: "Orta" },
  { value: "high", label: "Yüksek" },
  { value: "critical", label: "Kritik" },
];

export function TaskCreateForm({ onSubmit }: TaskCreateFormProps) {
  const { teams, loading: teamsLoading } = useTeams();
  const { allAgents } = useAgents();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teamId, setTeamId] = useState("");
  const [workingDirectory, setWorkingDirectory] = useState(".");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [stages, setStages] = useState<TaskStageConfig[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleTeamChange = useCallback(
    (selectedTeamId: string) => {
      setTeamId(selectedTeamId);
      const team = teams.find((t) => t.id === selectedTeamId);
      if (!team) {
        setStages([]);
        return;
      }

      const generatedStages: TaskStageConfig[] = team.agents
        .sort((a, b) => a.order - b.order)
        .map((teamAgent, index) => {
          const agent = allAgents.find((a) => a.id === teamAgent.agentId);
          return {
            id: nanoid(),
            name: agent?.name ?? `Aşama ${index + 1}`,
            agentId: teamAgent.agentId,
            description: agent
              ? `${agent.name} - ${teamAgent.role}`
              : teamAgent.role,
            order: index,
            dependsOn: [],
          };
        });

      setStages(generatedStages);
    },
    [teams, allAgents]
  );

  const moveStage = useCallback(
    (index: number, direction: "up" | "down") => {
      setStages((prev) => {
        const updated = [...prev];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= updated.length) return prev;

        [updated[index], updated[targetIndex]] = [
          updated[targetIndex],
          updated[index],
        ];

        return updated.map((stage, i) => ({ ...stage, order: i }));
      });
    },
    []
  );

  const updateStage = useCallback(
    (index: number, field: keyof TaskStageConfig, value: string) => {
      setStages((prev) =>
        prev.map((stage, i) =>
          i === index ? { ...stage, [field]: value } : stage
        )
      );
    },
    []
  );

  const removeStage = useCallback((index: number) => {
    setStages((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((stage, i) => ({ ...stage, order: i }))
    );
  }, []);

  const addStage = useCallback(() => {
    setStages((prev) => [
      ...prev,
      {
        id: nanoid(),
        name: `Aşama ${prev.length + 1}`,
        agentId: "",
        description: "",
        order: prev.length,
        dependsOn: [],
      },
    ]);
  }, []);

  const selectedTeam = teams.find((t) => t.id === teamId);
  const teamAgentIds = selectedTeam?.agents.map((a) => a.agentId) ?? [];
  const availableAgents = allAgents.filter((a) =>
    teamAgentIds.includes(a.id)
  );

  const canSubmit =
    title.trim() !== "" &&
    teamId !== "" &&
    stages.length > 0 &&
    stages.every((s) => s.name.trim() !== "" && s.agentId !== "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        teamId,
        workingDirectory: workingDirectory.trim() || ".",
        priority,
        stages,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Görev Detayları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="task-title"
              className="text-sm font-medium"
            >
              Başlık
            </label>
            <Input
              id="task-title"
              placeholder="Görev başlığını girin"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="task-description"
              className="text-sm font-medium"
            >
              Açıklama
            </label>
            <Textarea
              id="task-description"
              placeholder="Bu görevin ne yapması gerektiğini açıklayın"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Takım</label>
              <Select
                value={teamId}
                onValueChange={handleTeamChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      teamsLoading ? "Takımlar yükleniyor..." : "Takım seçin"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Öncelik</label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as TaskPriority)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="task-working-dir"
              className="text-sm font-medium"
            >
              Çalışma Dizini
            </label>
            <Input
              id="task-working-dir"
              placeholder="."
              value={workingDirectory}
              onChange={(e) => setWorkingDirectory(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Configurator */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>İş Hattı Aşamaları</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addStage}
              disabled={!teamId}
            >
              <Plus className="size-4" />
              Aşama Ekle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stages.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              {teamId
                ? "Yapılandırılmış aşama yok. Başlamak için bir aşama ekleyin."
                : "İş hattı aşamalarını otomatik oluşturmak için bir takım seçin."}
            </p>
          ) : (
            <div className="space-y-3">
              {stages.map((stage, index) => (
                <div key={stage.id}>
                  {index > 0 && <Separator className="mb-3" />}
                  <div className="flex items-start gap-3">
                    {/* Order controls */}
                    <div className="flex flex-col gap-1 pt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        disabled={index === 0}
                        onClick={() => moveStage(index, "up")}
                      >
                        <ArrowUp className="size-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        disabled={index === stages.length - 1}
                        onClick={() => moveStage(index, "down")}
                      >
                        <ArrowDown className="size-3" />
                      </Button>
                    </div>

                    {/* Stage details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                          {index + 1}
                        </span>
                        <Input
                          placeholder="Aşama adı"
                          value={stage.name}
                          onChange={(e) =>
                            updateStage(index, "name", e.target.value)
                          }
                          className="flex-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <Input
                          placeholder="Aşama açıklaması"
                          value={stage.description}
                          onChange={(e) =>
                            updateStage(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                        <Select
                          value={stage.agentId}
                          onValueChange={(v) =>
                            updateStage(index, "agentId", v)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Ajan seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableAgents.map((agent) => (
                              <SelectItem
                                key={agent.id}
                                value={agent.id}
                              >
                                {agent.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Remove button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="mt-1 text-muted-foreground hover:text-destructive"
                      onClick={() => removeStage(index)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={!canSubmit || submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" />}
          Görev Oluştur
        </Button>
      </div>
    </form>
  );
}
