import { NextRequest } from "next/server";
import { getWorkspaceService } from "@/lib/services/workspace.service";
import { handleApiError } from "@/lib/utils/errors";

export async function GET(request: NextRequest) {
  try {
    const service = getWorkspaceService();
    const { searchParams } = request.nextUrl;
    const dir = searchParams.get("dir") || process.cwd();
    const depth = parseInt(searchParams.get("depth") || "4");
    const tree = await service.getFileTree(dir, depth);
    return Response.json(tree);
  } catch (error) {
    return handleApiError(error);
  }
}
