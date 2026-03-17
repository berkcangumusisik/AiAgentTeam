import { getAgentService } from "@/lib/services/agent.service";
import { handleApiError } from "@/lib/utils/errors";

export async function GET() {
  try {
    const service = getAgentService();
    const agents = await service.getLibraryAgents();
    return Response.json(agents);
  } catch (error) {
    return handleApiError(error);
  }
}
