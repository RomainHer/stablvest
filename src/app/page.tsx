'use client';

import { useEffect, useState } from 'react';
import { Investment } from '@/lib/types/investment';
import { InvestmentStorage } from '@/lib/storage/investmentStorage';
import { PerformanceChart } from '@/components/investments/PerformanceChart';
import { ProfitLossIndicators } from '@/components/investments/ProfitLossIndicators';
import { InvestmentCard } from '@/components/investments/InvestmentCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const [investments, setInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    const storedInvestments = InvestmentStorage.getAll();
    setInvestments(storedInvestments);
  }, []);

  return (
    <main className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <ProfitLossIndicators investments={investments} />
      
      <PerformanceChart investments={investments} />
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Investments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {investments.slice(0, 6).map((investment) => (
              <InvestmentCard key={investment.id} investment={investment} />
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
} 