type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_COLORS: Record<LogLevel, string> = {
  debug: "\x1b[36m",
  info: "\x1b[32m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
};

const RESET = "\x1b[0m";

function formatMessage(level: LogLevel, context: string, message: string): string {
  const timestamp = new Date().toISOString();
  return `${LOG_COLORS[level]}[${level.toUpperCase()}]${RESET} ${timestamp} [${context}] ${message}`;
}

export function createLogger(context: string) {
  return {
    debug: (message: string, data?: unknown) => {
      if (process.env.NODE_ENV === "development") {
        console.debug(formatMessage("debug", context, message), data ?? "");
      }
    },
    info: (message: string, data?: unknown) => {
      console.info(formatMessage("info", context, message), data ?? "");
    },
    warn: (message: string, data?: unknown) => {
      console.warn(formatMessage("warn", context, message), data ?? "");
    },
    error: (message: string, data?: unknown) => {
      console.error(formatMessage("error", context, message), data ?? "");
    },
  };
}
