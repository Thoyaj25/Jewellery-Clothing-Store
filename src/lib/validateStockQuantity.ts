export function validateStockQuantity(
  value: unknown
): number | null {
  if (value === null) {
    return null;
  }

  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < 0 ||
    value > 2147483647
  ) {
    throw new Error(
      "Stock quantity must be null or a non-negative whole number."
    );
  }

  return value;
}
