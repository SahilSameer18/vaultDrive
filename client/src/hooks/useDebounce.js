import { useState, useEffect } from "react";

/**
 * Custom hook to debounce any rapidly changing value.
 * @param {any} value - The input value to debounce (e.g. searchQuery)
 * @param {number} delay - Debounce delay in milliseconds (default 400ms)
 * @returns {any} debouncedValue
 */
export function useDebounce(value, delay = 400) {

  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
