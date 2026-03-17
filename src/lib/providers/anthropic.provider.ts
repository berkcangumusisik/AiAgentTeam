import { BaseLLMProvider, type ChatOptions, type ChatResponse, type ChatMessage, type ToolCall } from "./base.provider";

export class AnthropicProvider extends BaseLLMProvider {
  async chat(options: ChatOptions): Promise<ChatResponse> {
    const systemMessages = options.messages.filter((m) => m.role === "system");
    const nonSystemMessages = options.messages.filter((m) => m.role !== "system");

    const body: Record<string, unknown> = {
      model: options.model,
      max_tokens: options.maxTokens ?? 4096,
      messages: nonSystemMessages.map((m) => this.formatMessage(m)),
    };

    if (systemMessages.length > 0) {
      body.system = systemMessages.map((m) => m.content).join("\n\n");
    }

    if (options.temperature !== undefined) {
      body.temperature = options.temperature;
    }

    if (options.tools && options.tools.length > 0) {
      body.tools = options.tools.map((t) => ({
        name: t.function.name,
        description: t.function.description,
        input_schema: t.function.parameters,
      }));
    }

    const res = await fetch(`${this.baseUrl}/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Anthropic API error (${res.status}): ${error}`);
    }

    const data = await res.json();

    let content = "";
    const toolCalls: ToolCall[] = [];

    for (const block of data.content || []) {
      if (block.type === "text") {
        content += block.text;
      } else if (block.type === "tool_use") {
        toolCalls.push({
          id: block.id,
          type: "function",
          function: {
            name: block.name,
            arguments: JSON.stringify(block.input),
          },
        });
      }
    }

    return {
      content,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      usage: data.usage
        ? {
            inputTokens: data.usage.input_tokens || 0,
            outputTokens: data.usage.output_tokens || 0,
            totalTokens: (data.usage.input_tokens || 0) + (data.usage.output_tokens || 0),
          }
        : undefined,
      finishReason: data.stop_reason,
    };
  }

  private formatMessage(msg: ChatMessage): Record<string, unknown> {
    if (msg.role === "tool") {
      return {
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: msg.tool_call_id,
            content: msg.content,
          },
        ],
      };
    }

    if (msg.tool_calls && msg.tool_calls.length > 0) {
      return {
        role: "assistant",
        content: [
          ...(msg.content ? [{ type: "text", text: msg.content }] : []),
          ...msg.tool_calls.map((tc) => ({
            type: "tool_use",
            id: tc.id,
            name: tc.function.name,
            input: JSON.parse(tc.function.arguments),
          })),
        ],
      };
    }

    return { role: msg.role, content: msg.content };
  }

  async listModels(): Promise<string[]> {
    return ["claude-sonnet-4-5-20250514", "claude-haiku-3-5-20241022"];
  }

  async testConnection(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/v1/messages`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey || "",
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-3-5-20241022",
          max_tokens: 1,
          messages: [{ role: "user", content: "hi" }],
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
