import fs from "fs/promises";
import path from "path";
import type { FileTreeNode } from "@/lib/types";

const EXCLUDE_PATTERNS = [
  "node_modules",
  ".git",
  ".next",
  ".cache",
  "dist",
  "build",
  "__pycache__",
  ".env",
  ".env.local",
];

export class WorkspaceService {
  async getFileTree(rootDir: string, maxDepth: number = 4): Promise<FileTreeNode[]> {
    return this.buildTree(rootDir, 0, maxDepth);
  }

  private async buildTree(dirPath: string, depth: number, maxDepth: number): Promise<FileTreeNode[]> {
    if (depth >= maxDepth) return [];

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      const nodes: FileTreeNode[] = [];

      for (const entry of entries) {
        if (EXCLUDE_PATTERNS.includes(entry.name)) continue;
        if (entry.name.startsWith(".") && depth === 0) continue;

        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          const children = await this.buildTree(fullPath, depth + 1, maxDepth);
          nodes.push({
            name: entry.name,
            path: fullPath,
            type: "directory",
            children,
          });
        } else {
          const stats = await fs.stat(fullPath).catch(() => null);
          nodes.push({
            name: entry.name,
            path: fullPath,
            type: "file",
            size: stats?.size,
            extension: path.extname(entry.name),
          });
        }
      }

      return nodes.sort((a, b) => {
        if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
    } catch {
      return [];
    }
  }

  async readFile(filePath: string, rootDir: string): Promise<string> {
    // Prevent directory traversal
    const resolved = path.resolve(filePath);
    const root = path.resolve(rootDir);
    if (!resolved.startsWith(root)) {
      throw new Error("Access denied: path outside workspace");
    }
    return fs.readFile(resolved, "utf-8");
  }
}

let instance: WorkspaceService;
export function getWorkspaceService(): WorkspaceService {
  if (!instance) instance = new WorkspaceService();
  return instance;
}
