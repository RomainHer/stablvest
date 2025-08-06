import { Investment, Portfolio } from '@/lib/types/investment';
import { SupabaseInvestmentService } from './investment.service';
import { CryptoService } from '../crypto.service';
import { StockService } from '../stock.service';
import { CurrencyService } from '../currency.service';
import { useSettingsStore } from '../../stores/settingsStore';

export class SupabasePortfolioService {
  /**
   * Calcule le portfolio complet avec les prix actuels
   */
  static async calculatePortfolio(): Promise<Portfolio> {
    try {
      // Récupérer tous les investissements de l'utilisateur
      const investments = await SupabaseInvestmentService.getAll();
      
      if (investments.length === 0) {
        return {
          totalValue: 0,
          totalInvested: 0,
          totalProfitLoss: 0,
          allInvestments: [],
          profitableInvestments: [],
          unprofitableInvestments: [],
        };
      }

      const currentCurrency = useSettingsStore.getState().currency.toLowerCase();
      let totalInvested = 0;
      let totalValue = 0;

      // Calculer les valeurs et profits pour chaque investissement
      const investmentsWithProfit = await Promise.all(
        investments.map(async (investment) => {
          try {
            const currentPrice = await this.getCurrentPrice(investment);
            const investmentValue = investment.quantity * currentPrice;

            // Convertir le prix d'achat vers la devise actuelle si nécessaire
            const convertedPurchasePrice = await CurrencyService.convertCurrency(
              investment.purchasePrice,
              investment.purchasePriceCurrency.toLowerCase(),
              currentCurrency
            );

            const profitLoss = investmentValue - convertedPurchasePrice;

            totalInvested += convertedPurchasePrice;
            totalValue += investmentValue;

            return {
              ...investment,
              currentPrice,
              profitLoss,
            };
          } catch (error) {
            console.error(`Erreur lors du calcul pour l'investissement ${investment.id}:`, error);
            // En cas d'erreur, utiliser le prix d'achat comme valeur actuelle
            return {
              ...investment,
              currentPrice: investment.purchasePrice,
              profitLoss: 0,
            };
          }
        })
      );

      return {
        totalValue,
        totalInvested,
        totalProfitLoss: totalValue - totalInvested,
        allInvestments: investmentsWithProfit,
        profitableInvestments: investmentsWithProfit.filter(investment => investment.profitLoss > 0),
        unprofitableInvestments: investmentsWithProfit.filter(investment => investment.profitLoss <= 0),
      };
    } catch (error) {
      console.error('Erreur SupabasePortfolioService.calculatePortfolio:', error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques du portfolio
   */
  static async getPortfolioStats(): Promise<{
    totalInvestments: number;
    totalValue: number;
    totalInvested: number;
    totalProfitLoss: number;
    profitLossPercentage: number;
  }> {
    try {
      const portfolio = await this.calculatePortfolio();
      
      const profitLossPercentage = portfolio.totalInvested > 0 
        ? (portfolio.totalProfitLoss / portfolio.totalInvested) * 100 
        : 0;

      return {
        totalInvestments: portfolio.allInvestments.length,
        totalValue: portfolio.totalValue,
        totalInvested: portfolio.totalInvested,
        totalProfitLoss: portfolio.totalProfitLoss,
        profitLossPercentage,
      };
    } catch (error) {
      console.error('Erreur SupabasePortfolioService.getPortfolioStats:', error);
      throw error;
    }
  }

  /**
   * Récupère les investissements les plus performants
   */
  static async getTopPerformers(limit: number = 5): Promise<Investment[]> {
    try {
      const portfolio = await this.calculatePortfolio();
      
      return portfolio.profitableInvestments
        .sort((a, b) => (b.profitLoss || 0) - (a.profitLoss || 0))
        .slice(0, limit);
    } catch (error) {
      console.error('Erreur SupabasePortfolioService.getTopPerformers:', error);
      throw error;
    }
  }

  /**
   * Récupère les investissements les moins performants
   */
  static async getWorstPerformers(limit: number = 5): Promise<Investment[]> {
    try {
      const portfolio = await this.calculatePortfolio();
      
      return portfolio.unprofitableInvestments
        .sort((a, b) => (a.profitLoss || 0) - (b.profitLoss || 0))
        .slice(0, limit);
    } catch (error) {
      console.error('Erreur SupabasePortfolioService.getWorstPerformers:', error);
      throw error;
    }
  }

  /**
   * Récupère les investissements par type
   */
  static async getInvestmentsByType(type: 'crypto' | 'stock'): Promise<Investment[]> {
    try {
      const investments = await SupabaseInvestmentService.getAll();
      return investments.filter(inv => inv.type === type);
    } catch (error) {
      console.error('Erreur SupabasePortfolioService.getInvestmentsByType:', error);
      throw error;
    }
  }

  /**
   * Calcule la répartition par type d'investissement
   */
  static async getTypeDistribution(): Promise<{
    crypto: { count: number; value: number; percentage: number };
    stock: { count: number; value: number; percentage: number };
  }> {
    try {
      const portfolio = await this.calculatePortfolio();
      
      const cryptoInvestments = portfolio.allInvestments.filter(inv => inv.type === 'crypto');
      const stockInvestments = portfolio.allInvestments.filter(inv => inv.type === 'stock');
      
      const cryptoValue = cryptoInvestments.reduce((sum, inv) => sum + ((inv.currentPrice || 0) * inv.quantity), 0);
      const stockValue = stockInvestments.reduce((sum, inv) => sum + ((inv.currentPrice || 0) * inv.quantity), 0);
      
      const totalValue = portfolio.totalValue;
      
      return {
        crypto: {
          count: cryptoInvestments.length,
          value: cryptoValue,
          percentage: totalValue > 0 ? (cryptoValue / totalValue) * 100 : 0,
        },
        stock: {
          count: stockInvestments.length,
          value: stockValue,
          percentage: totalValue > 0 ? (stockValue / totalValue) * 100 : 0,
        },
      };
    } catch (error) {
      console.error('Erreur SupabasePortfolioService.getTypeDistribution:', error);
      throw error;
    }
  }

  /**
   * Récupère le prix actuel d'un investissement
   */
  private static async getCurrentPrice(investment: Investment): Promise<number> {
    try {
      if (investment.type === 'crypto') {
        return await CryptoService.getCurrentPrice(investment.tokenId);
      } else {
        return await StockService.getCurrentPrice(investment.symbol);
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération du prix pour ${investment.symbol}:`, error);
      // En cas d'erreur, retourner le prix d'achat
      return investment.purchasePrice;
    }
  }
} 