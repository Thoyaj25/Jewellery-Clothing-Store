import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/src/lib/auth";
import AdminDashboard from "./components/AdminDashboard";
import DashboardCards from "./components/DashboardCards";
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
  // Server-side authentication check
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    redirect("/api/auth/signin?callbackUrl=/admin");
  }

  // Fetch initial data
  const initialProducts: Product[] = await getProducts();

  // Audit placeholders
  const initialAudits: AuditEntry[] = [];
  const initialAuditTotal = 0;
  const auditPage = 1;

  return (
    <>
      <DashboardCards products={initialProducts} />

      <AdminDashboard
        initialProducts={initialProducts}
        initialAudits={initialAudits}
        initialAuditPage={auditPage}
        initialAuditTotal={initialAuditTotal}
      />
    </>
  );
}