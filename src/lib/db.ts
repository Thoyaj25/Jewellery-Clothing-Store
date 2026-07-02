import postgres from "postgres";

type PostgresSql = ReturnType<typeof postgres>;

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var __pg_sql: PostgresSql | undefined;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Missing DATABASE_URL environment variable");
}

const useSsl =
  process.env.NODE_ENV === "production" ||
  connectionString.includes("sslmode=require");

const sql =
  globalThis.__pg_sql ??
  postgres(connectionString, {
    ssl: useSsl ? "require" : undefined,
    connect_timeout: 30,
    max: Number(process.env.PG_MAX_POOL) || 5,
    idle_timeout: 20,
    prepare: false,
    debug:
      process.env.NODE_ENV !== "production"
        ? (connection, query, parameters, parameterTypes) => {
            console.log("PG DEBUG QUERY:", query);
            console.log("PG DEBUG PARAMS:", parameters);
            console.log("PG DEBUG TYPES:", parameterTypes);
          }
        : undefined,
  });

if (!globalThis.__pg_sql) {
  globalThis.__pg_sql = sql;
}

export default sql;
