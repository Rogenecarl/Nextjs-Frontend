import { useState, useEffect } from 'react';

/**
 * A custom hook to debounce a value.
 *
 * @param value The value to debounce (e.g., a search term).
 * @param delay The debounce delay in milliseconds.
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set up a timer to update the debounced value after the specified delay
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clean up the timer if the value changes before the delay has passed
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]); // Re-run the effect only if the value or delay changes

    return debouncedValue;
}