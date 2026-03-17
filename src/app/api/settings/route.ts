import { NextRequest } from "next/server";
import { getSettingsRepository } from "@/lib/repositories";
import { handleApiError } from "@/lib/utils/errors";

export async function GET() {
  try {
    const repo = getSettingsRepository();
    const settings = await repo.get();
    return Response.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const repo = getSettingsRepository();
    const body = await request.json();
    const settings = await repo.update(body);
    return Response.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
}
