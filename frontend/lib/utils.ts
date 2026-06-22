/**
 * Formats a number into a Vietnamese Dong currency string (e.g. 150.000đ).
 */
export function formatVnd(price: number | null | undefined): string {
  if (price === null || price === undefined) return '0đ';
  return `${Math.round(price).toLocaleString('vi-VN')}đ`;
}

/**
 * Utility helper to join class names together dynamically.
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formats a Date object or ISO string into a local Vietnamese date string (e.g., DD/MM/YYYY).
 */
export function formatDate(dateStr: string | Date | undefined): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN');
}
