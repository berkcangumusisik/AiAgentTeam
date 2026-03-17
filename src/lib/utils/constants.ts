import path from "path";

const DATA_ROOT = process.env.DATA_DIR || path.join(process.cwd(), "data");

export const DATA_PATHS = {
  root: DATA_ROOT,
  agents: {
    library: path.join(DATA_ROOT, "agents", "library"),
    custom: path.join(DATA_ROOT, "agents", "custom"),
  },
  teams: {
    presets: path.join(DATA_ROOT, "teams", "presets"),
    custom: path.join(DATA_ROOT, "teams", "custom"),
  },
  tasks: path.join(DATA_ROOT, "tasks"),
  runs: path.join(DATA_ROOT, "runs"),
  projects: path.join(DATA_ROOT, "projects"),
  providers: path.join(DATA_ROOT, "providers", "providers.json"),
  settings: path.join(DATA_ROOT, "settings", "app.json"),
} as const;

export const AGENT_CATEGORIES = {
  "product-planning": {
    label: "Ürün ve Planlama",
    color: "bg-blue-500",
    icon: "Lightbulb",
  },
  "design-experience": {
    label: "Tasarım ve Deneyim",
    color: "bg-purple-500",
    icon: "Palette",
  },
  engineering: {
    label: "Mühendislik",
    color: "bg-green-500",
    icon: "Code",
  },
  quality: {
    label: "Kalite",
    color: "bg-orange-500",
    icon: "Shield",
  },
  operations: {
    label: "Operasyonlar",
    color: "bg-red-500",
    icon: "Settings",
  },
  "knowledge-support": {
    label: "Bilgi ve Destek",
    color: "bg-cyan-500",
    icon: "BookOpen",
  },
} as const;

export const DEFAULT_SETTINGS = {
  theme: "dark" as const,
  defaultProvider: "ollama",
  defaultModel: "llama3.1:8b",
  maxConcurrentRuns: 3,
  workingDirectory: process.cwd(),
  terminalShell: process.platform === "win32" ? "powershell" : "bash",
  autoSave: true,
  showTokenCosts: true,
  language: "en",
};

export const RISK_LEVELS = {
  low: { label: "Düşük Risk", color: "text-green-500" },
  medium: { label: "Orta Risk", color: "text-yellow-500" },
  high: { label: "Yüksek Risk", color: "text-red-500" },
} as const;
