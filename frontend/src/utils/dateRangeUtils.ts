/**
 * Converts a period string to a date range with ISO date strings
 * @param period - The period value: "today", "7d", "30d", "month", or "custom"
 * @returns Object with from and to ISO date strings (YYYY-MM-DD), or null if period is "custom"
 */
export function getPeriodDateRange(period: string): { from: string; to: string } | null {
  if (period === 'custom') {
    return null; // Custom range should use its own from/to state
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const toDate = new Date(today);
  toDate.setHours(23, 59, 59, 999);
  const toIso = toDate.toISOString().split('T')[0];

  if (period === 'today') {
    const fromIso = today.toISOString().split('T')[0];
    return { from: fromIso, to: toIso };
  }

  if (period === '7d') {
    const fromDate = new Date(today);
    fromDate.setDate(fromDate.getDate() - 6);
    const fromIso = fromDate.toISOString().split('T')[0];
    return { from: fromIso, to: toIso };
  }

  if (period === '30d') {
    const fromDate = new Date(today);
    fromDate.setDate(fromDate.getDate() - 29);
    const fromIso = fromDate.toISOString().split('T')[0];
    return { from: fromIso, to: toIso };
  }

  if (period === 'month') {
    const firstDay = new Date(today);
    firstDay.setDate(1);
    const fromIso = firstDay.toISOString().split('T')[0];
    return { from: fromIso, to: toIso };
  }

  // Default to 7d
  const fromDate = new Date(today);
  fromDate.setDate(fromDate.getDate() - 6);
  const fromIso = fromDate.toISOString().split('T')[0];
  return { from: fromIso, to: toIso };
}
