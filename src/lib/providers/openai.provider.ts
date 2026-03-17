import { BaseLLMProvider, type ChatOptions, type ChatResponse, type ChatMessage, type ToolCall } from "./base.provider";

export class OpenAIProvider extends BaseLLMProvider {
  async chat(options: ChatOptions): Promise<ChatResponse> {
    const body: Record<string, unknown> = {
      model: options.model,
      messages: options.messages.map((m) => this.formatMessage(m)),
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
    };

    if (options.tools && options.tools.length > 0) {
      body.tools = options.tools;
    }

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${error}`);
    }

    const data = await res.json();
    const choice = data.choices?.[0];

    const toolCalls: ToolCall[] | undefined = choice?.message?.tool_calls?.map(
      (tc: any) => ({
        id: tc.id,
        type: "function",
        function: {
          name: tc.function.name,
          arguments: tc.function.arguments,
        },
      })
    );

    return {
      content: choice?.message?.content || "",
      toolCalls,
      usage: data.usage
        ? {
            inputTokens: data.usage.prompt_tokens || 0,
            outputTokens: data.usage.completion_tokens || 0,
            totalTokens: data.usage.total_tokens || 0,
          }
        : undefined,
      finishReason: choice?.finish_reason,
    };
  }

  private formatMessage(msg: ChatMessage): Record<string, unknown> {
    const formatted: Record<string, unknown> = {
      role: msg.role,
      content: msg.content,
    };
    if (msg.tool_call_id) formatted.tool_call_id = msg.tool_call_id;
    if (msg.tool_calls) formatted.tool_calls = msg.tool_calls;
    return formatted;
  }

  async listModels(): Promise<string[]> {
    const res = await fetch(`${this.baseUrl}/models`, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });
    if (!res.ok) throw new Error(`Failed to list models: ${res.status}`);
    const data = await res.json();
    return (data.data || []).map((m: any) => m.id);
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
