import { Investment, Portfolio } from '../types/investment';
import { CryptoService } from './crypto.service';
import { StockService } from './stock.service';
import { CurrencyService } from './currency.service';
import { useSettingsStore } from '../stores/settingsStore';

export class PortfolioService {
  static async calculatePortfolio(investments: Investment[]): Promise<Portfolio> {
    let totalInvested = 0;
    let totalValue = 0;
    const currentCurrency = useSettingsStore.getState().currency.toLowerCase();

    for (const investment of investments) {
      const currentPrice = await this.getCurrentPrice(investment);
      const investmentValue = investment.quantity * currentPrice;

      // Convert purchase price to current currency if needed
      const convertedPurchasePrice = await CurrencyService.convertCurrency(
        investment.purchasePrice,
        investment.purchasePriceCurrency.toLowerCase(),
        currentCurrency
      );

      totalInvested += convertedPurchasePrice * investment.quantity;
      totalValue += investmentValue;
    }

    const investmentsWithProfit = await Promise.all(
      investments.map(async (investment) => {
        const currentPrice = await this.getCurrentPrice(investment);
        const convertedPurchasePrice = await CurrencyService.convertCurrency(
          investment.purchasePrice,
          investment.purchasePriceCurrency.toLowerCase(),
          currentCurrency
        );
        const profitLoss = currentPrice * investment.quantity - (convertedPurchasePrice * investment.quantity);

        return {
          ...investment,
          currentPrice,
          profitLoss,
        };
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
  }

  private static async getCurrentPrice(investment: Investment): Promise<number> {
    if (investment.type === 'crypto') {
      return CryptoService.getCurrentPrice(investment.tokenId);
    } else {
      return StockService.getCurrentPrice(investment.symbol);
    }
  }

  private static async calculateProfitLoss(investment: Investment): Promise<number> {
    const currentPrice = await this.getCurrentPrice(investment);
    const currentCurrency = useSettingsStore.getState().currency.toLowerCase();

    const convertedPurchasePrice = await CurrencyService.convertCurrency(
      investment.purchasePrice,
      investment.purchasePriceCurrency.toLowerCase(),
      currentCurrency
    );

    return currentPrice * investment.quantity - (convertedPurchasePrice * investment.quantity);
  }
} 