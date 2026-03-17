import { BaseLLMProvider, type ChatOptions, type ChatResponse, type ToolCall } from "./base.provider";

export class OllamaProvider extends BaseLLMProvider {
  async chat(options: ChatOptions): Promise<ChatResponse> {
    const body: Record<string, unknown> = {
      model: options.model,
      messages: options.messages.map((m) => ({
        role: m.role === "tool" ? "assistant" : m.role,
        content: m.content,
      })),
      stream: false,
      options: {
        temperature: options.temperature ?? 0.7,
        num_predict: options.maxTokens ?? 4096,
      },
    };

    if (options.tools && options.tools.length > 0) {
      body.tools = options.tools;
    }

    const res = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Ollama API error (${res.status}): ${error}`);
    }

    const data = await res.json();

    const toolCalls: ToolCall[] | undefined = data.message?.tool_calls?.map(
      (tc: any, i: number) => ({
        id: `call_${i}`,
        type: "function" as const,
        function: {
          name: tc.function.name,
          arguments: JSON.stringify(tc.function.arguments),
        },
      })
    );

    return {
      content: data.message?.content || "",
      toolCalls,
      usage: {
        inputTokens: data.prompt_eval_count || 0,
        outputTokens: data.eval_count || 0,
        totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
      },
      finishReason: data.done ? "stop" : "length",
    };
  }

  async listModels(): Promise<string[]> {
    const res = await fetch(`${this.baseUrl}/api/tags`);
    if (!res.ok) throw new Error(`Failed to list models: ${res.status}`);
    const data = await res.json();
    return (data.models || []).map((m: any) => m.name);
  }

  async testConnection(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`);
      return res.ok;
    } catch {
      return false;
    }
  }
}
