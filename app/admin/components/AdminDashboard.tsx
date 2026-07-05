"use client";

import ProductFormPanel from "./ProductFormPanel";
import InventoryTable from "./InventoryTable";
import AuditLogPanel from "./AuditLogPanel";

import { useAdminData } from "../hooks/useAdminData";

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

type Props = {
  initialProducts: Product[];
  initialAudits: AuditEntry[];
  initialAuditPage: number;
  initialAuditTotal: number;
};

export default function AdminDashboard({
  initialProducts,
  initialAudits,
  initialAuditPage,
  initialAuditTotal,
}: Props) {
  const {
    products,
    audits,
    loadingAudits,
    auditPage,
    auditTotal,
    editingProduct,
    loadAudits,
    loadProducts,
    removeProduct,
    startEditing,
    cancelEditing,
  } = useAdminData();

  const safePage = auditPage || initialAuditPage || 1;

  const goNext = () => {
    loadAudits(safePage + 1);
  };

  const goPrev = () => {
    if (safePage > 1) {
      loadAudits(safePage - 1);
    }
  };

  return (
    <div className="space-y-8">
      {/* PRODUCT FORM */}
      <ProductFormPanel
        onSuccess={() => {
          loadProducts();
          cancelEditing();
        }}
        editing={editingProduct}
        onCancelEdit={cancelEditing}
      />

      {/* PRODUCT GRID - 🧱 STEP 18: Wire onRefresh */}
      <InventoryTable
        products={products.length ? products : initialProducts}
        onEdit={startEditing}
        onDelete={removeProduct}
        onRefresh={loadProducts} // Passing loadProducts as the refresh handler
      />

      {/* AUDIT LOG */}
      <AuditLogPanel
        audits={audits.length ? audits : initialAudits}
        loading={loadingAudits}
        page={safePage}
        total={auditTotal || initialAuditTotal}
        onNext={goNext}
        onPrev={goPrev}
      />
    </div>
  );
}