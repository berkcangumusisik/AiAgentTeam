import type { Agent, AgentCategory } from "@/lib/types";
import type { IRepository } from "./base.repository";

export interface IAgentRepository extends IRepository<Agent> {
  findByCategory(category: AgentCategory): Promise<Agent[]>;
  findLibrary(): Promise<Agent[]>;
  findCustom(): Promise<Agent[]>;
  search(query: string): Promise<Agent[]>;
}
