import type { Product } from "@/src/types/product";

export type AuditEntry = {
  id: number;
  admin?: string | null;
  action: string;
  product_id?: number | null;
  payload?: unknown;
  ip?: string | null;
  created_at: string;
};

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function deleteProduct(id: number | string) {
  const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
}

// 🧱 STEP 17.3 — Add the frontend service for bulk delete
export async function deleteProducts(ids: (number | string)[]) {
  const res = await fetch("/api/products/bulk-delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete products");
  }

  return res.json();
}

export async function fetchAudits(params: {
  page: number;
  limit: number;
  admin?: string;
  action?: string;
}) {
  const q = new URLSearchParams();

  q.set("page", String(params.page));
  q.set("limit", String(params.limit));

  if (params.admin) q.set("admin", params.admin);
  if (params.action) q.set("action", params.action);

  const res = await fetch(`/api/admin/audit?${q.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch audits");

  return res.json();
}