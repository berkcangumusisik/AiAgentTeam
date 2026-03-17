import type { Team } from "@/lib/types";
import type { ITeamRepository } from "../interfaces/team.repository";
import { readJSON, listJSONFiles, writeJSON, deleteFile, ensureDir, fileExists } from "@/lib/utils/fs";
import { DATA_PATHS } from "@/lib/utils/constants";
import path from "path";

export class TeamFileRepository implements ITeamRepository {
  private get presetsDir() { return DATA_PATHS.teams.presets; }
  private get customDir() { return DATA_PATHS.teams.custom; }

  private async readFromDir(dirPath: string): Promise<Team[]> {
    const files = await listJSONFiles(dirPath);
    const teams: Team[] = [];
    for (const file of files) {
      try {
        teams.push(await readJSON<Team>(file));
      } catch { /* skip */ }
    }
    return teams;
  }

  async findAll(): Promise<Team[]> {
    const [presets, custom] = await Promise.all([
      this.readFromDir(this.presetsDir),
      this.readFromDir(this.customDir),
    ]);
    return [...presets, ...custom];
  }

  async findById(id: string): Promise<Team | null> {
    for (const dir of [this.presetsDir, this.customDir]) {
      try {
        return await readJSON<Team>(path.join(dir, `${id}.json`));
      } catch { /* continue */ }
    }
    return null;
  }

  async findBy(predicate: (item: Team) => boolean): Promise<Team[]> {
    const all = await this.findAll();
    return all.filter(predicate);
  }

  async findPresets(): Promise<Team[]> {
    return this.readFromDir(this.presetsDir);
  }

  async findCustom(): Promise<Team[]> {
    return this.readFromDir(this.customDir);
  }

  async create(data: Team): Promise<Team> {
    const dir = data.isPreset ? this.presetsDir : this.customDir;
    await ensureDir(dir);
    await writeJSON(path.join(dir, `${data.id}.json`), data);
    return data;
  }

  async update(id: string, data: Partial<Team>): Promise<Team> {
    const existing = await this.findById(id);
    if (!existing) throw new Error(`Team not found: ${id}`);
    const updated = { ...existing, ...data, id };
    const dir = updated.isPreset ? this.presetsDir : this.customDir;
    await writeJSON(path.join(dir, `${id}.json`), updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    for (const dir of [this.presetsDir, this.customDir]) {
      await deleteFile(path.join(dir, `${id}.json`));
    }
  }

  async exists(id: string): Promise<boolean> {
    for (const dir of [this.presetsDir, this.customDir]) {
      if (await fileExists(path.join(dir, `${id}.json`))) return true;
    }
    return false;
  }
}
