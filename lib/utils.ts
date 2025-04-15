import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ApplicationError extends Error {
  info: string;
  status: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      'An error occurred while fetching the data.',
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export function getLocalStorage(key: string, defaultValue: any = []) {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    try {
      return JSON.parse(item);
    } catch (e) {
      // If it's not JSON, return as is (for string values like API keys)
      return item;
    }
  }
  return defaultValue;
}

export function setLocalStorage(key: string, value: any) {
  if (typeof window !== 'undefined') {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  }
}

export function removeLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
}

// API Key management
export const API_KEY_STORAGE_KEY = 'heurist-api-key';

export function getApiKey(): string {
  return getLocalStorage(API_KEY_STORAGE_KEY, '');
}

export function setApiKey(apiKey: string): void {
  setLocalStorage(API_KEY_STORAGE_KEY, apiKey);
}

export function hasApiKey(): boolean {
  return !!getApiKey();
}
