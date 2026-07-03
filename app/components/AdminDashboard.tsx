"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import type { Product } from "@/src/types/product";

type ProductForm = {
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
};

type ProductApiResponse = Product[];

type ApiErrorResponse = {
  errors?: string[];
  error?: string;
};

type AuditEntry = {
  id: number;
  admin?: string | null;
  action: string;
  product_id?: number | null;
  payload?: unknown;
  ip?: string | null;
  created_at: string;
};

type AuditResponse = {
  entries: AuditEntry[];
  page: number;
  limit: number;
  total: number;
};

const EMPTY_FORM: ProductForm = {
  name: "",
  category: "",
  price: "0",
  image: "",
  description: "",
};

type AdminDashboardProps = {
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
}: AdminDashboardProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [audits, setAudits] = useState<AuditEntry[]>(initialAudits);
  const [auditPage, setAuditPage] = useState(initialAuditPage);
  const [auditTotal, setAuditTotal] = useState(initialAuditTotal);
  const auditLimit = 20;
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditFilterAdmin, setAuditFilterAdmin] = useState("");
  const [auditFilterAction, setAuditFilterAction] = useState("");

  const resetForm = () => {
    setForm(EMPTY_FORM);
  };

  const refreshProducts = async () => {
    setLoading(true);
    const response = await fetch("/api/products");
    if (!response.ok) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const data = (await response.json()) as ProductApiResponse;
    setProducts(data);
    setLoading(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: string[] = [];
    if (!form.name.trim() || form.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    }

    const priceValue = Number(form.price);
    if (Number.isNaN(priceValue) || priceValue < 0) {
      errors.push("Price must be a positive number");
    }

    if (form.description.length > 2000) {
      errors.push("Description is too long");
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);

    const payload = {
      name: form.name,
      category: form.category,
      price: priceValue,
      image: form.image,
      description: form.description,
    };

    const method = editing ? "PUT" : "POST";
    const endpoint = editing ? `/api/products/${Number(editing.id)}` : "/api/products";

    setLoading(true);
    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as ApiErrorResponse;
    setLoading(false);

    if (data.errors?.length) {
      setValidationErrors(data.errors);
      return;
    }

    resetForm();
    setEditing(null);
    await refreshProducts();
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setForm({
  name: product.name,
  category: product.category,
  price: String(product.price),
  image: product.image,
  description: product.description ?? "",
});
    setValidationErrors([]);
  };

  const handleDelete = async (id: number | string) => {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) {
      return;
    }

    await fetch(`/api/products/${Number(id)}`, { method: "DELETE" });
    await refreshProducts();
  };

  const refreshAudits = async (page = 1) => {
    setAuditLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(auditLimit));
    if (auditFilterAdmin) params.set("admin", auditFilterAdmin);
    if (auditFilterAction) params.set("action", auditFilterAction);

    const response = await fetch(`/api/admin/audit?${params.toString()}`);
    if (!response.ok) {
      setAuditLoading(false);
      return;
    }

    const data = (await response.json()) as AuditResponse;
    setAudits(data.entries);
    setAuditPage(data.page);
    setAuditTotal(data.total);
    setAuditLoading(false);
  };

  const auditPages = useMemo(() => Math.max(1, Math.ceil(auditTotal / auditLimit)), [auditTotal, auditLimit]);

  return (
    <div>
      <div className="mb-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {validationErrors.length > 0 && (
            <div className="md:col-span-4 p-3 bg-red-900/60 text-red-200 rounded">
              <ul className="list-disc pl-5">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          <input
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Name"
            className="p-2 bg-zinc-900 rounded"
          />
          <input
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            placeholder="Category"
            className="p-2 bg-zinc-900 rounded"
          />
          <input
            value={form.price}
            onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
            placeholder="Price"
            className="p-2 bg-zinc-900 rounded"
          />
          <input
            value={form.image}
            onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
            placeholder="Image path"
            className="p-2 bg-zinc-900 rounded"
          />
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Description"
            className="md:col-span-4 p-2 bg-zinc-900 rounded"
          />
          <div className="md:col-span-4 flex flex-wrap gap-2">
            <button type="submit" className="px-4 py-2 bg-amber-600 rounded">
              {editing ? "Update" : "Add"} Product
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-zinc-700 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-xl mb-4">Products</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div key={product.id} className="p-4 bg-zinc-900 rounded">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 bg-gray-800 rounded overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-xs text-zinc-400">{product.category}</div>
                      </div>
                      <div className="text-amber-500">₹{product.price}</div>
                    </div>
                    <p className="text-sm text-zinc-300 mt-2">{product.description}</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        className="px-3 py-1 bg-blue-600 rounded"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(product.id)}
                        className="px-3 py-1 bg-red-600 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-xl mb-4">Audit Log</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          <input
            value={auditFilterAdmin}
            onChange={(event) => setAuditFilterAdmin(event.target.value)}
            placeholder="Admin"
            className="p-2 bg-zinc-900 rounded"
          />
          <input
            value={auditFilterAction}
            onChange={(event) => setAuditFilterAction(event.target.value)}
            placeholder="Action"
            className="p-2 bg-zinc-900 rounded"
          />
          <button
            type="button"
            onClick={() => void refreshAudits(1)}
            className="px-3 py-2 bg-amber-600 rounded"
          >
            Filter
          </button>
          <button
            type="button"
            onClick={() => {
              setAuditFilterAdmin("");
              setAuditFilterAction("");
              void refreshAudits(1);
            }}
            className="px-3 py-2 bg-zinc-700 rounded"
          >
            Clear
          </button>
        </div>

        {auditLoading ? (
          <div>Loading audits...</div>
        ) : (
          <div className="space-y-3">
            {audits.map((audit) => (
              <div key={audit.id} className="p-3 bg-zinc-900 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-zinc-400">{new Date(audit.created_at).toLocaleString()}</div>
                    <div className="font-semibold">{audit.action} — {audit.admin || "system"}</div>
                    <div className="text-xs text-zinc-400">product: {audit.product_id} • ip: {audit.ip}</div>
                    <pre className="mt-2 text-xs text-zinc-300 bg-zinc-800 p-2 rounded overflow-auto">
                      {audit.payload ? JSON.stringify(audit.payload, null, 2) : "—"}
                    </pre>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm text-zinc-400">Total: {auditTotal}</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={auditPage <= 1}
                  onClick={() => void refreshAudits(auditPage - 1)}
                  className="px-3 py-1 bg-zinc-700 rounded"
                >
                  Prev
                </button>
                <div className="px-3 py-1">Page {auditPage} / {auditPages}</div>
                <button
                  type="button"
                  disabled={auditPage >= auditPages}
                  onClick={() => void refreshAudits(auditPage + 1)}
                  className="px-3 py-1 bg-zinc-700 rounded"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
