/**
 * Formats numbers into Sri Lankan Rupee currency format (Rs. X,XXX,XXX)
 */
export function formatLKR(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return "Rs. 0";
  return `Rs. ${amount.toLocaleString("en-LK")}`;
}

/**
 * Formats large amounts into readable abbreviations (e.g. Rs. 485 Million or Rs. 48.5 Cr)
 */
export function formatLKRShort(amount: number): string {
  if (amount >= 1000000000) {
    return `Rs. ${(amount / 1000000000).toFixed(2)} Billion`;
  }
  if (amount >= 1000000) {
    return `Rs. ${(amount / 1000000).toFixed(1)} Million`;
  }
  if (amount >= 100000) {
    return `Rs. ${(amount / 100000).toFixed(1)} Lakhs`;
  }
  return `Rs. ${amount.toLocaleString("en-LK")}`;
}

/**
 * Formats property price with /mo suffix if rental
 */
export function formatPropertyPrice(price: number, listingType?: "For Sale" | "For Rent"): string {
  const base = formatLKR(price);
  if (listingType === "For Rent") {
    return `${base} /mo`;
  }
  return base;
}
