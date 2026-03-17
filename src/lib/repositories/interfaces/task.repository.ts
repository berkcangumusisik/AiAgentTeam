import type { Task, TaskStatus } from "@/lib/types";
import type { IRepository } from "./base.repository";

export interface ITaskRepository extends IRepository<Task> {
  findByStatus(status: TaskStatus): Promise<Task[]>;
  findByTeamId(teamId: string): Promise<Task[]>;
}
