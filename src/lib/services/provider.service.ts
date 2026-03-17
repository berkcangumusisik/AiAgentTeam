import type { ProviderConfig, ProviderName } from "@/lib/types";
import { getProviderRepository } from "@/lib/repositories";

export class ProviderService {
  private repo = getProviderRepository();

  async getAllProviders(): Promise<ProviderConfig[]> {
    return this.repo.findAll();
  }

  async getProvider(name: ProviderName): Promise<ProviderConfig | null> {
    return this.repo.findByName(name);
  }

  async getEnabledProviders(): Promise<ProviderConfig[]> {
    const all = await this.repo.findAll();
    return all.filter((p) => p.isEnabled);
  }

  async updateProvider(name: ProviderName, data: Partial<ProviderConfig>): Promise<ProviderConfig> {
    return this.repo.update(name, data);
  }

  async updateAllProviders(providers: ProviderConfig[]): Promise<void> {
    return this.repo.updateAll(providers);
  }

  async testConnection(name: ProviderName): Promise<{ success: boolean; message: string }> {
    const provider = await this.repo.findByName(name);
    if (!provider) return { success: false, message: "Provider not found" };

    try {
      if (provider.apiFormat === "ollama") {
        const res = await fetch(`${provider.baseUrl}/api/tags`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await this.repo.update(name, { status: "connected", testedAt: new Date().toISOString() });
        return { success: true, message: "Connected to Ollama" };
      }

      if (provider.apiFormat === "openai") {
        const res = await fetch(`${provider.baseUrl}/models`, {
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await this.repo.update(name, { status: "connected", testedAt: new Date().toISOString() });
        return { success: true, message: "Connected successfully" };
      }

      if (provider.apiFormat === "anthropic") {
        const res = await fetch(`${provider.baseUrl}/v1/messages`, {
          method: "POST",
          headers: {
            "x-api-key": provider.apiKey || "",
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: provider.defaultModel || "claude-sonnet-4-5-20250514",
            max_tokens: 1,
            messages: [{ role: "user", content: "hi" }],
          }),
        });
        if (!res.ok) {
          const body = await res.text();
          if (res.status === 401) throw new Error("Invalid API key");
          throw new Error(`HTTP ${res.status}: ${body}`);
        }
        await this.repo.update(name, { status: "connected", testedAt: new Date().toISOString() });
        return { success: true, message: "Connected to Anthropic" };
      }

      if (provider.apiFormat === "gemini") {
        const res = await fetch(
          `${provider.baseUrl}/models?key=${provider.apiKey}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await this.repo.update(name, { status: "connected", testedAt: new Date().toISOString() });
        return { success: true, message: "Connected to Gemini" };
      }

      return { success: false, message: "Unknown API format" };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Connection failed";
      await this.repo.update(name, { status: "error", testedAt: new Date().toISOString() });
      return { success: false, message };
    }
  }
}

let instance: ProviderService;
export function getProviderService(): ProviderService {
  if (!instance) instance = new ProviderService();
  return instance;
}
