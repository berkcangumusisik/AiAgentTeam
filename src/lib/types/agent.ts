export type AgentCategory =
  | "product-planning"
  | "design-experience"
  | "engineering"
  | "quality"
  | "operations"
  | "knowledge-support";

export type RiskLevel = "low" | "medium" | "high";

export interface AgentCapability {
  name: string;
  description: string;
}

export interface Agent {
  id: string;
  name: string;
  category: AgentCategory;
  description: string;
  avatar: string; // lucide icon name
  responsibilities: string[];
  suggestedTasks: string[];
  systemPrompt: string;
  capabilities: AgentCapability[];
  defaultModel: string;
  riskLevel: RiskLevel;
  localFriendly: boolean;
  maxTokens: number;
  temperature: number;
  tags: string[];
  isLibrary: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
