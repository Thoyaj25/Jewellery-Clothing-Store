export async function ensureAuditTable() {
  return;
}

export async function recordAudit({ admin, action, productId, payload, ip }: { admin?: string; action: string; productId?: number | null; payload?: unknown; ip?: string; }) {
  return;
}
