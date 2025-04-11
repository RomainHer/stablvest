import { Investment } from '../types/investment';

const STORAGE_KEY = 'investments';

export class InvestmentStorage {
  static getAll(): Investment[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static save(investments: Investment[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(investments));
  }

  static add(investment: Investment): void {
    const investments = this.getAll();
    investments.push(investment);
    this.save(investments);
  }

  static update(id: string, updatedInvestment: Partial<Investment>): void {
    const investments = this.getAll();
    const index = investments.findIndex(i => i.id === id);
    if (index !== -1) {
      investments[index] = { ...investments[index], ...updatedInvestment };
      this.save(investments);
    }
  }

  static delete(id: string): void {
    const investments = this.getAll();
    const filtered = investments.filter(i => i.id !== id);
    this.save(filtered);
  }

  static clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }
} 