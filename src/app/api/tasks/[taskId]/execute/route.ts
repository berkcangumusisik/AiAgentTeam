import { NextRequest } from "next/server";
import { getTaskService } from "@/lib/services/task.service";
import { getRunService } from "@/lib/services/run.service";
import { getTeamService } from "@/lib/services/team.service";
import { getAgentService } from "@/lib/services/agent.service";
import { handleApiError, NotFoundError } from "@/lib/utils/errors";
import { getOrchestrator } from "@/lib/engine/orchestrator";

type RouteContext = { params: Promise<{ taskId: string }> };

export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    const { taskId } = await context.params;
    const taskService = getTaskService();
    const runService = getRunService();
    const teamService = getTeamService();
    const agentService = getAgentService();

    const task = await taskService.getTaskById(taskId);
    if (!task) throw new NotFoundError("Task", taskId);

    const team = await teamService.getTeamById(task.teamId);
    if (!team) throw new NotFoundError("Team", task.teamId);

    // Build agent states
    const agentStates = [];
    for (const ta of team.agents) {
      const agent = await agentService.getAgentById(ta.agentId);
      if (agent) {
        agentStates.push({
          agentId: agent.id,
          agentName: agent.name,
          status: "idle" as const,
          tokensUsed: 0,
        });
      }
    }

    // Create run
    const run = await runService.createRun(taskId, team.id, agentStates);

    // Update task
    await taskService.updateTask(taskId, {
      status: "running",
      runId: run.id,
    });

    // Start orchestrator in background
    const orchestrator = getOrchestrator();
    orchestrator.execute(run.id, task, team).catch((err) => {
      console.error("Orchestrator error:", err);
    });

    return Response.json({ runId: run.id }, { status: 202 });
  } catch (error) {
    return handleApiError(error);
  }
}
