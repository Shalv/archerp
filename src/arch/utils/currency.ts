// Centralized INR currency formatting for the entire CRM.
// Uses the Indian numbering system (lakh / crore grouping) via Intl so every
// screen renders monetary values consistently as ₹ amounts.

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const inrNumberFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

/** Formats a number as a full INR currency string, e.g. ₹85,00,000 */
export const formatINR = (value: number | undefined | null): string => {
  if (value === undefined || value === null || Number.isNaN(value)) return '₹0';
  return inrFormatter.format(value);
};

/** Formats a plain number with Indian digit grouping, no currency symbol, e.g. 85,00,000 */
export const formatIndianNumber = (value: number | undefined | null): string => {
  if (value === undefined || value === null || Number.isNaN(value)) return '0';
  return inrNumberFormatter.format(value);
};

/**
 * Formats a number as a compact Indian currency string using Lakh (L) / Crore (Cr)
 * suffixes, which is the conventional shorthand in Indian real estate & construction
 * commercial documents, e.g. ₹1.25 Cr, ₹42.5 L, ₹85,000
 */
export const formatINRCompact = (value: number | undefined | null): string => {
  if (value === undefined || value === null || Number.isNaN(value)) return '₹0';
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 1_00_00_000) {
    return `${sign}₹${(abs / 1_00_00_000).toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  if (abs >= 1_00_000) {
    return `${sign}₹${(abs / 1_00_000).toFixed(2).replace(/\.00$/, '')} L`;
  }
  return formatINR(value);
};
