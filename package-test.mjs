import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require",
  family: 4,
  connect_timeout: 30,
});

try {
  const result = await sql`SELECT NOW() AS now`;
  console.log("SUCCESS");
  console.log(result);
} catch (err) {
  console.error("FAILED");
  console.error(err);
} finally {
  await sql.end();
}