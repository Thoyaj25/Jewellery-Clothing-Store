import fs from "fs";
import path from "path";

const logsDir = path.join(process.cwd(), "logs");
const logFile = path.join(logsDir, "server.log");

function ensureDir() {
  try {
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
  } catch (e) {
    // ignore
  }
}

export function logError(err: any, context?: any) {
  try {
    ensureDir();
    const time = new Date().toISOString();
    const entry = { time, error: String(err), stack: err?.stack, context };
    fs.appendFileSync(logFile, JSON.stringify(entry) + "\n");
  } catch (e) {
    // fallback to console
    console.error("Failed to write log file", e);
  }
}
