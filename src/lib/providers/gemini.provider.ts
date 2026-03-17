import { BaseLLMProvider, type ChatOptions, type ChatResponse, type ToolCall } from "./base.provider";

export class GeminiProvider extends BaseLLMProvider {
  async chat(options: ChatOptions): Promise<ChatResponse> {
    const systemInstruction = options.messages
      .filter((m) => m.role === "system")
      .map((m) => m.content)
      .join("\n\n");

    const contents = options.messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const body: Record<string, unknown> = {
      contents,
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxTokens ?? 4096,
      },
    };

    if (systemInstruction) {
      body.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    if (options.tools && options.tools.length > 0) {
      body.tools = [
        {
          functionDeclarations: options.tools.map((t) => ({
            name: t.function.name,
            description: t.function.description,
            parameters: t.function.parameters,
          })),
        },
      ];
    }

    const url = `${this.baseUrl}/models/${options.model}:generateContent?key=${this.apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Gemini API error (${res.status}): ${error}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    let content = "";
    const toolCalls: ToolCall[] = [];

    for (const part of candidate?.content?.parts || []) {
      if (part.text) content += part.text;
      if (part.functionCall) {
        toolCalls.push({
          id: `call_${toolCalls.length}`,
          type: "function",
          function: {
            name: part.functionCall.name,
            arguments: JSON.stringify(part.functionCall.args),
          },
        });
      }
    }

    return {
      content,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      usage: data.usageMetadata
        ? {
            inputTokens: data.usageMetadata.promptTokenCount || 0,
            outputTokens: data.usageMetadata.candidatesTokenCount || 0,
            totalTokens: data.usageMetadata.totalTokenCount || 0,
          }
        : undefined,
      finishReason: candidate?.finishReason,
    };
  }

  async listModels(): Promise<string[]> {
    const res = await fetch(`${this.baseUrl}/models?key=${this.apiKey}`);
    if (!res.ok) throw new Error(`Failed to list models: ${res.status}`);
    const data = await res.json();
    return (data.models || []).map((m: any) => m.name.replace("models/", ""));
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.listModels();
      return true;
    } catch {
      return false;
    }
  }
}
