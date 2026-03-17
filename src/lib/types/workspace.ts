export interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileTreeNode[];
  size?: number;
  extension?: string;
}

export interface WorkspaceConfig {
  rootDir: string;
  excludePatterns: string[];
  maxDepth: number;
}
