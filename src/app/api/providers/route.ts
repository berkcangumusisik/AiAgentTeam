import { NextRequest } from "next/server";
import { getProviderService } from "@/lib/services/provider.service";
import { handleApiError } from "@/lib/utils/errors";

export async function GET() {
  try {
    const service = getProviderService();
    const providers = await service.getAllProviders();
    return Response.json(providers);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const service = getProviderService();
    const body = await request.json();

    if (Array.isArray(body)) {
      await service.updateAllProviders(body);
      return Response.json({ success: true });
    }

    const { name, ...data } = body;
    const provider = await service.updateProvider(name, data);
    return Response.json(provider);
  } catch (error) {
    return handleApiError(error);
  }
}
