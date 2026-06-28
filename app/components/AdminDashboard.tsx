"use client";

import React, { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", category: "", price: "0", image: "", description: "" });

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => setForm({ name: "", category: "", price: "0", image: "", description: "" });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    // Client-side validation
    const errs: string[] = [];
    if (!form.name || form.name.trim().length < 2) errs.push("Name must be at least 2 characters");
    const priceNum = Number(form.price);
    if (isNaN(priceNum) || priceNum < 0) errs.push("Price must be a positive number");
    if (form.description && form.description.length > 2000) errs.push("Description is too long");

    if (errs.length > 0) {
      setValidationErrors(errs);
      return;
    }
    setValidationErrors([]);

    if (editing) {
      // update
      const res = await fetch(`/api/products/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      const data = await res.json();
      if (data?.errors) {
        setValidationErrors(Array.isArray(data.errors) ? data.errors : [data.errors]);
        return;
      }
      setEditing(null);
    } else {
      const res = await fetch(`/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      const data = await res.json();
      if (data?.errors) {
        setValidationErrors(Array.isArray(data.errors) ? data.errors : [data.errors]);
        return;
      }
    }

    resetForm();
    fetchProducts();
  };

  const startEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, category: p.category, price: String(p.price), image: p.image, description: p.description });
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  // Audit log state
  const [audits, setAudits] = useState<any[]>([]);
  const [auditPage, setAuditPage] = useState(1);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditLimit] = useState(20);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditFilterAdmin, setAuditFilterAdmin] = useState("");
  const [auditFilterAction, setAuditFilterAction] = useState("");

  const fetchAudits = async (page = 1) => {
    setAuditLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(auditLimit));
    if (auditFilterAdmin) params.set("admin", auditFilterAdmin);
    if (auditFilterAction) params.set("action", auditFilterAction);

    const res = await fetch(`/api/admin/audit?${params.toString()}`);
    const data = await res.json();
    setAudits(data.entries || []);
    setAuditPage(data.page || page);
    setAuditTotal(data.total || 0);
    setAuditLoading(false);
  };

  useEffect(() => {
    fetchAudits(1);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {validationErrors.length > 0 && (
            <div className="md:col-span-4 p-3 bg-red-900/60 text-red-200 rounded">
              <ul className="list-disc pl-5">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Name" className="p-2 bg-zinc-900 rounded" />
          <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="Category" className="p-2 bg-zinc-900 rounded" />
          <input value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="Price" className="p-2 bg-zinc-900 rounded" />
          <input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="Image path" className="p-2 bg-zinc-900 rounded" />
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Description" className="md:col-span-4 p-2 bg-zinc-900 rounded" />
          <div className="md:col-span-4">
            <button type="submit" className="px-4 py-2 bg-amber-600 rounded mr-2">{editing ? "Update" : "Add"} Product</button>
            {editing && <button type="button" onClick={() => { setEditing(null); resetForm(); }} className="px-4 py-2 bg-zinc-700 rounded">Cancel</button>}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-xl mb-4">Products</h2>
        {loading ? <div>Loading...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((p) => (
              <div key={p.id} className="p-4 bg-zinc-900 rounded">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 bg-gray-800 rounded overflow-hidden">
                    {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs text-zinc-400">{p.category}</div>
                      </div>
                      <div className="text-amber-500">₹{p.price}</div>
                    </div>
                    <p className="text-sm text-zinc-300 mt-2">{p.description}</p>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => startEdit(p)} className="px-3 py-1 bg-blue-600 rounded">Edit</button>
                      <button onClick={() => remove(p.id)} className="px-3 py-1 bg-red-600 rounded">Delete</button>
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
        <div className="mb-4 flex gap-2">
          <input value={auditFilterAdmin} onChange={(e) => setAuditFilterAdmin(e.target.value)} placeholder="Admin" className="p-2 bg-zinc-900 rounded" />
          <input value={auditFilterAction} onChange={(e) => setAuditFilterAction(e.target.value)} placeholder="Action" className="p-2 bg-zinc-900 rounded" />
          <button onClick={() => fetchAudits(1)} className="px-3 py-2 bg-amber-600 rounded">Filter</button>
          <button onClick={() => { setAuditFilterAdmin(""); setAuditFilterAction(""); fetchAudits(1); }} className="px-3 py-2 bg-zinc-700 rounded">Clear</button>
        </div>

        {auditLoading ? (
          <div>Loading audits...</div>
        ) : (
          <div className="space-y-3">
            {audits.map((a) => (
              <div key={a.id} className="p-3 bg-zinc-900 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-zinc-400">{new Date(a.created_at).toLocaleString()}</div>
                    <div className="font-semibold">{a.action} — {a.admin || 'system'}</div>
                    <div className="text-xs text-zinc-400">product: {a.product_id} • ip: {a.ip}</div>
                    <pre className="mt-2 text-xs text-zinc-300 bg-zinc-800 p-2 rounded overflow-auto">{a.payload ? JSON.stringify(a.payload, null, 2) : '—'}</pre>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-400">Total: {auditTotal}</div>
              <div className="flex gap-2">
                <button disabled={auditPage <= 1} onClick={() => fetchAudits(auditPage - 1)} className="px-3 py-1 bg-zinc-700 rounded">Prev</button>
                <div className="px-3 py-1">Page {auditPage}</div>
                <button disabled={auditPage * auditLimit >= auditTotal} onClick={() => fetchAudits(auditPage + 1)} className="px-3 py-1 bg-zinc-700 rounded">Next</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
