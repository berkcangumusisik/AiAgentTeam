import { NextRequest } from "next/server";
import { getTeamService } from "@/lib/services/team.service";
import { handleApiError } from "@/lib/utils/errors";

export async function GET() {
  try {
    const service = getTeamService();
    const teams = await service.getAllTeams();
    return Response.json(teams);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const service = getTeamService();
    const body = await request.json();
    const team = await service.createTeam(body);
    return Response.json(team, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
