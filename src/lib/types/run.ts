export type RunStatus = "pending" | "running" | "paused" | "completed" | "failed" | "stopped";

export interface RunAgentState {
  agentId: string;
  agentName: string;
  status: "idle" | "thinking" | "tool-calling" | "done" | "error";
  currentActivity?: string;
  tokensUsed: number;
  startedAt?: string;
  completedAt?: string;
}

export interface FileChange {
  path: string;
  type: "created" | "modified" | "deleted";
  diff?: string;
}

export interface RunCost {
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
}

export interface Run {
  id: string;
  taskId: string;
  teamId: string;
  status: RunStatus;
  agentStates: RunAgentState[];
  fileChanges: FileChange[];
  cost: RunCost;
  currentStageIndex: number;
  currentAgentId?: string;
  startedAt: string;
  completedAt?: string;
  error?: string;
}
