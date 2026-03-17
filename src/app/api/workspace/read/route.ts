import { NextRequest } from "next/server";
import { getWorkspaceService } from "@/lib/services/workspace.service";
import { handleApiError } from "@/lib/utils/errors";

export async function GET(request: NextRequest) {
  try {
    const service = getWorkspaceService();
    const { searchParams } = request.nextUrl;
    const filePath = searchParams.get("path");
    const rootDir = searchParams.get("rootDir") || process.cwd();

    if (!filePath) {
      return Response.json({ error: "path parameter required" }, { status: 400 });
    }

    const content = await service.readFile(filePath, rootDir);
    return Response.json({ content });
  } catch (error) {
    return handleApiError(error);
  }
}
