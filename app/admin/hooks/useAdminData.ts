"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/src/types/product";
import { toast } from "react-toastify";

import {
  fetchProducts,
  deleteProduct,
  fetchAudits,
  type AuditEntry,
} from "../services/adminApi";

type AuditFilters = {
  admin?: string;
  action?: string;
};

type UseAdminDataProps = {
  initialProducts?: Product[];
  initialAudits?: AuditEntry[];
  initialAuditTotal?: number;
};

export function useAdminData({ 
  initialProducts = [], 
  initialAudits = [],
  initialAuditTotal = 0 
}: UseAdminDataProps = {}) {
  
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [audits, setAudits] = useState<AuditEntry[]>(initialAudits);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingAudits, setLoadingAudits] = useState(false);

  const [auditPage, setAuditPage] = useState(1);
  const [auditTotal, setAuditTotal] = useState(initialAuditTotal);

  const auditLimit = 20;

  /* =========================
     PRODUCTS
  ========================= */

  const loadProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const data = await fetchProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // 📍 STEP 13.3: Improved Delete UX (Optimistic Update)
  const removeProduct = useCallback(async (id: number | string) => {
    // 1. Snapshot current state for rollback
    const previousProducts = [...products];

    // 2. Perform optimistic update
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      await deleteProduct(id);
      return true;
    } catch (err) {
      // 3. Revert on failure
      setProducts(previousProducts);
      toast.error("Failed to delete product");
      throw err;
    }
  }, [products]);

  /* =========================
     EDIT STATE
  ========================= */

  const startEditing = useCallback((product: Product) => setEditingProduct(product), []);
  const cancelEditing = useCallback(() => setEditingProduct(null), []);

  /* =========================
     AUDITS
  ========================= */

  const loadAudits = useCallback(async (page = 1, filters?: AuditFilters) => {
    try {
      setLoadingAudits(true);
      const data = await fetchAudits({
        page,
        limit: auditLimit,
        admin: filters?.admin,
        action: filters?.action,
      });

      setAudits(data?.entries ?? []);
      setAuditPage(data?.page ?? page);
      setAuditTotal(data?.total ?? 0);
    } catch (err) {
      console.error("Failed to load audits", err);
      setAudits([]);
    } finally {
      setLoadingAudits(false);
    }
  }, []);

  /* =========================
     INIT
  ========================= */

  useEffect(() => {
    // 📍 STEP 13.4: Polished hydration trigger
    // If we have no data, we fetch; otherwise, we trust the props hydration
    if (initialProducts.length === 0) loadProducts();
    if (initialAudits.length === 0) loadAudits(1);
  }, [loadProducts, loadAudits, initialProducts.length, initialAudits.length]);

  return {
    products,
    audits,
    editingProduct,
    loadingProducts,
    loadingAudits,
    auditPage,
    auditTotal,
    auditLimit,
    loadProducts,
    removeProduct,
    loadAudits,
    startEditing,
    cancelEditing,
  };
}