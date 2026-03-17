import path from "path";
import type { Run, RunEvent } from "@/lib/types";
import type { IRunRepository } from "../interfaces/run.repository";
import { readJSON, writeJSON, ensureDir, appendToFile, fileExists, readFileContent, listJSONFiles } from "@/lib/utils/fs";
import { DATA_PATHS } from "@/lib/utils/constants";

export class RunFileRepository implements IRunRepository {
  private get baseDir() { return DATA_PATHS.runs; }

  private runDir(runId: string) { return path.join(this.baseDir, runId); }
  private metaPath(runId: string) { return path.join(this.runDir(runId), "meta.json"); }
  private eventsPath(runId: string) { return path.join(this.runDir(runId), "events.jsonl"); }
  private terminalPath(runId: string) { return path.join(this.runDir(runId), "terminal.log"); }

  async findAll(): Promise<Run[]> {
    await ensureDir(this.baseDir);
    const fs = await import("fs/promises");
    const entries = await fs.readdir(this.baseDir, { withFileTypes: true });
    const runs: Run[] = [];
    for (const entry of entries) {
      if (entry.isDirectory()) {
        try {
          runs.push(await readJSON<Run>(this.metaPath(entry.name)));
        } catch { /* skip */ }
      }
    }
    return runs.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }

  async findById(id: string): Promise<Run | null> {
    try {
      return await readJSON<Run>(this.metaPath(id));
    } catch {
      return null;
    }
  }

  async findBy(predicate: (item: Run) => boolean): Promise<Run[]> {
    const all = await this.findAll();
    return all.filter(predicate);
  }

  async findByTaskId(taskId: string): Promise<Run[]> {
    return this.findBy((r) => r.taskId === taskId);
  }

  async findActive(): Promise<Run[]> {
    return this.findBy((r) => r.status === "running" || r.status === "pending");
  }

  async create(data: Run): Promise<Run> {
    await ensureDir(this.runDir(data.id));
    await writeJSON(this.metaPath(data.id), data);
    return data;
  }

  async update(id: string, data: Partial<Run>): Promise<Run> {
    const existing = await this.findById(id);
    if (!existing) throw new Error(`Run not found: ${id}`);
    const updated = { ...existing, ...data, id };
    await writeJSON(this.metaPath(id), updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const fs = await import("fs/promises");
    try {
      await fs.rm(this.runDir(id), { recursive: true, force: true });
    } catch { /* ignore */ }
  }

  async exists(id: string): Promise<boolean> {
    return fileExists(this.metaPath(id));
  }

  async appendEvent(runId: string, event: RunEvent): Promise<void> {
    await ensureDir(this.runDir(runId));
    await appendToFile(this.eventsPath(runId), JSON.stringify(event));
  }

  async getEvents(runId: string, afterTimestamp?: string): Promise<RunEvent[]> {
    try {
      const content = await readFileContent(this.eventsPath(runId));
      const events = content
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line) as RunEvent);

      if (afterTimestamp) {
        return events.filter((e) => e.timestamp > afterTimestamp);
      }
      return events;
    } catch {
      return [];
    }
  }

  async appendTerminalOutput(runId: string, output: string): Promise<void> {
    await ensureDir(this.runDir(runId));
    await appendToFile(this.terminalPath(runId), output);
  }

  async getTerminalOutput(runId: string): Promise<string> {
    try {
      return await readFileContent(this.terminalPath(runId));
    } catch {
      return "";
    }
  }
}
