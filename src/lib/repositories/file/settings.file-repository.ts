import type { AppSettings } from "@/lib/types";
import type { ISettingsRepository } from "../interfaces/settings.repository";
import { readJSON, writeJSON } from "@/lib/utils/fs";
import { DATA_PATHS } from "@/lib/utils/constants";
import { DEFAULT_SETTINGS } from "@/lib/utils/constants";

export class SettingsFileRepository implements ISettingsRepository {
  private get filePath() { return DATA_PATHS.settings; }

  async get(): Promise<AppSettings> {
    try {
      const stored = await readJSON<Partial<AppSettings>>(this.filePath);
      return { ...DEFAULT_SETTINGS, ...stored };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  async update(data: Partial<AppSettings>): Promise<AppSettings> {
    const current = await this.get();
    const updated = { ...current, ...data };
    await writeJSON(this.filePath, updated);
    return updated;
  }
}
