import type { ProviderConfig, ProviderName } from "@/lib/types";

export interface IProviderRepository {
  findAll(): Promise<ProviderConfig[]>;
  findByName(name: ProviderName): Promise<ProviderConfig | null>;
  update(name: ProviderName, data: Partial<ProviderConfig>): Promise<ProviderConfig>;
  updateAll(providers: ProviderConfig[]): Promise<void>;
}
