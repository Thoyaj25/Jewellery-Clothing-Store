"use client";

export type Toast = {
  id: string;
  type: "success" | "error" | "info";
  message: string;
};

let toasts: Toast[] = [];
let listeners = new Set<(t: Toast[]) => void>();

function emit() {
  const snapshot = [...toasts];
  listeners.forEach((l) => l(snapshot));
}

export function addToast(toast: Omit<Toast, "id">) {
  const id = crypto.randomUUID();

  toasts = [...toasts, { id, ...toast }];
  emit();

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 3000);
}

export function subscribe(listener: (t: Toast[]) => void) {
  listeners.add(listener);

  // initial sync
  listener([...toasts]);

  return () => {
    listeners.delete(listener);
  };
}