"use client";

type Props = {
  selectedCount: number;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
};

export default function InventoryBulkActions({
  selectedCount,
  onDeleteSelected,
  onClearSelection,
}: Props) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-6 py-3">
      <span className="text-sm font-medium">
        {selectedCount} selected
      </span>

      <div className="flex gap-2">
        <button
          onClick={onDeleteSelected}
          className="rounded bg-red-600 px-4 py-2 text-sm"
        >
          Delete Selected
        </button>

        <button
          onClick={onClearSelection}
          className="rounded bg-zinc-700 px-4 py-2 text-sm"
        >
          Clear Selection
        </button>
      </div>
    </div>
  );
}