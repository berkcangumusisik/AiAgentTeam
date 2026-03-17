import type { Task, Team } from "@/lib/types";
import { getRunService } from "@/lib/services/run.service";
import { getTaskService } from "@/lib/services/task.service";
import { getAgentService } from "@/lib/services/agent.service";
import { AgentExecutor } from "./executor";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger("Orchestrator");

export class Orchestrator {
  private activeRuns = new Map<string, AbortController>();
  private executor = new AgentExecutor();

  async execute(runId: string, task: Task, team: Team): Promise<void> {
    const runService = getRunService();
    const taskService = getTaskService();
    const agentService = getAgentService();

    const abortController = new AbortController();
    this.activeRuns.set(runId, abortController);

    try {
      await runService.updateRunStatus(runId, "running");
      await runService.appendEvent(runId, {
        type: "run:started",
        message: `Run started for task "${task.title}"`,
      });

      let stageContext = "";

      for (let i = 0; i < task.stages.length; i++) {
        if (abortController.signal.aborted) {
          throw new Error("Run was stopped");
        }

        const stage = task.stages[i];
        const teamAgent = team.agents.find((a) => a.agentId === stage.agentId);
        if (!teamAgent) {
          logger.warn(`No team agent found for stage ${stage.name}, skipping`);
          continue;
        }

        const agent = await agentService.getAgentById(teamAgent.agentId);
        if (!agent) {
          logger.warn(`Agent not found: ${teamAgent.agentId}, skipping`);
          continue;
        }

        // Update run stage
        await runService.updateRunStatus(runId, "running");
        const run = await runService.getRunById(runId);
        if (run) {
          await runService.updateAgentState(runId, agent.id, {
            status: "thinking",
            startedAt: new Date().toISOString(),
          });
        }

        await runService.appendEvent(runId, {
          type: "stage:started",
          agentId: agent.id,
          agentName: agent.name,
          stageId: stage.id,
          message: `Stage "${stage.name}" started with agent ${agent.name}`,
        });

        // Update task stage
        task.stages[i].status = "running";
        task.stages[i].startedAt = new Date().toISOString();
        task.currentStageIndex = i;
        await taskService.updateTask(task.id, {
          stages: task.stages,
          currentStageIndex: i,
        });

        try {
          // Use team agent's model override, or team's default model policy
          const modelOverride = teamAgent.modelOverride || team.modelPolicy.defaultModel;

          const result = await this.executor.execute(
            agent,
            task,
            stage,
            runId,
            stageContext || undefined,
            abortController.signal,
            modelOverride
          );

          // Accumulate context for next stage
          stageContext += `\n\n### Output from ${agent.name} (${stage.name}):\n${result.output}`;

          // Track file changes
          for (const change of result.fileChanges) {
            await runService.addFileChange(runId, change);
          }

          task.stages[i].status = "completed";
          task.stages[i].completedAt = new Date().toISOString();
          task.stages[i].output = result.output.substring(0, 5000);
          await taskService.updateTask(task.id, { stages: task.stages });

          await runService.appendEvent(runId, {
            type: "stage:completed",
            agentId: agent.id,
            agentName: agent.name,
            stageId: stage.id,
            message: `Stage "${stage.name}" completed`,
          });
        } catch (stageError: unknown) {
          const msg = stageError instanceof Error ? stageError.message : "Stage failed";
          task.stages[i].status = "failed";
          await taskService.updateTask(task.id, { stages: task.stages });

          await runService.appendEvent(runId, {
            type: "stage:failed",
            agentId: agent.id,
            agentName: agent.name,
            stageId: stage.id,
            message: `Stage "${stage.name}" failed: ${msg}`,
          });

          throw stageError;
        }
      }

      // All stages completed
      await taskService.updateTask(task.id, { status: "completed" });
      await runService.updateRunStatus(runId, "completed");
      await runService.appendEvent(runId, {
        type: "run:completed",
        message: `Run completed successfully for task "${task.title}"`,
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      logger.error(`Run ${runId} failed: ${msg}`);

      if (abortController.signal.aborted) {
        await runService.updateRunStatus(runId, "stopped");
        await runService.appendEvent(runId, {
          type: "run:stopped",
          message: "Run was stopped by user",
        });
      } else {
        await taskService.updateTask(task.id, { status: "failed" });
        await runService.updateRunStatus(runId, "failed", msg);
        await runService.appendEvent(runId, {
          type: "run:failed",
          message: `Run failed: ${msg}`,
        });
      }
    } finally {
      this.activeRuns.delete(runId);
    }
  }

  stop(runId: string): void {
    const controller = this.activeRuns.get(runId);
    if (controller) {
      controller.abort();
    }
  }

  isRunning(runId: string): boolean {
    return this.activeRuns.has(runId);
  }
}

let instance: Orchestrator;
export function getOrchestrator(): Orchestrator {
  if (!instance) instance = new Orchestrator();
  return instance;
}
