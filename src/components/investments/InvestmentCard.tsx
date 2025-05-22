'use client';

import { Investment } from '@/lib/types/investment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, calculateProfitLoss } from '@/lib/utils';
import { useEffect, useState, useMemo } from 'react';
import { CryptoService } from '@/lib/services/crypto.service';
import { StockService } from '@/lib/services/stock.service';

interface InvestmentCardProps {
  investment: Investment;
}

export function InvestmentCard({ investment }: InvestmentCardProps) {

  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [profitLoss, setProfitLoss] = useState<number>(0);
  const profitLossPourcentage = useMemo(() => (profitLoss / (investment.quantity * investment.purchasePrice)) * 100, [profitLoss, investment.quantity, investment.purchasePrice]);

  useEffect(() => {
    if (investment.type === 'crypto') {
      CryptoService.getCurrentPrice(investment.tokenId).then((price) => {
        setCurrentPrice(price);
      });
    } else {  
      StockService.getCurrentPrice(investment.symbol).then((price) => {
        setCurrentPrice(price);
      });
    }
  }, [investment]);

  useEffect(() => {
    const profitLoss = calculateProfitLoss(
      investment.quantity,
      investment.purchasePrice,
      currentPrice
    );
    setProfitLoss(profitLoss);
  }, [investment, currentPrice]);

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
            <span className="text-sm text-muted-foreground">Quantity</span>
            <span>{investment.quantity.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Purchase Price</span>
            <span>{formatCurrency(investment.purchasePrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Current Price</span>
            <span>{formatCurrency(currentPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Purchase Date</span>
            <span>{formatDate(investment.purchaseDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Profit/Loss</span>
            <span className={profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
              {formatCurrency(profitLoss)} ({profitLossPourcentage.toFixed(2)}%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 