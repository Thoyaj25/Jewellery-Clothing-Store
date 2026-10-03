import dns from "node:dns";
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const connectionUrl = new URL(process.env.DATABASE_URL);
const endpoint = connectionUrl.hostname.split(".")[0];

let poolPromise: Promise<Pool> | undefined;

function getPool(): Promise<Pool> {
  if (!poolPromise) {
    poolPromise = dns.promises.resolve4(connectionUrl.hostname).then((addresses) => {
      if (!addresses.length) {
        throw new Error(`No IPv4 address found for ${connectionUrl.hostname}`);
      }

      return new Pool({
        host: addresses[0],
        port: Number(connectionUrl.port || 5432),
        database: connectionUrl.pathname.replace(/^\//, ""),
        user: decodeURIComponent(connectionUrl.username),
        password: decodeURIComponent(connectionUrl.password),
        ssl: { rejectUnauthorized: false },
        options: `endpoint=${endpoint}`,
        max: 5,
        idleTimeoutMillis: 20000,
        connectionTimeoutMillis: 30000,
      });
    });
  }

  return poolPromise;
}

export const query = async <
  T extends Record<string, unknown> = Record<string, unknown>
>(
  text: string,
  params: unknown[] = []
) => {
  const pool = await getPool();
  return pool.query<T>(text, params);
};

async function ensureProductsTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
        image TEXT NOT NULL,
        description TEXT,
        is_visible BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS is_visible BOOLEAN NOT NULL DEFAULT TRUE;
    `);
  } catch (error) {
    console.error("Failed to initialize products table:", error);
  }
}

void ensureProductsTable();
