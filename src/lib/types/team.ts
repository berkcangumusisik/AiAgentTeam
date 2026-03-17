export interface TeamAgent {
  agentId: string;
  role: string;
  modelOverride?: string;
  accessLevel: "full" | "read-only" | "restricted";
  order: number;
}

export interface TeamModelPolicy {
  defaultProvider: string;
  defaultModel: string;
  budgetLimit?: number;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  agents: TeamAgent[];
  modelPolicy: TeamModelPolicy;
  isPreset: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
