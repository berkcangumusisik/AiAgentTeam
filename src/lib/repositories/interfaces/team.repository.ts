import type { Team } from "@/lib/types";
import type { IRepository } from "./base.repository";

export interface ITeamRepository extends IRepository<Team> {
  findPresets(): Promise<Team[]>;
  findCustom(): Promise<Team[]>;
}
