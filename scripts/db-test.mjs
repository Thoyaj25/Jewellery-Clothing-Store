import postgres from "postgres";

const sql = postgres(
  "postgresql://neondb_owner:npg_RO8fKGX3urBJ@ep-square-sky-atu055e1-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require",
  {
    ssl: "require",
    prepare: false,
  }
);

try {
  const rows = await sql`SELECT COUNT(*) FROM products`;
  console.log(rows);
} catch (e) {
  console.error(e);
} finally {
  await sql.end();
}
