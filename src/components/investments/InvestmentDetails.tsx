import { Investment } from '@/lib/types/investment';
import { currencyFormatted } from '@/lib/utils';

type InvestmentDetailsProps = {
  investment: Investment;
  currency: string;
};

export function InvestmentDetails({ investment, currency }: InvestmentDetailsProps) {
  const totalValue = ((investment.currentPrice ?? 0) * investment.quantity).toFixed(2);
  const profitLossValue = investment.profitLoss ?? 0;
  const profitLoss = profitLossValue.toFixed(2);
  const isProfit = profitLossValue >= 0;

  return (
    <div className="bg-card p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-t border-border/50">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold">{investment.name}</h3>
          <p className="text-sm text-muted-foreground">{investment.symbol}</p>
        </div>
        <p className="font-bold">
          {totalValue} {currencyFormatted(currency)}{' '}
          <span className={isProfit ? 'text-green-500' : 'text-red-500'}>
            ({isProfit ? '+' : ''} {profitLoss} {currencyFormatted(currency)})
          </span>
        </p>
      </div>
      <div className="mt-4">
        <p>Quantité: {investment.quantity}</p>
        <p>
          Prix actuel: {investment.currentPrice?.toFixed(2)} {currencyFormatted(currency)}
        </p>
        <p>
          Investissement de départ: {investment.purchasePrice.toFixed(2)} {currencyFormatted(currency)}
        </p>
        <p>
          Pourcentage de gain:{' '}
          <span className={isProfit ? 'text-green-500' : 'text-red-500'}>
            {(((investment.profitLoss ?? 0) / investment.purchasePrice) * 100).toFixed(2)}%
          </span>
        </p>
      </div>
    </div>
  );
}


