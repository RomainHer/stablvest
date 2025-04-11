export type InvestmentType = 'crypto' | 'stock';

export interface Investment {
  id: string;
  type: InvestmentType;
  idToken: string;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: Date;
  currentPrice?: number;
  profitLoss?: number;
}

export interface Portfolio {
  totalValue: number;
  totalInvested: number;
  totalProfitLoss: number;
  allInvestments: Investment[];
  profitableInvestments: Investment[];
  unprofitableInvestments: Investment[];
} 