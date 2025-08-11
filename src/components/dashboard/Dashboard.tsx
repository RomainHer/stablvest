'use client';

import { useEffect, useState } from 'react';
import { Investment, Portfolio } from '@/lib/types/investment';
import { SupabaseInvestmentService } from '@/lib/services/supabase/investment.service';
import { PerformanceChart } from '@/components/investments/PerformanceChart';
import { ProfitLossIndicators } from '@/components/investments/ProfitLossIndicators';
import { InvestmentCard } from '@/components/investments/InvestmentCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SupabasePortfolioService } from '@/lib/services/supabase/portfolio.service';

export function Dashboard() {
  const [portfolio, setPortfolio] = useState<Portfolio>({
    totalValue: 0,
    totalInvested: 0,
    totalProfitLoss: 0,
    allInvestments: [],
    profitableInvestments: [],
    unprofitableInvestments: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await SupabasePortfolioService.calculatePortfolio();
        setPortfolio(data);
      } catch (e: any) {
        setError(e?.message || 'Erreur lors du chargement des investissements');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {loading && (
        <div className="text-sm text-muted-foreground">Chargement des investissements...</div>
      )}
      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}
      
      <ProfitLossIndicators portfolio={portfolio} />
      
      <PerformanceChart investments={portfolio.allInvestments} />
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Investments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {portfolio.allInvestments.length === 0 ? (
              <div className="text-sm text-muted-foreground">Aucun investissement pour le moment.</div>
            ) : (
              portfolio.allInvestments.slice(0, 3).map((investment) => (
                <InvestmentCard key={investment.id} investment={investment} />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
} 