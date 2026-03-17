import type { Run, RunStatus, RunAgentState, FileChange, RunEvent, RunCost } from "@/lib/types";
import { getRunRepository } from "@/lib/repositories";
import { generateId } from "@/lib/utils/id";

export class RunService {
  private repo = getRunRepository();

  async getAllRuns(): Promise<Run[]> {
    return this.repo.findAll();
  }

  async getRunById(id: string): Promise<Run | null> {
    return this.repo.findById(id);
  }

  async getRunsByTaskId(taskId: string): Promise<Run[]> {
    return this.repo.findByTaskId(taskId);
  }

  async getActiveRuns(): Promise<Run[]> {
    return this.repo.findActive();
  }

  async createRun(taskId: string, teamId: string, agentStates: RunAgentState[]): Promise<Run> {
    const run: Run = {
      id: generateId("run"),
      taskId,
      teamId,
      status: "pending",
      agentStates,
      fileChanges: [],
      cost: { totalTokens: 0, inputTokens: 0, outputTokens: 0, estimatedCost: 0 },
      currentStageIndex: 0,
      startedAt: new Date().toISOString(),
    };
    return this.repo.create(run);
  }

  async updateRunStatus(id: string, status: RunStatus, error?: string): Promise<Run> {
    const update: Partial<Run> = { status };
    if (status === "completed" || status === "failed" || status === "stopped") {
      update.completedAt = new Date().toISOString();
    }
    if (error) update.error = error;
    return this.repo.update(id, update);
  }

  async updateAgentState(runId: string, agentId: string, state: Partial<RunAgentState>): Promise<Run> {
    const run = await this.repo.findById(runId);
    if (!run) throw new Error(`Run not found: ${runId}`);
    const agentStates = run.agentStates.map((s) =>
      s.agentId === agentId ? { ...s, ...state } : s
    );
    return this.repo.update(runId, { agentStates });
  }

  async addFileChange(runId: string, change: FileChange): Promise<Run> {
    const run = await this.repo.findById(runId);
    if (!run) throw new Error(`Run not found: ${runId}`);
    return this.repo.update(runId, {
      fileChanges: [...run.fileChanges, change],
    });
  }

  async updateCost(runId: string, cost: Partial<RunCost>): Promise<Run> {
    const run = await this.repo.findById(runId);
    if (!run) throw new Error(`Run not found: ${runId}`);
    return this.repo.update(runId, {
      cost: { ...run.cost, ...cost },
    });
  }

  async appendEvent(runId: string, event: Omit<RunEvent, "id" | "runId" | "timestamp">): Promise<void> {
    const fullEvent: RunEvent = {
      ...event,
      id: generateId("evt"),
      runId,
      timestamp: new Date().toISOString(),
    };
    await this.repo.appendEvent(runId, fullEvent);
  }

  async getEvents(runId: string, afterTimestamp?: string): Promise<RunEvent[]> {
    return this.repo.getEvents(runId, afterTimestamp);
  }

  async appendTerminalOutput(runId: string, output: string): Promise<void> {
    await this.repo.appendTerminalOutput(runId, output);
  }

  async getTerminalOutput(runId: string): Promise<string> {
    return this.repo.getTerminalOutput(runId);
  }
}

let instance: RunService;
export function getRunService(): RunService {
  if (!instance) instance = new RunService();
  return instance;
}
