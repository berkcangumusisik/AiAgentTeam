import { NextRequest } from "next/server";
import { getTaskService } from "@/lib/services/task.service";
import { handleApiError } from "@/lib/utils/errors";

export async function GET(request: NextRequest) {
  try {
    const service = getTaskService();
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");
    const teamId = searchParams.get("teamId");

    if (status) {
      const tasks = await service.getTasksByStatus(status as any);
      return Response.json(tasks);
    }
    if (teamId) {
      const tasks = await service.getTasksByTeamId(teamId);
      return Response.json(tasks);
    }

    const tasks = await service.getAllTasks();
    return Response.json(tasks);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const service = getTaskService();
    const body = await request.json();
    const task = await service.createTask(body);
    return Response.json(task, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
