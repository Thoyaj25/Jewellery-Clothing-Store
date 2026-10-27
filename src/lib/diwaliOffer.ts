export const DIWALI_OFFER = {
  startsAt: "2026-10-27T18:30:00.000Z",
  endsAt: "2026-11-10T18:30:00.000Z",
  percent: 5,
  maxDiscount: 30,
} as const;

export function getDiwaliDiscount(
  subtotal: number,
  now: Date = new Date()
): number {
  if (
    !Number.isFinite(subtotal) ||
    subtotal <= 0 ||
    now.getTime() < Date.parse(DIWALI_OFFER.startsAt) ||
    now.getTime() >= Date.parse(DIWALI_OFFER.endsAt)
  ) {
    return 0;
  }

  return Math.min(
    Math.round(subtotal * DIWALI_OFFER.percent) / 100,
    DIWALI_OFFER.maxDiscount
  );
}
