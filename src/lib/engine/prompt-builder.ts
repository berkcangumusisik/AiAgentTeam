import type { Agent, Task, TaskStage } from "@/lib/types";

export function buildSystemPrompt(agent: Agent, task: Task, stage: TaskStage, context?: string): string {
  const parts: string[] = [];

  // Agent's base system prompt
  parts.push(agent.systemPrompt);

  // Task context
  parts.push(`\n## Current Task\n**Title:** ${task.title}\n**Description:** ${task.description}\n**Working Directory:** ${task.workingDirectory}`);

  // Stage info
  parts.push(`\n## Current Stage\n**Stage:** ${stage.name}\n**Description:** ${stage.description}`);

  // Previous context
  if (context) {
    parts.push(`\n## Context from Previous Stages\n${context}`);
  }

  // Tool usage instructions
  parts.push(`\n## Available Tools
You have access to the following tools:
- **file_read**: Read file contents. Parameters: { "path": "src/index.ts" }
- **file_write**: Write/create files. Parameters: { "path": "src/index.ts", "content": "file content" }
- **file_list**: List directory contents. Parameters: { "path": "src" }
- **file_search**: Search for text in files. Parameters: { "path": "src", "pattern": "search pattern" }
- **terminal_exec**: Execute terminal commands. Parameters: { "command": "npm install" }

## IMPORTANT PATH RULES
- Your working directory is: ${task.workingDirectory}
- ALWAYS use RELATIVE paths (e.g. "src/components/App.tsx", NOT absolute paths)
- Example correct paths: "src/index.ts", "package.json", "src/components/Header.tsx"
- Example WRONG paths: "C:/Users/.../src/index.ts", "/home/.../src/index.ts"
- All file operations are restricted to the working directory for security
- Start by listing files with file_list to understand the project structure

## Instructions
- Complete the stage objectives thoroughly
- When finished, include [DONE] in your final message
- Be concise but thorough in your responses`);

  return parts.join("\n");
}
