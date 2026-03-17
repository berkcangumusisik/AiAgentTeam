import type { Team, TeamAgent, Agent, AgentCategory } from "@/lib/types";
import { getTeamRepository } from "@/lib/repositories";
import { getAgentRepository } from "@/lib/repositories";
import { generateId } from "@/lib/utils/id";
import { AGENT_CATEGORIES } from "@/lib/utils/constants";

export class TeamService {
  private repo = getTeamRepository();
  private agentRepo = getAgentRepository();

  async getAllTeams(): Promise<Team[]> {
    return this.repo.findAll();
  }

  async getPresets(): Promise<Team[]> {
    return this.repo.findPresets();
  }

  async getCustomTeams(): Promise<Team[]> {
    return this.repo.findCustom();
  }

  async getTeamById(id: string): Promise<Team | null> {
    return this.repo.findById(id);
  }

  async createTeam(data: Omit<Team, "id" | "isPreset" | "createdAt" | "updatedAt">): Promise<Team> {
    const now = new Date().toISOString();
    const team: Team = {
      ...data,
      id: generateId("team"),
      isPreset: false,
      createdAt: now,
      updatedAt: now,
    };
    return this.repo.create(team);
  }

  async updateTeam(id: string, data: Partial<Team>): Promise<Team> {
    return this.repo.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  async deleteTeam(id: string): Promise<void> {
    return this.repo.delete(id);
  }

  async getTeamSuggestions(teamAgents: TeamAgent[]): Promise<string[]> {
    const suggestions: string[] = [];
    const agentIds = new Set(teamAgents.map((a) => a.agentId));

    const agents: Agent[] = [];
    for (const ta of teamAgents) {
      const agent = await this.agentRepo.findById(ta.agentId);
      if (agent) agents.push(agent);
    }

    const categories = new Set(agents.map((a) => a.category));

    // Check for missing critical roles
    const hasEngineering = agents.some((a) => a.category === "engineering");
    const hasQuality = agents.some((a) => a.category === "quality");
    const hasPlanning = agents.some((a) => a.category === "product-planning");

    if (hasEngineering && !hasQuality) {
      suggestions.push("Consider adding a QA or Code Reviewer agent to ensure quality");
    }
    if (hasEngineering && !hasPlanning) {
      suggestions.push("Consider adding a Product Manager or Business Analyst for requirements clarity");
    }
    if (agents.length > 0 && !agentIds.has("documentation")) {
      suggestions.push("Consider adding a Documentation agent to keep docs in sync");
    }
    if (hasEngineering && !agentIds.has("code-reviewer")) {
      suggestions.push("A Code Reviewer can help maintain code quality standards");
    }

    return suggestions;
  }
}

let instance: TeamService;
export function getTeamService(): TeamService {
  if (!instance) instance = new TeamService();
  return instance;
}
