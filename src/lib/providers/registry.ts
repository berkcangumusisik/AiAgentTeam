import type { ProviderConfig, ProviderName } from "@/lib/types";
import { BaseLLMProvider } from "./base.provider";
import { OpenAIProvider } from "./openai.provider";
import { AnthropicProvider } from "./anthropic.provider";
import { OllamaProvider } from "./ollama.provider";
import { GeminiProvider } from "./gemini.provider";
import { getProviderRepository } from "@/lib/repositories";

const providerCache = new Map<string, BaseLLMProvider>();

export function createProvider(config: ProviderConfig): BaseLLMProvider {
  switch (config.apiFormat) {
    case "openai":
      return new OpenAIProvider(config.baseUrl, config.apiKey);
    case "anthropic":
      return new AnthropicProvider(config.baseUrl, config.apiKey);
    case "ollama":
      return new OllamaProvider(config.baseUrl);
    case "gemini":
      return new GeminiProvider(config.baseUrl, config.apiKey);
    default:
      throw new Error(`Unknown API format: ${config.apiFormat}`);
  }
}

export async function getProviderForModel(modelId: string): Promise<{
  provider: BaseLLMProvider;
  config: ProviderConfig;
}> {
  const repo = getProviderRepository();
  const providers = await repo.findAll();

  // Find which provider owns this model
  for (const config of providers) {
    if (!config.isEnabled) continue;
    const hasModel = config.models.some((m) => m.id === modelId);
    if (hasModel || config.defaultModel === modelId) {
      const cacheKey = `${config.name}:${config.baseUrl}`;
      if (!providerCache.has(cacheKey)) {
        providerCache.set(cacheKey, createProvider(config));
      }
      return { provider: providerCache.get(cacheKey)!, config };
    }
  }

  // Fallback: try to guess provider from model name
  const guessedProvider = guessProviderFromModel(modelId);
  if (guessedProvider) {
    const config = providers.find((p) => p.name === guessedProvider);
    if (config) {
      return { provider: createProvider(config), config };
    }
  }

  throw new Error(`No enabled provider found for model: ${modelId}`);
}

function guessProviderFromModel(modelId: string): ProviderName | null {
  if (modelId.startsWith("gpt-") || modelId.startsWith("o1")) return "openai";
  if (modelId.startsWith("claude-")) return "anthropic";
  if (modelId.startsWith("gemini-")) return "gemini";
  if (modelId.startsWith("llama")) return "ollama";
  if (modelId.includes("deepseek")) return "deepseek";
  if (modelId.includes("mistral") || modelId.includes("codestral")) return "mistral";
  return null;
}
