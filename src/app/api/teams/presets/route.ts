import { getTeamService } from "@/lib/services/team.service";
import { handleApiError } from "@/lib/utils/errors";

export async function GET() {
  try {
    const service = getTeamService();
    const presets = await service.getPresets();
    return Response.json(presets);
  } catch (error) {
    return handleApiError(error);
  }
}
