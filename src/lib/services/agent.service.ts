import type { Agent, AgentCategory } from "@/lib/types";
import { getAgentRepository } from "@/lib/repositories";
import { generateId } from "@/lib/utils/id";

export class AgentService {
  private repo = getAgentRepository();

  async getAllAgents(): Promise<Agent[]> {
    return this.repo.findAll();
  }

  async getLibraryAgents(): Promise<Agent[]> {
    return this.repo.findLibrary();
  }

  async getCustomAgents(): Promise<Agent[]> {
    return this.repo.findCustom();
  }

  async getAgentById(id: string): Promise<Agent | null> {
    return this.repo.findById(id);
  }

  async getAgentsByCategory(category: AgentCategory): Promise<Agent[]> {
    return this.repo.findByCategory(category);
  }

  async searchAgents(query: string): Promise<Agent[]> {
    return this.repo.search(query);
  }

  async getAgentsGroupedByCategory(): Promise<Record<AgentCategory, Agent[]>> {
    const agents = await this.repo.findAll();
    const grouped = {} as Record<AgentCategory, Agent[]>;
    for (const agent of agents) {
      if (!grouped[agent.category]) grouped[agent.category] = [];
      grouped[agent.category].push(agent);
    }
    return grouped;
  }

  async createCustomAgent(data: Omit<Agent, "id" | "isLibrary" | "createdAt" | "updatedAt">): Promise<Agent> {
    const now = new Date().toISOString();
    const agent: Agent = {
      ...data,
      id: generateId("agent"),
      isLibrary: false,
      createdAt: now,
      updatedAt: now,
    };
    return this.repo.create(agent);
  }

  async updateAgent(id: string, data: Partial<Agent>): Promise<Agent> {
    return this.repo.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  async deleteAgent(id: string): Promise<void> {
    return this.repo.delete(id);
  }

  async cloneAgent(id: string, newName: string): Promise<Agent> {
    const original = await this.repo.findById(id);
    if (!original) throw new Error(`Agent not found: ${id}`);
    const now = new Date().toISOString();
    const clone: Agent = {
      ...original,
      id: generateId("agent"),
      name: newName,
      isLibrary: false,
      createdAt: now,
      updatedAt: now,
    };
    return this.repo.create(clone);
  }
}

let instance: AgentService;
export function getAgentService(): AgentService {
  if (!instance) instance = new AgentService();
  return instance;
}
