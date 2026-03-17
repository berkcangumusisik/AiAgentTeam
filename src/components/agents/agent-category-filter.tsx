"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AGENT_CATEGORIES } from "@/lib/utils/constants";
import type { AgentCategory } from "@/lib/types";

interface AgentCategoryFilterProps {
  selected: AgentCategory | "all";
  onSelect: (category: AgentCategory | "all") => void;
}

export function AgentCategoryFilter({
  selected,
  onSelect,
}: AgentCategoryFilterProps) {
  return (
    <Tabs
      value={selected}
      onValueChange={(value) => onSelect(value as AgentCategory | "all")}
    >
      <TabsList className="h-auto flex-wrap">
        <TabsTrigger value="all">Tümü</TabsTrigger>
        {(
          Object.entries(AGENT_CATEGORIES) as [
            AgentCategory,
            (typeof AGENT_CATEGORIES)[AgentCategory],
          ][]
        ).map(([key, cat]) => (
          <TabsTrigger key={key} value={key}>
            {cat.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
