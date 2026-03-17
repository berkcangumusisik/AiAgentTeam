import type { ProviderConfig, ProviderName } from "@/lib/types";
import type { IProviderRepository } from "../interfaces/provider.repository";
import { readJSON, writeJSON, fileExists } from "@/lib/utils/fs";
import { DATA_PATHS } from "@/lib/utils/constants";

export class ProviderFileRepository implements IProviderRepository {
  private get filePath() { return DATA_PATHS.providers; }

  async findAll(): Promise<ProviderConfig[]> {
    try {
      return await readJSON<ProviderConfig[]>(this.filePath);
    } catch {
      return [];
    }
  }

  async findByName(name: ProviderName): Promise<ProviderConfig | null> {
    const all = await this.findAll();
    return all.find((p) => p.name === name) ?? null;
  }

  async update(name: ProviderName, data: Partial<ProviderConfig>): Promise<ProviderConfig> {
    const all = await this.findAll();
    const index = all.findIndex((p) => p.name === name);
    if (index === -1) throw new Error(`Provider not found: ${name}`);
    all[index] = { ...all[index], ...data };
    await writeJSON(this.filePath, all);
    return all[index];
  }

  async updateAll(providers: ProviderConfig[]): Promise<void> {
    await writeJSON(this.filePath, providers);
  }
}
