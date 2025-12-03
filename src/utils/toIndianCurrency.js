/**
 * Convert a number to Indian currency format
 * @param {number|string} amount - The number to convert
 * @returns {string} - Formatted currency string (₹)
 */
export const toIndianCurrency = (amount) => {
  if (!amount && amount !== 0) return "₹0.00";

  const num = Number(amount);

  if (isNaN(num)) return "₹0.00";

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

// Examples
// console.log(toIndianCurrency(1234567)); // ₹12,34,567.00
// console.log(toIndianCurrency("98765.43")); // ₹98,765.43
// console.log(toIndianCurrency(0)); // ₹0.00

