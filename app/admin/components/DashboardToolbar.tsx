export default function DashboardToolbar() {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          Products
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          Manage your jewellery and clothing inventory
        </p>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search products..."
          className="w-72 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
        />

        <button
          type="button"
          className="rounded-lg bg-amber-500 px-5 py-2 font-medium text-black transition hover:bg-amber-400"
        >
          + Add Product
        </button>
      </div>
    </div>
  );
}
