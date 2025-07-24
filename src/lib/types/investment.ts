export type InvestmentType = 'crypto' | 'stock';

export interface Investment {
  id: string; // Sera string côté frontend (converti depuis bigint Supabase)
  type: InvestmentType;
  tokenId: string; // Mapping: token_id
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number; // Mapping: purchase_price
  purchasePriceCurrency: string; // Mapping: purchase_price_currency
  purchaseDate: Date; // Mapping: purchase_date (converti depuis string ISO)
  currentPrice?: number; // Calculé côté frontend
  profitLoss?: number; // Calculé côté frontend
  // Note: user_id sera géré par l'authentification, pas exposé dans cette interface
}

export interface Portfolio {
  totalValue: number;
  totalInvested: number;
  totalProfitLoss: number;
  allInvestments: Investment[];
  profitableInvestments: Investment[];
  unprofitableInvestments: Investment[];
} 