import AdminDashboard from "@/app/components/AdminDashboard";
import { getProducts } from "@/src/lib/getProducts";
import type { Product } from "@/src/types/product";

/**
 * Represents a single audit log entry from the database.
 */
type AuditEntry = {
  id: number;
  admin?: string | null;
  action: string;
  product_id?: number | null;
  payload?: unknown;
  ip?: string | null;
  created_at: string;
};

export default async function AdminPage() {
  // Fetch initial data for the dashboard
  const initialProducts: Product[] = await getProducts();
  
  // Initialize state for audit logs
  const initialAudits: AuditEntry[] = [];
  const initialAuditTotal = 0;
  const auditPage = 1;

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