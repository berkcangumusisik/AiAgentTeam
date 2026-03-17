import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";

export interface ToolResult {
  output: string;
  error?: string;
}

export class ToolRunner {
  private normalizedRoot: string;

  constructor(
    private workingDir: string,
    private readOnly: boolean = false
  ) {
    // Ensure workingDir has a sensible default
    this.workingDir = workingDir || process.cwd();
    this.normalizedRoot = this.normalizePath(this.workingDir);
  }

  /**
   * Normalize a path for consistent comparison across platforms.
   * Handles: URL-encoded chars (%C3%B6 -> ö), forward/back slashes, case on Windows.
   */
  private normalizePath(p: string): string {
    // Decode URI-encoded characters (e.g. %C3%B6 -> ö, %20 -> space)
    try {
      p = decodeURIComponent(p);
    } catch {
      // If decoding fails, use as-is
    }
    // Resolve to absolute, normalize slashes
    const resolved = path.resolve(p);
    // On Windows, normalize case for comparison
    if (process.platform === "win32") {
      return resolved.toLowerCase();
    }
    return resolved;
  }

  /**
   * Resolve a path from tool call arguments.
   * Accepts both relative and absolute paths.
   * Absolute paths must still be within the workspace.
   */
  private resolvePath(inputPath: string): string {
    // Decode URI-encoded characters first
    try {
      inputPath = decodeURIComponent(inputPath);
    } catch {
      // If decoding fails, use as-is
    }

    let resolved: string;

    // Check if the path is absolute
    if (path.isAbsolute(inputPath)) {
      resolved = path.resolve(inputPath);
    } else {
      resolved = path.resolve(this.workingDir, inputPath);
    }

    // Security check: ensure the resolved path is within the workspace
    const normalizedResolved = this.normalizePath(resolved);
    if (!normalizedResolved.startsWith(this.normalizedRoot)) {
      throw new Error(
        `Erişim engellendi: "${inputPath}" yolu çalışma dizini dışında.\n` +
        `Çalışma dizini: ${this.workingDir}\n` +
        `Çözümlenen yol: ${resolved}\n` +
        `Lütfen çalışma dizini içindeki göreli yolları kullanın.`
      );
    }

    return resolved;
  }

  async execute(toolName: string, args: Record<string, unknown>): Promise<ToolResult> {
    try {
      switch (toolName) {
        case "file_read":
          return this.fileRead(args.path as string);
        case "file_write":
          return this.fileWrite(args.path as string, args.content as string);
        case "file_list":
          return this.fileList(args.path as string);
        case "file_search":
          return this.fileSearch(args.path as string, args.pattern as string);
        case "terminal_exec":
          return this.terminalExec(args.command as string);
        default:
          return { output: "", error: `Bilinmeyen araç: ${toolName}` };
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Araç yürütme başarısız";
      return { output: "", error: message };
    }
  }

  private async fileRead(filePath: string): Promise<ToolResult> {
    const resolved = this.resolvePath(filePath);
    try {
      const content = await fs.readFile(resolved, "utf-8");
      return { output: content };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Dosya okunamadı";
      if (msg.includes("ENOENT")) {
        return { output: "", error: `Dosya bulunamadı: ${filePath}` };
      }
      return { output: "", error: msg };
    }
  }

  private async fileWrite(filePath: string, content: string): Promise<ToolResult> {
    if (this.readOnly) {
      return { output: "", error: "Bu ajan için yazma erişimi devre dışı (salt okunur mod)" };
    }
    const resolved = this.resolvePath(filePath);
    await fs.mkdir(path.dirname(resolved), { recursive: true });
    await fs.writeFile(resolved, content, "utf-8");
    return { output: `Dosya yazıldı: ${filePath}` };
  }

  private async fileList(dirPath: string): Promise<ToolResult> {
    const resolved = this.resolvePath(dirPath || ".");
    try {
      const entries = await fs.readdir(resolved, { withFileTypes: true });
      const list = entries.map((e) => `${e.isDirectory() ? "[DIR]" : "[FILE]"} ${e.name}`);
      return { output: list.join("\n") || "(Boş dizin)" };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Dizin listelenemedi";
      if (msg.includes("ENOENT")) {
        return { output: "", error: `Dizin bulunamadı: ${dirPath}` };
      }
      return { output: "", error: msg };
    }
  }

  private async fileSearch(dirPath: string, pattern: string): Promise<ToolResult> {
    const resolved = this.resolvePath(dirPath || ".");
    const results: string[] = [];

    const searchDir = async (dir: string, depth: number) => {
      if (depth > 5) return;
      let entries;
      try {
        entries = await fs.readdir(dir, { withFileTypes: true });
      } catch {
        return; // Skip inaccessible directories
      }
      for (const entry of entries) {
        if (entry.name === "node_modules" || entry.name === ".git") continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await searchDir(fullPath, depth + 1);
        } else {
          try {
            const content = await fs.readFile(fullPath, "utf-8");
            const lines = content.split("\n");
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].includes(pattern)) {
                const rel = path.relative(this.workingDir, fullPath);
                results.push(`${rel}:${i + 1}: ${lines[i].trim()}`);
              }
            }
          } catch {
            // Skip binary files
          }
        }
        if (results.length >= 50) return;
      }
    };

    await searchDir(resolved, 0);
    return { output: results.length > 0 ? results.join("\n") : "Eşleşme bulunamadı" };
  }

  private terminalExec(command: string): Promise<ToolResult> {
    return new Promise((resolve) => {
      const shell = process.platform === "win32" ? "powershell.exe" : "/bin/bash";
      const child = exec(command, {
        cwd: this.workingDir,
        shell,
        timeout: 60000,
        maxBuffer: 2 * 1024 * 1024,
        env: { ...process.env, LANG: "tr_TR.UTF-8" },
      });

      let stdout = "";
      let stderr = "";

      child.stdout?.on("data", (data) => { stdout += data; });
      child.stderr?.on("data", (data) => { stderr += data; });

      child.on("close", (code) => {
        const output = stdout || stderr;
        resolve({
          output: output || "(Çıktı yok)",
          error: code !== 0 ? `İşlem ${code} çıkış koduyla sonlandı` : undefined,
        });
      });

      child.on("error", (err) => {
        resolve({ output: "", error: `Komut çalıştırılamadı: ${err.message}` });
      });
    });
  }
}
