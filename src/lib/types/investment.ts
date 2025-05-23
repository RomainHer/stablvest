export type InvestmentType = 'crypto' | 'stock';

export interface Investment {
  id: string;
  type: InvestmentType;
  tokenId: string;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  purchasePriceCurrency: string;
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