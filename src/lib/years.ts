function assertValidYear(year: number): void {
  if (!Number.isInteger(year) || year === 0) {
    throw new RangeError(`Invalid year: ${year} (year 0 does not exist)`);
  }
}

/** Spanish thousand grouping ("."), only for values >= 10000. */
function formatMagnitude(n: number): string {
  const abs = Math.abs(n);
  if (abs < 10000) return String(abs);
  return String(abs).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Negative = BCE. 1969 -> "1969", 117 -> "117 d.C.", -500 -> "500 a.C.". */
export function formatYear(year: number): string {
  assertValidYear(year);
  if (year < 0) return `${formatMagnitude(year)} a.C.`;
  if (year < 1000) return `${year} d.C.`;
  return formatMagnitude(year);
}

export function formatYearRange(start: number, end: number, override?: string): string {
  if (override) return override;
  assertValidYear(start);
  assertValidYear(end);
  const dash = " – ";
  if (start < 0 && end < 0) return `${formatMagnitude(start)}${dash}${formatYear(end)}`;
  if (start < 0) return `${formatYear(start)}${dash}${formatYear(end)}`;
  // Both CE: suffix once, only when the end year is below 1000.
  if (end < 1000) return `${start}${dash}${end} d.C.`;
  return `${formatMagnitude(start)}${dash}${formatMagnitude(end)}`;
}

/** Signed number of calendar years from a to b, skipping the nonexistent year 0. */
export function yearsBetween(a: number, b: number): number {
  assertValidYear(a);
  assertValidYear(b);
  const diff = b - a;
  if (a < 0 && b > 0) return diff - 1;
  if (a > 0 && b < 0) return diff + 1;
  return diff;
}
