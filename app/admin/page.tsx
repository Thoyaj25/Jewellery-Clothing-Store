import AdminDashboard from "@/app/components/AdminDashboard";
import { getProducts } from "@/src/lib/getProducts";
import sql from "@/src/lib/db";
import type { Product } from "@/src/types/product";

type AuditEntry = {
  id: number;
  admin?: string | null;
  action: string;
  product_id?: number | null;
  payload?: unknown;
  ip?: string | null;
  created_at: string;
};

type AuditRow = {
  id: number;
  admin: string | null;
  action: string;
  product_id: number | null;
  payload: unknown;
  ip: string | null;
  created_at: Date | string;
};

export default async function AdminPage() {
  let initialProducts: Product[] = [];
  let initialAudits: AuditEntry[] = [];
  let initialAuditTotal = 0;
  const auditPage = 1;

  try {
    initialProducts = await getProducts();
  } catch (error) {
    console.error("ADMIN PAGE PRODUCT FETCH ERROR:", error);
  }

  try {
    const auditLimit = 20;
    const offset = 0;

    const entries = (await sql`
      SELECT
        id,
        admin,
        action,
        product_id,
        payload,
        ip,
        created_at
      FROM admin_audit
      ORDER BY created_at DESC
      LIMIT ${auditLimit}
      OFFSET ${offset}
    `) as AuditRow[];

    const countRes = await sql`
      SELECT COUNT(*) AS count
      FROM admin_audit
    `;

    initialAudits = entries.map((entry) => ({
      ...entry,
      created_at:
        entry.created_at instanceof Date
          ? entry.created_at.toISOString()
          : String(entry.created_at),
    }));

    initialAuditTotal = Number(countRes[0]?.count ?? 0);
  } catch (error) {
    console.error("ADMIN PAGE AUDIT FETCH ERROR:", error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-light mb-6">
          Admin Dashboard
        </h1>

        <AdminDashboard
          initialProducts={initialProducts}
          initialAudits={initialAudits}
          initialAuditPage={auditPage}
          initialAuditTotal={initialAuditTotal}
        />
      </div>
    </div>
  );
}