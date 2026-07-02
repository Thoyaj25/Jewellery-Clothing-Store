import fs from "fs";
import path from "path";

const logsDir = path.join(process.cwd(), "logs");
const logFile = path.join(logsDir, "server.log");

function ensureDir() {
  try {
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
  } catch (err: unknown) {
    console.error("Failed to ensure logs directory", err);
  }
}

export function logError(err: unknown, context?: unknown) {
  try {
    ensureDir();
    const time = new Date().toISOString();
    const entry = {
      time,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context,
    };
    fs.appendFileSync(logFile, JSON.stringify(entry) + "\n");
  } catch (e: unknown) {
    console.error("Failed to write log file", e);
  }
}
