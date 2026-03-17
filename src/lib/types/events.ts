export type RunEventType =
  | "run:started"
  | "run:completed"
  | "run:failed"
  | "run:stopped"
  | "stage:started"
  | "stage:completed"
  | "stage:failed"
  | "agent:thinking"
  | "agent:response"
  | "agent:tool-call"
  | "agent:tool-result"
  | "agent:error"
  | "agent:done"
  | "terminal:output"
  | "file:changed"
  | "cost:updated"
  | "log:info"
  | "log:warn"
  | "log:error";

export interface RunEvent {
  id: string;
  runId: string;
  type: RunEventType;
  agentId?: string;
  agentName?: string;
  stageId?: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp: string;
}
