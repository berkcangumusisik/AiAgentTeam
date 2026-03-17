"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Search, Save, Users } from "lucide-react";
import { toast } from "sonner";
import type { Team, TeamAgent, Agent, AgentCategory } from "@/lib/types";
import { useAgents } from "@/lib/hooks/use-agents";
import { useTeams } from "@/lib/hooks/use-teams";
import { AGENT_CATEGORIES } from "@/lib/utils/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamAgentSlot } from "@/components/teams/team-agent-slot";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

interface TeamBuilderProps {
  existingTeam?: Team;
  onSaved?: () => void;
}

export function TeamBuilder({ existingTeam, onSaved }: TeamBuilderProps) {
  const { allAgents, loading: agentsLoading } = useAgents();
  const { createTeam, updateTeam } = useTeams();

  const isEditMode = Boolean(existingTeam);

  // Local form state
  const [name, setName] = useState(existingTeam?.name ?? "");
  const [description, setDescription] = useState(
    existingTeam?.description ?? ""
  );
  const [teamAgents, setTeamAgents] = useState<TeamAgent[]>(
    existingTeam?.agents ?? []
  );
  const [defaultProvider, setDefaultProvider] = useState(
    existingTeam?.modelPolicy.defaultProvider ?? "ollama"
  );
  const [defaultModel, setDefaultModel] = useState(
    existingTeam?.modelPolicy.defaultModel ?? "llama3.1:8b"
  );
  const [budgetLimit, setBudgetLimit] = useState<string>(
    existingTeam?.modelPolicy.budgetLimit?.toString() ?? ""
  );
  const [saving, setSaving] = useState(false);

  // Agent filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Populate form when existingTeam loads or changes
  useEffect(() => {
    if (existingTeam) {
      setName(existingTeam.name);
      setDescription(existingTeam.description);
      setTeamAgents(existingTeam.agents);
      setDefaultProvider(existingTeam.modelPolicy.defaultProvider);
      setDefaultModel(existingTeam.modelPolicy.defaultModel);
      setBudgetLimit(existingTeam.modelPolicy.budgetLimit?.toString() ?? "");
    }
  }, [existingTeam]);

  // Filter available agents
  const filteredAgents = useMemo(() => {
    return allAgents.filter((agent) => {
      const matchesSearch =
        searchQuery === "" ||
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || agent.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [allAgents, searchQuery, categoryFilter]);

  // Set of agent IDs already in the team
  const teamAgentIds = useMemo(
    () => new Set(teamAgents.map((ta) => ta.agentId)),
    [teamAgents]
  );

  // Agent name lookup
  const agentNameMap = useMemo(() => {
    const map = new Map<string, string>();
    allAgents.forEach((agent) => map.set(agent.id, agent.name));
    return map;
  }, [allAgents]);

  const handleAddAgent = useCallback(
    (agent: Agent) => {
      if (teamAgentIds.has(agent.id)) return;

      const newTeamAgent: TeamAgent = {
        agentId: agent.id,
        role: "",
        accessLevel: "full",
        order: teamAgents.length,
      };

      setTeamAgents((prev) => [...prev, newTeamAgent]);
    },
    [teamAgentIds, teamAgents.length]
  );

  const handleUpdateAgent = useCallback((updated: TeamAgent) => {
    setTeamAgents((prev) =>
      prev.map((ta) => (ta.agentId === updated.agentId ? updated : ta))
    );
  }, []);

  const handleRemoveAgent = useCallback((agentId: string) => {
    setTeamAgents((prev) =>
      prev
        .filter((ta) => ta.agentId !== agentId)
        .map((ta, idx) => ({ ...ta, order: idx }))
    );
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Takım adı gereklidir");
      return;
    }

    if (teamAgents.length === 0) {
      toast.error("Takıma en az bir ajan ekleyin");
      return;
    }

    setSaving(true);
    try {
      const teamData: Partial<Team> = {
        name: name.trim(),
        description: description.trim(),
        agents: teamAgents,
        modelPolicy: {
          defaultProvider,
          defaultModel,
          budgetLimit: budgetLimit ? parseFloat(budgetLimit) : undefined,
        },
        isPreset: false,
        isActive: true,
        tags: [],
      };

      if (isEditMode && existingTeam) {
        await updateTeam(existingTeam.id, teamData);
        toast.success("Takım başarıyla güncellendi");
      } else {
        await createTeam(teamData);
        toast.success("Takım başarıyla oluşturuldu");
      }

      onSaved?.();
    } catch {
      toast.error(isEditMode ? "Takım güncellenemedi" : "Takım oluşturulamadı");
    } finally {
      setSaving(false);
    }
  };

  if (agentsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left column: Available agents */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mevcut Ajanlar</CardTitle>
            <CardDescription>
              Takım bileşiminize ajan arayın ve ekleyin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Search and filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Ajan ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  {Object.entries(AGENT_CATEGORIES).map(([key, cat]) => (
                    <SelectItem key={key} value={key}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Agent list */}
            <ScrollArea className="h-[400px]">
              <div className="space-y-2 pr-3">
                {filteredAgents.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Ajan bulunamadı
                  </p>
                ) : (
                  filteredAgents.map((agent) => {
                    const isInTeam = teamAgentIds.has(agent.id);
                    const categoryMeta =
                      AGENT_CATEGORIES[
                        agent.category as keyof typeof AGENT_CATEGORIES
                      ];

                    return (
                      <div
                        key={agent.id}
                        className={cn(
                          "flex items-center justify-between rounded-lg border p-3 transition-colors",
                          isInTeam
                            ? "border-primary/30 bg-primary/5"
                            : "hover:bg-accent/50"
                        )}
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">
                              {agent.name}
                            </span>
                            {categoryMeta && (
                              <Badge variant="outline" className="text-xs shrink-0">
                                {categoryMeta.label}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {agent.description}
                          </p>
                        </div>
                        <Button
                          variant={isInTeam ? "secondary" : "outline"}
                          size="sm"
                          className="ml-2 shrink-0"
                          disabled={isInTeam}
                          onClick={() => handleAddAgent(agent)}
                        >
                          {isInTeam ? (
                            "Eklendi"
                          ) : (
                            <>
                              <Plus className="size-3.5" />
                              Ekle
                            </>
                          )}
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Right column: Team composition */}
      <div className="space-y-4">
        {/* Team info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Takım Detayları</CardTitle>
            <CardDescription>
              Takım adını, açıklamasını ve model politikasını yapılandırın
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Takım Adı</label>
              <Input
                placeholder="ör. Full Stack Geliştirme Takımı"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Açıklama</label>
              <Textarea
                placeholder="Takımın amacını ve sorumluluklarını açıklayın..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <Separator />

            {/* Model policy */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Model Politikası</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">
                    Varsayılan Sağlayıcı
                  </label>
                  <Input
                    placeholder="ör. openai"
                    value={defaultProvider}
                    onChange={(e) => setDefaultProvider(e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">
                    Varsayılan Model
                  </label>
                  <Input
                    placeholder="ör. gpt-4o"
                    value={defaultModel}
                    onChange={(e) => setDefaultModel(e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">
                  Bütçe Limiti (isteğe bağlı)
                </label>
                <Input
                  type="number"
                  placeholder="ör. 10.00"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  className="h-8"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team composition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4" />
              Takım Bileşimi
              <Badge variant="secondary">{teamAgents.length}</Badge>
            </CardTitle>
            <CardDescription>
              Her ajanın rolünü, model geçersiz kılmasını ve erişim seviyesini yapılandırın
            </CardDescription>
          </CardHeader>
          <CardContent>
            {teamAgents.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
                <Users className="mb-2 size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Henüz ajan eklenmedi
                </p>
                <p className="text-xs text-muted-foreground">
                  Soldaki listeden ajan ekleyin
                </p>
              </div>
            ) : (
              <ScrollArea className="max-h-[400px]">
                <div className="space-y-3 pr-3">
                  {teamAgents.map((ta) => (
                    <TeamAgentSlot
                      key={ta.agentId}
                      teamAgent={ta}
                      agentName={agentNameMap.get(ta.agentId) ?? "Bilinmeyen Ajan"}
                      onUpdate={handleUpdateAgent}
                      onRemove={handleRemoveAgent}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Save className="size-4" />
            )}
            {isEditMode ? "Takımı Güncelle" : "Takım Oluştur"}
          </Button>
        </div>
      </div>
    </div>
  );
}
