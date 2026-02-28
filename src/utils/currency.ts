/**
 * Format a number as BDT currency with ৳ symbol
 */
export function formatCurrency(amount: number): string {
  return `৳${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Convert paisa to taka
 */
export function paisaToTaka(paisa: number): number {
  return paisa / 100;
}

/**
 * Convert taka to paisa
 */
export function takaToPaisa(taka: number): number {
  return Math.round(taka * 100);
}
