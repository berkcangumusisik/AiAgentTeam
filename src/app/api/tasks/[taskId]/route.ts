import { NextRequest } from "next/server";
import { getTaskService } from "@/lib/services/task.service";
import { handleApiError, NotFoundError } from "@/lib/utils/errors";

type RouteContext = { params: Promise<{ taskId: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { taskId } = await context.params;
    const service = getTaskService();
    const task = await service.getTaskById(taskId);
    if (!task) throw new NotFoundError("Task", taskId);
    return Response.json(task);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { taskId } = await context.params;
    const service = getTaskService();
    const body = await request.json();
    const task = await service.updateTask(taskId, body);
    return Response.json(task);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { taskId } = await context.params;
    const service = getTaskService();
    await service.deleteTask(taskId);
    return Response.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
