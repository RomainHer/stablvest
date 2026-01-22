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
  transactionFee?: number | null; // Mapping: transaction_fee
  transactionFeeCurrency?: string | null; // Mapping: transaction_fee_currency
  currentPrice?: number; // Calculé côté frontend
  profitLoss?: number; // Calculé côté frontend
  convertedPurchasePrice?: number; // Prix d'achat unitaire converti dans la devise d'affichage
  effectivePurchasePrice?: number; // Prix incluant les frais
  totalFeesInDisplayCurrency?: number; // Frais convertis en devise d'affichage
  // Note: user_id sera géré par l'authentification, pas exposé dans cette interface
}

export interface Portfolio {
  totalValue: number;
  totalInvested: number;
  totalProfitLoss: number;
  totalFees: number; // Total des frais payés sur tous les investissements
  allInvestments: Investment[];
  profitableInvestments: Investment[];
  unprofitableInvestments: Investment[];
} 