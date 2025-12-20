/**
 * Deep clone an object or array using structuredClone (modern browsers)
 * Falls back to JSON parse/stringify for older environments
 */
export function deepClone<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  // Fallback for older environments
  return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * Sort array by a property or multiple properties
 * @param array Array to sort
 * @param keys Property key(s) to sort by
 * @returns Sorted array
 */
export function sortBy<T>(array: T[], keys: (keyof T)[]): T[] {
  return [...array].sort((a, b) => {
    for (const key of keys) {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
    }
    return 0;
  });
}

/**
 * Sort array by properties with custom order (asc/desc)
 * @param array Array to sort
 * @param keys Property key(s) to sort by
 * @param orders Sort order(s) - 'asc' or 'desc'
 * @returns Sorted array
 */
export function orderBy<T>(array: T[], keys: (keyof T)[], orders: ("asc" | "desc")[]): T[] {
  return [...array].sort((a, b) => {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const order = orders[i] || "asc";

      const aVal = a[key];
      const bVal = b[key];

      let comparison = 0;
      if (aVal < bVal) comparison = -1;
      if (aVal > bVal) comparison = 1;

      if (comparison !== 0) {
        return order === "asc" ? comparison : -comparison;
      }
    }
    return 0;
  });
}
