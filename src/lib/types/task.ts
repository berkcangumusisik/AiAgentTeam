export type TaskStatus = "draft" | "ready" | "running" | "completed" | "failed" | "cancelled";

export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface TaskStageConfig {
  id: string;
  name: string;
  agentId: string;
  description: string;
  order: number;
  dependsOn: string[];
}

export interface TaskStage extends TaskStageConfig {
  status: TaskStatus;
  startedAt?: string;
  completedAt?: string;
  output?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  teamId: string;
  workingDirectory: string;
  priority: TaskPriority;
  status: TaskStatus;
  stages: TaskStage[];
  currentStageIndex: number;
  runId?: string;
  createdAt: string;
  updatedAt: string;
}
