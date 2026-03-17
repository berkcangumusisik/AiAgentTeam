import { NextRequest } from "next/server";
import { getRunService } from "@/lib/services/run.service";
import { handleApiError, NotFoundError } from "@/lib/utils/errors";

type RouteContext = { params: Promise<{ runId: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { runId } = await context.params;
    const service = getRunService();
    const run = await service.getRunById(runId);
    if (!run) throw new NotFoundError("Run", runId);
    return Response.json(run);
  } catch (error) {
    return handleApiError(error);
  }
}
