"use client";

type Props = {
  allSelected: boolean;
  onToggleAll: () => void;
};

export default function InventoryHeader({
  allSelected,
  onToggleAll,
}: Props) {
  return (
    <thead className="bg-zinc-900 border-b border-zinc-800">
      <tr>
        <th className="w-12 px-4 py-3">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onToggleAll}
            className="h-4 w-4"
          />
        </th>

        <th className="px-4 py-3 text-left">Image</th>

        <th className="px-4 py-3 text-left">Product</th>

        <th className="px-4 py-3 text-left">Category</th>

        <th className="px-4 py-3 text-right">Price</th>

        <th className="px-4 py-3 text-center">Actions</th>
      </tr>
    </thead>
  );
}