"use client";

import { useEffect, useState } from "react";
import { addToast, subscribe, type Toast } from "./toastStore";

export function useToastActions() {
  return {
    success: (message: string) =>
      addToast({ type: "success", message }),

    error: (message: string) =>
      addToast({ type: "error", message }),

    info: (message: string) =>
      addToast({ type: "info", message }),
  };
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = subscribe(setToasts);
    return unsubscribe;
  }, []);

  return { toasts };
}