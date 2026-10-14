import fs from "node:fs";
import path from "node:path";
import dns from "node:dns/promises";
import { Client } from "pg";

const envPath = path.resolve(process.cwd(), ".env.local");

if (!fs.existsSync(envPath)) {
  throw new Error("Missing .env.local");
}

const line = fs
  .readFileSync(envPath, "utf8")
  .split(/\r?\n/)
  .find((value) => value.startsWith("DATABASE_URL="));

if (!line) {
  throw new Error("DATABASE_URL not configured");
}

const connectionString = line
  .slice("DATABASE_URL=".length)
  .trim()
  .replace(/^["']|["']$/g, "");

const url = new URL(connectionString);
const addresses = await dns.resolve4(url.hostname);

if (!addresses.length) {
  throw new Error("No IPv4 address available");
}

const client = new Client({
  host: addresses[0],
  port: Number(url.port || 5432),
  database: url.pathname.slice(1),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  ssl: { rejectUnauthorized: false },
  options: `endpoint=${url.hostname.split(".")[0]}`,
  connectionTimeoutMillis: 15000,
});

try {
  await client.connect();

  const result = await client.query(`
    SELECT
      current_database() AS database,
      COUNT(*)::int AS products
    FROM public.products
  `);

  console.log("Database connection successful");
  console.log(result.rows[0]);
} finally {
  await client.end();
}
