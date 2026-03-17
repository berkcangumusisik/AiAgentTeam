import type { Agent, Task, TaskStage } from "@/lib/types";
import type { ChatMessage, ToolDefinition } from "@/lib/providers/base.provider";
import { getProviderForModel } from "@/lib/providers/registry";
import { ToolRunner } from "./tool-runner";
import { buildSystemPrompt } from "./prompt-builder";
import { getRunService } from "@/lib/services/run.service";
import { getSettingsRepository } from "@/lib/repositories";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger("Executor");

const TOOLS: ToolDefinition[] = [
  {
    type: "function",
    function: {
      name: "file_read",
      description: "Read the contents of a file",
      parameters: {
        type: "object",
        properties: { path: { type: "string", description: "Relative file path" } },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "file_write",
      description: "Write content to a file (creates or overwrites)",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "Relative file path" },
          content: { type: "string", description: "File content to write" },
        },
        required: ["path", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "file_list",
      description: "List files and directories",
      parameters: {
        type: "object",
        properties: { path: { type: "string", description: "Directory path (default: .)" } },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "file_search",
      description: "Search for a text pattern in files",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "Directory to search in" },
          pattern: { type: "string", description: "Text pattern to search for" },
        },
        required: ["pattern"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "terminal_exec",
      description: "Execute a terminal command",
      parameters: {
        type: "object",
        properties: { command: { type: "string", description: "Command to execute" } },
        required: ["command"],
      },
    },
  },
];

const MAX_ITERATIONS = 20;

export interface ExecutorResult {
  output: string;
  tokensUsed: { input: number; output: number; total: number };
  fileChanges: { path: string; type: "created" | "modified" | "deleted" }[];
}

export class AgentExecutor {
  async execute(
    agent: Agent,
    task: Task,
    stage: TaskStage,
    runId: string,
    context?: string,
    abortSignal?: AbortSignal,
    modelOverride?: string
  ): Promise<ExecutorResult> {
    const runService = getRunService();

    // Model resolution priority: modelOverride (from team policy) > agent.defaultModel > app settings
    let modelId = modelOverride || agent.defaultModel;
    try {
      await getProviderForModel(modelId);
    } catch {
      // If the model's provider is not enabled, fall back to app settings
      logger.warn(`Provider for model "${modelId}" not available, falling back to app settings`);
      const settingsRepo = getSettingsRepository();
      const settings = await settingsRepo.get();
      modelId = settings.defaultModel;
    }
    const { provider } = await getProviderForModel(modelId);

    const readOnly = agent.riskLevel === "low";
    const toolRunner = new ToolRunner(task.workingDirectory, readOnly);

    const systemPrompt = buildSystemPrompt(agent, task, stage, context);
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Begin working on stage: "${stage.name}"\n\n${stage.description}` },
    ];

    const tokens = { input: 0, output: 0, total: 0 };
    const fileChanges: ExecutorResult["fileChanges"] = [];
    let finalOutput = "";

    for (let i = 0; i < MAX_ITERATIONS; i++) {
      if (abortSignal?.aborted) {
        throw new Error("Execution aborted");
      }

      await runService.appendEvent(runId, {
        type: "agent:thinking",
        agentId: agent.id,
        agentName: agent.name,
        stageId: stage.id,
        message: `${agent.name} is thinking... (iteration ${i + 1})`,
      });

      await runService.updateAgentState(runId, agent.id, {
        status: "thinking",
        currentActivity: `Thinking (iteration ${i + 1}/${MAX_ITERATIONS})`,
      });

      const response = await provider.chat({
        model: modelId,
        messages,
        tools: readOnly ? TOOLS.filter((t) => t.function.name !== "file_write") : TOOLS,
        temperature: agent.temperature,
        maxTokens: agent.maxTokens,
      });

      if (response.usage) {
        tokens.input += response.usage.inputTokens;
        tokens.output += response.usage.outputTokens;
        tokens.total += response.usage.totalTokens;
      }

      // Update cost
      await runService.updateCost(runId, {
        inputTokens: tokens.input,
        outputTokens: tokens.output,
        totalTokens: tokens.total,
      });

      if (response.content) {
        finalOutput = response.content;
        await runService.appendEvent(runId, {
          type: "agent:response",
          agentId: agent.id,
          agentName: agent.name,
          stageId: stage.id,
          message: response.content.substring(0, 500),
          data: { fullContent: response.content },
        });
      }

      // Check for tool calls
      if (response.toolCalls && response.toolCalls.length > 0) {
        messages.push({
          role: "assistant",
          content: response.content || "",
          tool_calls: response.toolCalls,
        });

        await runService.updateAgentState(runId, agent.id, {
          status: "tool-calling",
          currentActivity: `Calling ${response.toolCalls.map((t) => t.function.name).join(", ")}`,
        });

        for (const toolCall of response.toolCalls) {
          const args = JSON.parse(toolCall.function.arguments);

          await runService.appendEvent(runId, {
            type: "agent:tool-call",
            agentId: agent.id,
            agentName: agent.name,
            stageId: stage.id,
            message: `Calling ${toolCall.function.name}`,
            data: { tool: toolCall.function.name, args },
          });

          const result = await toolRunner.execute(toolCall.function.name, args);

          // Track file changes
          if (toolCall.function.name === "file_write" && !result.error) {
            fileChanges.push({ path: args.path, type: "created" });
          }

          if (toolCall.function.name === "terminal_exec") {
            await runService.appendTerminalOutput(runId, `$ ${args.command}\n${result.output}\n`);
            await runService.appendEvent(runId, {
              type: "terminal:output",
              agentId: agent.id,
              agentName: agent.name,
              stageId: stage.id,
              message: result.output.substring(0, 300),
              data: { command: args.command, output: result.output },
            });
          }

          await runService.appendEvent(runId, {
            type: "agent:tool-result",
            agentId: agent.id,
            agentName: agent.name,
            stageId: stage.id,
            message: result.error || result.output.substring(0, 200),
            data: { tool: toolCall.function.name, result: result.output.substring(0, 2000) },
          });

          messages.push({
            role: "tool",
            content: result.error ? `Error: ${result.error}` : result.output,
            tool_call_id: toolCall.id,
          });
        }

        continue;
      }

      // No tool calls - check if done
      if (response.content?.includes("[DONE]") || response.finishReason === "stop") {
        break;
      }

      // Add response to messages for next iteration
      messages.push({ role: "assistant", content: response.content || "" });
    }

    await runService.updateAgentState(runId, agent.id, {
      status: "done",
      tokensUsed: tokens.total,
      completedAt: new Date().toISOString(),
    });

    await runService.appendEvent(runId, {
      type: "agent:done",
      agentId: agent.id,
      agentName: agent.name,
      stageId: stage.id,
      message: `${agent.name} completed stage "${stage.name}"`,
    });

    return { output: finalOutput, tokensUsed: tokens, fileChanges };
  }
}
