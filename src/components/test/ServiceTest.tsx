'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CryptoService } from '@/lib/services/crypto.service';
import { StockService } from '@/lib/services/stock.service';
import { PortfolioService } from '@/lib/services/portfolio.service';
import { Investment } from '@/lib/types/investment';

interface TestResults {
  crypto?: string;
  stock?: string;
  portfolio?: string;
}

export function ServiceTest() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestResults>({});

  const testCryptoService = async () => {
    setLoading(true);
    try {
      const btcPrice = await CryptoService.getCurrentPrice('bitcoin');
      setResults((prev: TestResults) => ({ ...prev, crypto: `Bitcoin price: $${btcPrice}` }));
    } catch (error: unknown) {
      setResults((prev: TestResults) => ({ ...prev, crypto: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }));
    }
    setLoading(false);
  };

  const testStockService = async () => {
    setLoading(true);
    try {
      const aaplPrice = await StockService.getCurrentPrice('AAPL');
      setResults((prev: TestResults) => ({ ...prev, stock: `Apple stock price: $${aaplPrice}` }));
    } catch (error: unknown) {
      setResults((prev: TestResults) => ({ ...prev, stock: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }));
    }
    setLoading(false);
  };

  const testPortfolioService = async () => {
    setLoading(true);
    try {
      const testInvestments: Investment[] = [
        {
          id: '1',
          type: 'crypto',
          symbol: 'bitcoin',
          name: 'Bitcoin',
          quantity: 0.5,
          purchasePrice: 50000,
          purchaseDate: new Date('2023-01-01'),
        },
        {
          id: '2',
          type: 'stock',
          symbol: 'AAPL',
          name: 'Apple',
          quantity: 10,
          purchasePrice: 150,
          purchaseDate: new Date('2023-01-01'),
        },
      ];

      const portfolio = await PortfolioService.calculatePortfolio(testInvestments);
      setResults((prev: TestResults) => ({ ...prev, portfolio: JSON.stringify(portfolio, null, 2) }));
    } catch (error: unknown) {
      setResults((prev: TestResults) => ({ ...prev, portfolio: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }));
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Service Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-x-2">
            <Button onClick={testCryptoService} disabled={loading}>
              Test Crypto Service
            </Button>
            <Button onClick={testStockService} disabled={loading}>
              Test Stock Service
            </Button>
            <Button onClick={testPortfolioService} disabled={loading}>
              Test Portfolio Service
            </Button>
          </div>

          {results.crypto && (
            <div className="p-4 bg-muted rounded-md">
              <h3 className="font-semibold mb-2">Crypto Service Result:</h3>
              <pre>{results.crypto}</pre>
            </div>
          )}

          {results.stock && (
            <div className="p-4 bg-muted rounded-md">
              <h3 className="font-semibold mb-2">Stock Service Result:</h3>
              <pre>{results.stock}</pre>
            </div>
          )}

          {results.portfolio && (
            <div className="p-4 bg-muted rounded-md">
              <h3 className="font-semibold mb-2">Portfolio Service Result:</h3>
              <pre>{results.portfolio}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 