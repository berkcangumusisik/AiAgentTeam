import type { Agent } from "@/lib/types";
import { AgentCard } from "@/components/agents/agent-card";

interface AgentGridProps {
  agents: Agent[];
  onSelectAgent?: (agent: Agent) => void;
}

export function AgentGrid({ agents, onSelectAgent }: AgentGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} onSelect={onSelectAgent} />
      ))}
    </div>
  );
}
