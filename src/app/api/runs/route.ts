import { getRunService } from "@/lib/services/run.service";
import { handleApiError } from "@/lib/utils/errors";

export async function GET() {
  try {
    const service = getRunService();
    const runs = await service.getAllRuns();
    return Response.json(runs);
  } catch (error) {
    return handleApiError(error);
  }
}
