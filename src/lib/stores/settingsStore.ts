import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Currency } from '../types/settings';

interface SettingsState {
  currency: Currency;
  theme: string;
  setCurrency: (currency: Currency) => void;
  setTheme: (theme: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      currency: 'USD',
      theme: 'light',
      setCurrency: (currency) => set({ currency }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'settings-storage',
    }
  )
); 