import { NextRequest } from "next/server";
import { getTeamService } from "@/lib/services/team.service";
import { handleApiError } from "@/lib/utils/errors";

export async function GET(request: NextRequest) {
  try {
    const service = getTeamService();
    const { searchParams } = request.nextUrl;
    const agentsParam = searchParams.get("agents");
    if (!agentsParam) return Response.json([]);

    const agents = JSON.parse(agentsParam);
    const suggestions = await service.getTeamSuggestions(agents);
    return Response.json(suggestions);
  } catch (error) {
    return handleApiError(error);
  }
}
