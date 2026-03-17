import { NextRequest } from "next/server";
import { getTeamService } from "@/lib/services/team.service";
import { handleApiError, NotFoundError } from "@/lib/utils/errors";

type RouteContext = { params: Promise<{ teamId: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { teamId } = await context.params;
    const service = getTeamService();
    const team = await service.getTeamById(teamId);
    if (!team) throw new NotFoundError("Team", teamId);
    return Response.json(team);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { teamId } = await context.params;
    const service = getTeamService();
    const body = await request.json();
    const team = await service.updateTeam(teamId, body);
    return Response.json(team);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { teamId } = await context.params;
    const service = getTeamService();
    await service.deleteTeam(teamId);
    return Response.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
