import { Investment, InvestmentType } from '@/lib/types/investment';
import { SupabaseInvestmentRow, SupabaseInvestmentInsertData } from '@/lib/types/supabase';

/**
 * Convertit une donnée Supabase (snake_case) vers le format frontend (camelCase)
 */
export function mapSupabaseToInvestment(supabaseData: SupabaseInvestmentRow): Investment {
  return {
    id: supabaseData.id.toString(), // Convertir bigint en string
    type: supabaseData.type as InvestmentType,
    tokenId: supabaseData.token_id,
    symbol: supabaseData.symbol,
    name: supabaseData.name,
    quantity: supabaseData.quantity,
    purchasePrice: supabaseData.purchase_price,
    purchasePriceCurrency: supabaseData.purchase_price_currency,
    purchaseDate: new Date(supabaseData.purchase_date), // Convertir string ISO en Date
    // Les champs calculés seront ajoutés par les services
    currentPrice: undefined,
    profitLoss: undefined,
  };
}

/**
 * Convertit un investissement frontend (camelCase) vers le format Supabase (snake_case) pour insertion
 */
export function mapInvestmentToSupabaseInsert(
  investment: Omit<Investment, 'id' | 'currentPrice' | 'profitLoss'>,
  userId: string
): SupabaseInvestmentInsertData {
  return {
    type: investment.type,
    symbol: investment.symbol,
    token_id: investment.tokenId,
    name: investment.name,
    quantity: investment.quantity,
    purchase_price: investment.purchasePrice,
    purchase_price_currency: investment.purchasePriceCurrency,
    purchase_date: investment.purchaseDate.toISOString().split('T')[0], // Format YYYY-MM-DD
    user_id: userId,
  };
}

/**
 * Convertit un investissement frontend (camelCase) vers le format Supabase (snake_case) pour mise à jour
 */
export function mapInvestmentToSupabaseUpdate(
  investment: Partial<Investment> & { id: string },
  userId: string
): Partial<SupabaseInvestmentInsertData> & { id: number } {
  const update: any = {
    id: parseInt(investment.id), // Convertir string en number
  };

  if (investment.type !== undefined) update.type = investment.type;
  if (investment.symbol !== undefined) update.symbol = investment.symbol;
  if (investment.tokenId !== undefined) update.token_id = investment.tokenId;
  if (investment.name !== undefined) update.name = investment.name;
  if (investment.quantity !== undefined) update.quantity = investment.quantity;
  if (investment.purchasePrice !== undefined) update.purchase_price = investment.purchasePrice;
  if (investment.purchasePriceCurrency !== undefined) update.purchase_price_currency = investment.purchasePriceCurrency;
  if (investment.purchaseDate !== undefined) update.purchase_date = investment.purchaseDate.toISOString().split('T')[0];
  
  // S'assurer que user_id est toujours présent pour la sécurité
  update.user_id = userId;

  return update;
}

/**
 * Convertit un tableau d'investissements Supabase vers le format frontend
 */
export function mapSupabaseInvestmentsToInvestments(supabaseInvestments: SupabaseInvestmentRow[]): Investment[] {
  return supabaseInvestments.map(mapSupabaseToInvestment);
}

/**
 * Valide qu'un type d'investissement est valide
 */
export function isValidInvestmentType(type: string): type is InvestmentType {
  return type === 'crypto' || type === 'stock';
}

/**
 * Valide les données d'un investissement avant insertion
 */
export function validateInvestmentData(investment: Partial<Investment>): string[] {
  const errors: string[] = [];

  if (!investment.type || !isValidInvestmentType(investment.type)) {
    errors.push('Type d\'investissement invalide (doit être "crypto" ou "stock")');
  }
  
  if (!investment.symbol || investment.symbol.trim() === '') {
    errors.push('Le symbole est requis');
  }
  
  if (!investment.tokenId || investment.tokenId.trim() === '') {
    errors.push('L\'ID du token est requis');
  }
  
  if (!investment.name || investment.name.trim() === '') {
    errors.push('Le nom est requis');
  }
  
  if (!investment.quantity || investment.quantity <= 0) {
    errors.push('La quantité doit être supérieure à 0');
  }
  
  if (!investment.purchasePrice || investment.purchasePrice <= 0) {
    errors.push('Le prix d\'achat doit être supérieur à 0');
  }
  
  if (!investment.purchasePriceCurrency || investment.purchasePriceCurrency.trim() === '') {
    errors.push('La devise est requise');
  }
  
  if (!investment.purchaseDate || !(investment.purchaseDate instanceof Date)) {
    errors.push('La date d\'achat est requise et doit être une date valide');
  }

  return errors;
} 