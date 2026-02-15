/**
 * Currency formatting utility for Indian Rupees (INR)
 */

/**
 * Format a number or bigint as INR currency
 * @param amount - The amount to format (number or bigint)
 * @returns Formatted currency string with ₹ symbol
 */
export function formatINR(amount: number | bigint): string {
  const numericAmount = typeof amount === 'bigint' ? Number(amount) : amount;
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
}
