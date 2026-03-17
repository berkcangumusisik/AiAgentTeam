import type { Task, TaskStatus } from "@/lib/types";
import type { ITaskRepository } from "../interfaces/task.repository";
import { BaseFileRepository } from "./base.file-repository";
import { DATA_PATHS } from "@/lib/utils/constants";

export class TaskFileRepository extends BaseFileRepository<Task> implements ITaskRepository {
  constructor() {
    super(DATA_PATHS.tasks);
  }

  async findByStatus(status: TaskStatus): Promise<Task[]> {
    return this.findBy((t) => t.status === status);
  }

  async findByTeamId(teamId: string): Promise<Task[]> {
    return this.findBy((t) => t.teamId === teamId);
  }
}
