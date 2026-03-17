import { AgentFileRepository } from "./file/agent.file-repository";
import { TeamFileRepository } from "./file/team.file-repository";
import { TaskFileRepository } from "./file/task.file-repository";
import { RunFileRepository } from "./file/run.file-repository";
import { ProviderFileRepository } from "./file/provider.file-repository";
import { SettingsFileRepository } from "./file/settings.file-repository";
import type { IAgentRepository } from "./interfaces/agent.repository";
import type { ITeamRepository } from "./interfaces/team.repository";
import type { ITaskRepository } from "./interfaces/task.repository";
import type { IRunRepository } from "./interfaces/run.repository";
import type { IProviderRepository } from "./interfaces/provider.repository";
import type { ISettingsRepository } from "./interfaces/settings.repository";

// Singleton instances
let agentRepo: IAgentRepository;
let teamRepo: ITeamRepository;
let taskRepo: ITaskRepository;
let runRepo: IRunRepository;
let providerRepo: IProviderRepository;
let settingsRepo: ISettingsRepository;

export function getAgentRepository(): IAgentRepository {
  if (!agentRepo) agentRepo = new AgentFileRepository();
  return agentRepo;
}

export function getTeamRepository(): ITeamRepository {
  if (!teamRepo) teamRepo = new TeamFileRepository();
  return teamRepo;
}

export function getTaskRepository(): ITaskRepository {
  if (!taskRepo) taskRepo = new TaskFileRepository();
  return taskRepo;
}

export function getRunRepository(): IRunRepository {
  if (!runRepo) runRepo = new RunFileRepository();
  return runRepo;
}

export function getProviderRepository(): IProviderRepository {
  if (!providerRepo) providerRepo = new ProviderFileRepository();
  return providerRepo;
}

export function getSettingsRepository(): ISettingsRepository {
  if (!settingsRepo) settingsRepo = new SettingsFileRepository();
  return settingsRepo;
}

export type {
  IAgentRepository,
  ITeamRepository,
  ITaskRepository,
  IRunRepository,
  IProviderRepository,
  ISettingsRepository,
};
