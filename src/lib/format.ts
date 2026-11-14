/**
 * Formatting helpers
 * Deterministic (no Intl or locale lookups), so the server render and the
 * browser can never disagree about how a price is written.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

/** 12000 -> "12,000" */
const withThousands = (amount: number): string =>
  String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** 3500 -> "ZMW 3,500" */
export function formatZmw(amount: number): string {
  return `ZMW ${withThousands(amount)}`;
}

/** { 3500, 6000 } -> "ZMW 3,500 – 6,000" (currency once, en dash). */
export function formatZmwRange(range: { min: number; max: number; currency: 'ZMW' }): string {
  return `${formatZmw(range.min)} – ${withThousands(range.max)}`;
}
