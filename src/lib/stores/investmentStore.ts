import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Investment } from '../types/investment';

interface InvestmentState {
  investments: Investment[];
  addInvestment: (investment: Investment) => void;
  updateInvestment: (id: string, investment: Partial<Investment>) => void;
  removeInvestment: (id: string) => void;
  getInvestment: (id: string) => Investment | undefined;
}

export const useInvestmentStore = create<InvestmentState>()(
  persist(
    (set, get) => ({
      investments: [],
      addInvestment: (investment) =>
        set((state) => ({
          investments: [...state.investments, investment],
        })),
      updateInvestment: (id, updatedInvestment) =>
        set((state) => ({
          investments: state.investments.map((inv) =>
            inv.id === id ? { ...inv, ...updatedInvestment } : inv
          ),
        })),
      removeInvestment: (id) =>
        set((state) => ({
          investments: state.investments.filter((inv) => inv.id !== id),
        })),
      getInvestment: (id) =>
        get().investments.find((inv) => inv.id === id),
    }),
    {
      name: 'investments-storage',
    }
  )
); 