// 🧱 STEP 5 — Fix: Update frontend service to handle boolean response
export async function deleteProducts(ids: (number | string)[]): Promise<boolean> {
  const res = await fetch("/api/products/bulk-delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete products");
  }

  const data = await res.json();
  return data.success; // Returns the boolean success status from the API
}