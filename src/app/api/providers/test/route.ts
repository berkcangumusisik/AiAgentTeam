import { NextRequest } from "next/server";
import { getProviderService } from "@/lib/services/provider.service";
import { handleApiError } from "@/lib/utils/errors";

export async function POST(request: NextRequest) {
  try {
    const service = getProviderService();
    const { name } = await request.json();
    const result = await service.testConnection(name);
    return Response.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
