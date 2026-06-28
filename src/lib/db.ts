import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: "require",
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

export default sql;
