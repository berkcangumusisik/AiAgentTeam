import type { Agent, AgentCategory } from "@/lib/types";
import type { IAgentRepository } from "../interfaces/agent.repository";
import { readJSON, listJSONFiles, writeJSON, deleteFile, ensureDir, fileExists } from "@/lib/utils/fs";
import { DATA_PATHS } from "@/lib/utils/constants";
import path from "path";

export class AgentFileRepository implements IAgentRepository {
  private get libraryDir() { return DATA_PATHS.agents.library; }
  private get customDir() { return DATA_PATHS.agents.custom; }

  private async readFromDir(dirPath: string): Promise<Agent[]> {
    const files = await listJSONFiles(dirPath);
    const agents: Agent[] = [];
    for (const file of files) {
      try {
        agents.push(await readJSON<Agent>(file));
      } catch { /* skip */ }
    }
    return agents;
  }

  async findAll(): Promise<Agent[]> {
    const [library, custom] = await Promise.all([
      this.readFromDir(this.libraryDir),
      this.readFromDir(this.customDir),
    ]);
    return [...library, ...custom];
  }

  async findById(id: string): Promise<Agent | null> {
    for (const dir of [this.libraryDir, this.customDir]) {
      try {
        return await readJSON<Agent>(path.join(dir, `${id}.json`));
      } catch { /* continue */ }
    }
    return null;
  }

  async findBy(predicate: (item: Agent) => boolean): Promise<Agent[]> {
    const all = await this.findAll();
    return all.filter(predicate);
  }

  async findByCategory(category: AgentCategory): Promise<Agent[]> {
    return this.findBy((a) => a.category === category);
  }

  async findLibrary(): Promise<Agent[]> {
    return this.readFromDir(this.libraryDir);
  }

  async findCustom(): Promise<Agent[]> {
    return this.readFromDir(this.customDir);
  }

  async search(query: string): Promise<Agent[]> {
    const q = query.toLowerCase();
    return this.findBy(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  async create(data: Agent): Promise<Agent> {
    const dir = data.isLibrary ? this.libraryDir : this.customDir;
    await ensureDir(dir);
    await writeJSON(path.join(dir, `${data.id}.json`), data);
    return data;
  }

  async update(id: string, data: Partial<Agent>): Promise<Agent> {
    const existing = await this.findById(id);
    if (!existing) throw new Error(`Agent not found: ${id}`);
    const updated = { ...existing, ...data, id };
    const dir = updated.isLibrary ? this.libraryDir : this.customDir;
    await writeJSON(path.join(dir, `${id}.json`), updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    for (const dir of [this.libraryDir, this.customDir]) {
      await deleteFile(path.join(dir, `${id}.json`));
    }
  }

  async exists(id: string): Promise<boolean> {
    for (const dir of [this.libraryDir, this.customDir]) {
      if (await fileExists(path.join(dir, `${id}.json`))) return true;
    }
    return false;
  }
}
