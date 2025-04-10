import { Investment, Portfolio } from '../types/investment';
import { CryptoService } from './crypto.service';
import { StockService } from './stock.service';

export class PortfolioService {
  static async calculatePortfolio(investments: Investment[]): Promise<Portfolio> {
    let totalInvested = 0;
    let totalValue = 0;

    for (const investment of investments) {
      const currentPrice = await this.getCurrentPrice(investment);
      const investmentValue = investment.quantity * currentPrice;
      const investedAmount = investment.quantity * investment.purchasePrice;

      totalInvested += investedAmount;
      totalValue += investmentValue;
    }

    return {
      totalValue,
      totalInvested,
      totalProfitLoss: totalValue - totalInvested,
      investments: await Promise.all(
        investments.map(async (investment) => ({
          ...investment,
          currentPrice: await this.getCurrentPrice(investment),
          profitLoss: await this.calculateProfitLoss(investment),
        }))
      ),
    };
  }

  private static async getCurrentPrice(investment: Investment): Promise<number> {
    if (investment.type === 'crypto') {
      return CryptoService.getCurrentPrice(investment.symbol);
    } else {
      return StockService.getCurrentPrice(investment.symbol);
    }
  }

  private static async calculateProfitLoss(investment: Investment): Promise<number> {
    const currentPrice = await this.getCurrentPrice(investment);
    return (currentPrice - investment.purchasePrice) * investment.quantity;
  }
} 