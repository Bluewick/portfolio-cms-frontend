import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines conditional class names and resolves Tailwind CSS conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats API error messages into human-readable strings
 */
export function getErrorMessage(error, fallback = 'An unexpected error occurred') {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return fallback;
}