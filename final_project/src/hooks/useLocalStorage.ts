import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        return JSON.parse(storedValue) as T;
      }
    } catch (error) {
      console.error("Error reading localStorage key:", key, error);
    }
    return initialValue;
  });
  const setStoredValue = (newValue: T | ((prevValue: T) => T)) => {
    try {
      const valueToStore =
        typeof newValue === "function"
          ? (newValue as (prevValue: T) => T)(value)
          : newValue;
      setValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error setting localStorage key:", key, error);
    }
  };
  return [value, setStoredValue] as const;
}
