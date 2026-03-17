import type { AppSettings } from "@/lib/types";

export interface ISettingsRepository {
  get(): Promise<AppSettings>;
  update(data: Partial<AppSettings>): Promise<AppSettings>;
}
