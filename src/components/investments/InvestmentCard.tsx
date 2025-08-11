'use client';

import { Investment } from '@/lib/types/investment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { currencyFormatted, formatDate } from '@/lib/utils';
import { useEffect, useState, useMemo } from 'react';
import { CryptoService } from '@/lib/services/crypto.service';
import { StockService } from '@/lib/services/stock.service';
import { useSettingsStore } from '@/lib/stores/settingsStore';

interface InvestmentCardProps {
  investment: Investment;
}

export function InvestmentCard({ investment }: InvestmentCardProps) {

  const { currency } = useSettingsStore();

  const formatNumber = (amount: number): string =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {investment.name} ({investment.symbol.toUpperCase()})
        </CardTitle>
        <Badge variant={investment.type === 'crypto' ? 'secondary' : 'default'}>
          {investment.type}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Purchase Date</span>
            <span>{formatDate(investment.purchaseDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Quantity</span>
            <span>{investment.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Purchase Price</span>
            <span>{`${currencyFormatted(investment.purchasePriceCurrency)} ${formatNumber(investment.purchasePrice)}`}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Current Price</span>
            <span>{`${currencyFormatted(currency)} ${formatNumber(investment.quantity * (investment.currentPrice ?? 0))}`}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Profit/Loss</span>
            <span className={investment.profitLoss && investment.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
              {`${currencyFormatted(currency)} ${formatNumber(investment.profitLoss ?? 0)}`} ({formatNumber((investment.profitLoss ?? 0)/(investment.purchasePrice)*100)}%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 