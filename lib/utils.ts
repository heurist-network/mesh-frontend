import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_KEY_STORAGE_KEY = 'heurist-api-key';

export const getApiKey = (): string => {
  if (typeof window === 'undefined') return '';
  const item = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (!item) return '';
  try {
    return JSON.parse(item);
  } catch {
    return item;
  }
};

export const setApiKey = (apiKey: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  }
};

export const hasApiKey = (): boolean => Boolean(getApiKey());

export const scrollToAgentSelection = (
  setOpenMobile?: (open: boolean) => void,
) => {
  const agentSelectionSection = document.querySelector(
    '[data-agent-selection]',
  );
  if (agentSelectionSection) {
    agentSelectionSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    if (setOpenMobile) {
      setOpenMobile(false);
    }
  }
};
