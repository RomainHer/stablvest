export type InvestmentType = 'crypto' | 'stock';

export interface Investment {
  id: string;
  type: InvestmentType;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: Date;
  currentPrice?: number;
  profitLoss?: number;
}

export interface Transaction {
  id: string;
  investmentId: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  date: Date;
}

export interface Portfolio {
  totalValue: number;
  totalInvested: number;
  totalProfitLoss: number;
  investments: Investment[];
} 