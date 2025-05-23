'use client';

import { useState, useEffect } from 'react';
import { Investment, Portfolio } from '@/lib/types/investment';
import { PortfolioService } from '@/lib/services/portfolio.service';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function PortfolioPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const savedInvestments = JSON.parse(localStorage.getItem('investments') || '[]');
    setInvestments(savedInvestments);
  }, []);

  useEffect(() => {
    console.log(investments);
    const calculatePortfolio = async () => {
      const portfolio = await PortfolioService.calculatePortfolio(investments);
      setPortfolio(portfolio);
    };
    calculatePortfolio();
  }, [investments]);

  const handleAddTransaction = async (investment: Omit<Investment, 'id' | 'currentPrice' | 'profitLoss'>) => {
    const newInvestment: Investment = {
      ...investment,
      id: crypto.randomUUID(),
      currentPrice: 0,
      profitLoss: 0,
    };
    const updatedInvestments = [...investments, newInvestment];
    localStorage.setItem('investments', JSON.stringify(updatedInvestments));
    setInvestments(updatedInvestments);
    setIsFormOpen(false);
  };

  const filteredInvestments = portfolio?.allInvestments.filter(
    (investment: Investment) =>
      investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
              <Button>Ajouter un investissement</Button>
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

      {portfolio && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Valeur totale</h3>
            <p className="text-2xl font-bold">{portfolio.totalValue.toFixed(2)} $</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Investi total</h3>
            <p className="text-2xl font-bold">{portfolio.totalInvested.toFixed(2)} $</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Profit/Perte</h3>
            <p className={`text-2xl font-bold ${portfolio.totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {portfolio.totalProfitLoss.toFixed(2)} $
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInvestments?.map((investment: Investment) => (
          <div key={investment.id} className="bg-card p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{investment.name}</h3>
                <p className="text-sm text-muted-foreground">{investment.symbol}</p>
              </div>
              <p className={`font-bold ${investment.profitLoss && investment.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {investment.profitLoss?.toFixed(2)} $
              </p>
            </div>
            <div className="mt-4">
              <p>Quantité: {investment.quantity}</p>
              <p>Prix d&apos;achat: {investment.purchasePrice.toFixed(2)} $</p>
              <p>Prix actuel: {investment.currentPrice?.toFixed(2)} $</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 