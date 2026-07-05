"use client";

import { useState } from "react";

type MutationOptions<TData, TVariables> = {
  mutationFn: (vars: TVariables) => Promise<TData>;

  onSuccess?: (data: TData, vars: TVariables) => void;
  onError?: (error: unknown, vars: TVariables) => void;
  onSettled?: () => void;
};

export function useMutation<TData = unknown, TVariables = unknown>(
  options: MutationOptions<TData, TVariables>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const mutate = async (variables: TVariables) => {
    if (loading) return; // prevents double submit (critical fix)

    setLoading(true);
    setError(null);

    try {
      const result = await options.mutationFn(variables);

      options.onSuccess?.(result, variables);
      return result;
    } catch (err) {
      setError(err);
      options.onError?.(err, variables);
    } finally {
      setLoading(false);
      options.onSettled?.();
    }
  };

  return {
    mutate,
    loading,
    error,
  };
}