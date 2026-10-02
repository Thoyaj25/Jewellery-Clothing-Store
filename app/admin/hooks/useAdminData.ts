"use client";

import { useCallback, useState } from "react";
import type { Product } from "@/src/types/product";

import {
  fetchProducts,
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
    loadAudits,
    startEditing,
    cancelEditing,
  };
}