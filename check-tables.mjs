import postgres from "postgres";

const sql = postgres(
  "postgresql://neondb_owner:npg_mjrJyO4f1xXw@ep-square-sky-atu055e1-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
);

try {
  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `;

  console.log(tables);
} catch (e) {
  console.error(e);
}

await sql.end();