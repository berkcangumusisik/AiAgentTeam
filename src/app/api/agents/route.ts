import { NextRequest } from "next/server";
import { getAgentService } from "@/lib/services/agent.service";
import { handleApiError } from "@/lib/utils/errors";

export async function GET(request: NextRequest) {
  try {
    const service = getAgentService();
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    if (search) {
      const agents = await service.searchAgents(search);
      return Response.json(agents);
    }

    if (category) {
      const agents = await service.getAgentsByCategory(category as any);
      return Response.json(agents);
    }

    const agents = await service.getAllAgents();
    return Response.json(agents);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const service = getAgentService();
    const body = await request.json();
    const agent = await service.createCustomAgent(body);
    return Response.json(agent, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
