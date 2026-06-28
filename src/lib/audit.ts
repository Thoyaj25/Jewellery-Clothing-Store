import sql from "./db";

export async function ensureAuditTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS admin_audit (
      id BIGSERIAL PRIMARY KEY,
      admin TEXT,
      action TEXT,
      product_id INTEGER,
      payload JSONB,
      ip TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;
}

export async function recordAudit({ admin, action, productId, payload, ip }: { admin?: string; action: string; productId?: number | null; payload?: any; ip?: string; }) {
  try {
    await ensureAuditTable();

    await sql`
      INSERT INTO admin_audit (admin, action, product_id, payload, ip)
      VALUES (${admin ?? null}, ${action}, ${productId ?? null}, ${payload ? JSON.stringify(payload) : null}, ${ip ?? null})
    `;
  } catch (err) {
    // Do not throw if audit fails - logging should be best-effort
    console.error("Audit record failed:", err);
  }
}
