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
import { InvestmentCard } from '@/components/investments/InvestmentCard';

export default function PortfolioPage() {
  const currency = useSettingsStore.getState().currency;

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-card p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">Valeur totale</h3>
              <p className="text-2xl font-bold">{portfolio.totalValue.toFixed(2)} {currencyFormatted(currency)}</p>
            </div>
            <div className="bg-card p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">Investi total</h3>
              <p className="text-2xl font-bold">{portfolio.totalInvested.toFixed(2)} {currencyFormatted(currency)}</p>
            </div>
            <div className="bg-card p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">Profit/Perte</h3>
              <p className={`text-2xl font-bold ${portfolio.totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {portfolio.totalProfitLoss.toFixed(2)} {currencyFormatted(currency)}
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">Pourcentage de gain</h3>
              <p className={`text-2xl font-bold ${portfolio.totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {((portfolio.totalProfitLoss ?? 0) / portfolio.totalInvested * 100).toFixed(2)}%
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">Total Frais Payés</h3>
              <p className="text-2xl font-bold text-orange-600">
                {portfolio.totalFees.toFixed(2)} {currencyFormatted(currency)}
              </p>
            </div>
          </div>
        )}

        {portfolio && portfolio.allInvestments.length === 0 ? (
          <div className="text-sm text-muted-foreground">Aucun investissement pour le moment. Ajoutez votre premier investissement.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInvestments?.map((investment: Investment) => (
              <div key={investment.id} className="bg-card p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-t border-border/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{investment.name}</h3>
                    <p className="text-sm text-muted-foreground">{investment.symbol}</p>
                  </div>
                  <p className="font-bold">
                    {((investment.currentPrice ?? 0) * investment.quantity).toFixed(2)} {currencyFormatted(currency)}{' '}
                    <span className={`${investment.profitLoss && investment.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ({investment.profitLoss && investment.profitLoss >= 0 ? '+' : ''} {(investment.profitLoss ?? 0).toFixed(2)} {currencyFormatted(currency)})
                    </span>
                  </p>
                </div>
                <div className="mt-4">
                  <p>Quantité: {investment.quantity}</p>
                  <p>Prix unitaire actuel: {investment.currentPrice?.toFixed(2)} {currencyFormatted(currency)}</p>
                  {investment.purchasePrice > 0 && (
                    <>
                      <p>Prix unitaire à l'achat: {(investment.convertedPurchasePrice ?? investment.purchasePrice).toFixed(2)} {currencyFormatted(currency)}</p>
                      <div>
                        <span>Investissement de départ: {((investment.convertedPurchasePrice ?? investment.purchasePrice) * investment.quantity + (investment.totalFeesInDisplayCurrency ?? 0)).toFixed(2)} {currencyFormatted(currency)}</span>
                        {investment.totalFeesInDisplayCurrency && investment.totalFeesInDisplayCurrency > 0 &&
                          <span className="text-orange-500 font-bold"> (dont {investment.totalFeesInDisplayCurrency.toFixed(2)} {currencyFormatted(currency)} de frais)</span>
                        }
                      </div>
                      <p>Pourcentage de gain: <span className={`${investment.profitLoss && investment.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {((investment.profitLoss ?? 0) / (
                          (investment.convertedPurchasePrice ?? investment.purchasePrice) * investment.quantity +
                          (investment.totalFeesInDisplayCurrency ?? 0)
                        ) * 100).toFixed(2)}%
                      </span></p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 