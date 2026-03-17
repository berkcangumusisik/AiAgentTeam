import type { Task, TaskStatus, TaskStageConfig } from "@/lib/types";
import { getTaskRepository } from "@/lib/repositories";
import { generateId } from "@/lib/utils/id";

export class TaskService {
  private repo = getTaskRepository();

  async getAllTasks(): Promise<Task[]> {
    return this.repo.findAll();
  }

  async getTaskById(id: string): Promise<Task | null> {
    return this.repo.findById(id);
  }

  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    return this.repo.findByStatus(status);
  }

  async getTasksByTeamId(teamId: string): Promise<Task[]> {
    return this.repo.findByTeamId(teamId);
  }

  async createTask(data: {
    title: string;
    description: string;
    teamId: string;
    workingDirectory: string;
    priority: Task["priority"];
    stages: TaskStageConfig[];
  }): Promise<Task> {
    const now = new Date().toISOString();
    const task: Task = {
      id: generateId("task"),
      title: data.title,
      description: data.description,
      teamId: data.teamId,
      workingDirectory: data.workingDirectory,
      priority: data.priority,
      status: "draft",
      stages: data.stages.map((s) => ({
        ...s,
        status: "draft" as const,
      })),
      currentStageIndex: 0,
      createdAt: now,
      updatedAt: now,
    };
    return this.repo.create(task);
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    return this.repo.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  async deleteTask(id: string): Promise<void> {
    return this.repo.delete(id);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.updateTask(id, { status });
  }

  async advanceStage(id: string): Promise<Task> {
    const task = await this.repo.findById(id);
    if (!task) throw new Error(`Task not found: ${id}`);

    const currentStage = task.stages[task.currentStageIndex];
    if (currentStage) {
      currentStage.status = "completed";
      currentStage.completedAt = new Date().toISOString();
    }

    if (task.currentStageIndex < task.stages.length - 1) {
      task.currentStageIndex++;
      const nextStage = task.stages[task.currentStageIndex];
      if (nextStage) {
        nextStage.status = "running";
        nextStage.startedAt = new Date().toISOString();
      }
    } else {
      task.status = "completed";
    }

    return this.updateTask(id, task);
  }
}

let instance: TaskService;
export function getTaskService(): TaskService {
  if (!instance) instance = new TaskService();
  return instance;
}
