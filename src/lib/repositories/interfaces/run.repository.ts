import type { Run, RunEvent } from "@/lib/types";
import type { IRepository } from "./base.repository";

export interface IRunRepository extends IRepository<Run> {
  findByTaskId(taskId: string): Promise<Run[]>;
  findActive(): Promise<Run[]>;
  appendEvent(runId: string, event: RunEvent): Promise<void>;
  getEvents(runId: string, afterTimestamp?: string): Promise<RunEvent[]>;
  appendTerminalOutput(runId: string, output: string): Promise<void>;
  getTerminalOutput(runId: string): Promise<string>;
}
