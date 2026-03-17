import { NextRequest } from "next/server";
import { getRunService } from "@/lib/services/run.service";
import { getOrchestrator } from "@/lib/engine/orchestrator";
import { handleApiError, NotFoundError } from "@/lib/utils/errors";

type RouteContext = { params: Promise<{ runId: string }> };

export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    const { runId } = await context.params;
    const service = getRunService();
    const run = await service.getRunById(runId);
    if (!run) throw new NotFoundError("Run", runId);

    const orchestrator = getOrchestrator();
    orchestrator.stop(runId);

    const updated = await service.updateRunStatus(runId, "stopped");
    return Response.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
