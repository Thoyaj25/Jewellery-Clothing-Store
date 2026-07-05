"use client";

type AuditEntry = {
  id: number;
  admin?: string | null;
  action: string;
  product_id?: number | null;
  ip?: string | null;
  created_at: string;
};

type Props = {
  audits: AuditEntry[];
  loading: boolean;
  page: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
};

export default function AuditLogPanel({
  audits,
  loading,
  page,
  total,
  onNext,
  onPrev,
}: Props) {
  return (
    <div className="space-y-3">
      {loading ? (
        <div>Loading...</div>
      ) : (
        audits.map((a) => (
          <div key={a.id} className="p-3 bg-zinc-900 rounded">
            <div className="text-xs text-zinc-400">
              {new Date(a.created_at).toLocaleString()}
            </div>

            <div className="font-semibold">
              {a.action} — {a.admin || "system"}
            </div>

            <div className="text-xs text-zinc-400">
              product: {a.product_id} • ip: {a.ip}
            </div>
          </div>
        ))
      )}

      <div className="flex gap-2 items-center">
        <button onClick={onPrev}>Prev</button>
        <div>{page}</div>
        <button onClick={onNext}>Next</button>
      </div>
    </div>
  );
}