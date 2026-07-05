"use client";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;

  category: string;
  categories: string[];
  onCategoryChange: (value: string) => void;

  sort: string;
  onSortChange: (value: string) => void;

  onClear: () => void;
};

export default function InventoryFilters({
  search,
  onSearchChange,
  category,
  categories,
  sort,
  onSortChange,
  onCategoryChange,
  onClear,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-zinc-800 p-4">

      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search products..."
        className="w-64 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
      />

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
      >
        <option value="">All Categories</option>

        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
      >
        <option value="name">Name (A-Z)</option>
        <option value="priceAsc">Price ↑</option>
        <option value="priceDesc">Price ↓</option>
      </select>

      <button
        onClick={onClear}
        className="rounded-lg bg-zinc-700 px-4 py-2"
      >
        Clear
      </button>

    </div>
  );
}