export type ProviderName =
  | "openai"
  | "anthropic"
  | "ollama"
  | "gemini"
  | "openrouter"
  | "groq"
  | "together"
  | "deepseek"
  | "mistral"
  | "vllm"
  | "lmstudio";

export interface ModelInfo {
  id: string;
  name: string;
  contextWindow?: number;
  maxOutputTokens?: number;
}

export interface ProviderConfig {
  name: ProviderName;
  displayName: string;
  baseUrl: string;
  apiKey?: string;
  isEnabled: boolean;
  isLocal: boolean;
  models: ModelInfo[];
  apiFormat: "openai" | "anthropic" | "ollama" | "gemini";
  defaultModel?: string;
  testedAt?: string;
  status?: "connected" | "error" | "untested";
}
