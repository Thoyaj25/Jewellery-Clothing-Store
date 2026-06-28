"use client";

import AdminDashboard from "@/app/components/AdminDashboard";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-light mb-6">Admin Dashboard</h1>
        <AdminDashboard />
      </div>
    </div>
  );
}
