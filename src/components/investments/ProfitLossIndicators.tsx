'use client';

import { Investment, Portfolio } from '@/lib/types/investment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { PortfolioService } from '@/lib/services/portfolio.service';
import { useEffect, useState } from 'react';

interface ProfitLossIndicatorsProps {
  investments: Investment[];
}

export function ProfitLossIndicators({ investments }: ProfitLossIndicatorsProps) {

  const [portfolio, setPortfolio] = useState<Portfolio>({
    totalValue: 0,
    totalInvested: 0,
    totalProfitLoss: 0,
    allInvestments: [],
    profitableInvestments: [],
    unprofitableInvestments: [],
  });

  useEffect(() => {
    PortfolioService.calculatePortfolio(investments).then((portfolio) => {
        setPortfolio(portfolio);
    });
  }, [investments]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(portfolio.totalInvested)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(portfolio.totalValue)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${portfolio.totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(portfolio.totalProfitLoss)}
          </div>
          <p className="text-xs text-muted-foreground">
            {portfolio.profitableInvestments.length} of {portfolio.allInvestments.length} investments are profitable
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 