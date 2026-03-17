export interface AppSettings {
  theme: "light" | "dark" | "system";
  defaultProvider: string;
  defaultModel: string;
  maxConcurrentRuns: number;
  workingDirectory: string;
  terminalShell: string;
  autoSave: boolean;
  showTokenCosts: boolean;
  language: string;
}
