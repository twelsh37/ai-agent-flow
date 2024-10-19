import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge and deduplicate class names
 * 
 * This function combines the functionality of clsx and tailwind-merge.
 * It first uses clsx to conditionally join classNames, then uses
 * tailwind-merge to intelligently merge Tailwind CSS classes.
 *
 * @param {...ClassValue[]} inputs - Any number of class values, which can be
 *                                   strings, objects, or arrays
 * @returns {string} A string of merged and deduplicated class names
 *
 * @example
 * cn('px-2 py-1 bg-red-500', 'hover:bg-red-600', { 'text-white': true, 'font-bold': false })
 * // Returns: "px-2 py-1 bg-red-500 hover:bg-red-600 text-white"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
