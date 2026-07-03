import postgres from "postgres";

const sql = postgres(
  "postgresql://neondb_owner:npg_RO8fKGX3urBJ@ep-square-sky-atu055e1-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
);

try {
  const result = await sql`select version()`;

  console.log(result);
} catch (e) {
  console.error(e);
}

await sql.end();
