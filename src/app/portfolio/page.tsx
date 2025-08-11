'use client';

import { useState, useEffect } from 'react';
import { Investment, Portfolio } from '@/lib/types/investment';
import { SupabasePortfolioService } from '@/lib/services/supabase/portfolio.service';
import { SupabaseInvestmentService } from '@/lib/services/supabase/investment.service';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSettingsStore } from '@/lib/stores/settingsStore';
import { currencyFormatted } from '@/lib/utils';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { InvestmentDetails } from '@/components/investments/InvestmentDetails';
import { ProfitLossIndicators } from '@/components/investments/ProfitLossIndicators';

export default function PortfolioPage() {
  const currency = useSettingsStore.getState().currency;

  const [portfolio, setPortfolio] = useState<Portfolio>({
    totalValue: 0,
    totalInvested: 0,
    totalProfitLoss: 0,
    allInvestments: [],
    profitableInvestments: [],
    unprofitableInvestments: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setLoading(true);
        const computed = await SupabasePortfolioService.calculatePortfolio();
        setPortfolio(computed);
      } catch (e: any) {
        setError(e?.message || 'Erreur lors du chargement du portfolio');
      } finally {
        setLoading(false);
      }
    };
    loadPortfolio();
  }, []);

  const handleAddTransaction = async (
    investment: Omit<Investment, 'id' | 'currentPrice' | 'profitLoss' | 'purchasePriceCurrency'>
  ) => {
    try {
      setLoading(true);
      await SupabaseInvestmentService.add({
        ...investment,
        purchasePriceCurrency: currency,
      } as Omit<Investment, 'id'>);
      const computed = await SupabasePortfolioService.calculatePortfolio();
      setPortfolio(computed);
      setIsFormOpen(false);
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de l\'ajout de l\'investissement');
    } finally {
      setLoading(false);
    }
  };

  const filteredInvestments = portfolio?.allInvestments.filter(
    (investment: Investment) =>
      investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <div className="flex items-center gap-4">
            <Input
              type="text"
              placeholder="Rechercher un investissement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button disabled={loading}>Ajouter un investissement</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un investissement</DialogTitle>
                </DialogHeader>
                <TransactionForm onSubmit={handleAddTransaction} onClose={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {loading && (
          <div className="mb-4 text-sm text-muted-foreground">Chargement du portfolio...</div>
        )}
        {error && (
          <div className="mb-4 text-sm text-red-600">{error}</div>
        )}

        {portfolio && (
          <div className="mb-6">
            <ProfitLossIndicators portfolio={portfolio} />
          </div>
        )}

        {portfolio && portfolio.allInvestments.length === 0 ? (
          <div className="text-sm text-muted-foreground">Aucun investissement pour le moment. Ajoutez votre premier investissement.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInvestments?.map((investment: Investment) => (
              <InvestmentDetails
                key={investment.id}
                investment={investment}
                currency={currency}
              />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 