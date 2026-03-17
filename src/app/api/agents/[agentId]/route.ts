import { NextRequest } from "next/server";
import { getAgentService } from "@/lib/services/agent.service";
import { handleApiError, NotFoundError } from "@/lib/utils/errors";

type RouteContext = { params: Promise<{ agentId: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { agentId } = await context.params;
    const service = getAgentService();
    const agent = await service.getAgentById(agentId);
    if (!agent) throw new NotFoundError("Agent", agentId);
    return Response.json(agent);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { agentId } = await context.params;
    const service = getAgentService();
    const body = await request.json();
    const agent = await service.updateAgent(agentId, body);
    return Response.json(agent);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { agentId } = await context.params;
    const service = getAgentService();
    await service.deleteAgent(agentId);
    return Response.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
