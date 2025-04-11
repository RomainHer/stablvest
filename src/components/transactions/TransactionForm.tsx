'use client';

import { useState, useEffect } from 'react';
import { Investment } from '@/lib/types/investment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CryptoService } from '@/lib/services/crypto.service';

interface TransactionFormProps {
  onSubmit: (investment: Omit<Investment, 'id' | 'currentPrice' | 'profitLoss'>) => void;
  onClose: () => void;
}

export function TransactionForm({ onSubmit, onClose }: TransactionFormProps) {
  const [cryptoList, setCryptoList] = useState<{ id: string; symbol: string; name: string }[]>([]);
  const [formData, setFormData] = useState<Omit<Investment, 'id' | 'currentPrice' | 'profitLoss'>>({
    type: 'crypto',
    symbol: '',
    name: '',
    idToken: '',
    quantity: 0,
    purchasePrice: 0,
    purchaseDate: new Date(),
  });

  useEffect(() => {
    const fetchCryptoList = async () => {
      const list = await CryptoService.getCryptoList();
      setCryptoList(list);
    };
    fetchCryptoList();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="type">Type d&apos;investissement</Label>
        <Select
          value={formData.type}
          onValueChange={(value: 'crypto' | 'stock') =>
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="crypto">Crypto</SelectItem>
            <SelectItem value="stock">Action</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="symbol">Symbole</Label>
        <Select
          value={formData.symbol}
          onValueChange={(value) => {
            const selectedCrypto = cryptoList.find(c => c.symbol === value);
            setFormData({
              ...formData,
              idToken: selectedCrypto?.id || 'bitcoin',
              symbol: value || 'btc',
              name: selectedCrypto?.name || 'Bitcoin',
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une crypto" />
          </SelectTrigger>
          <SelectContent>
            {cryptoList.map((crypto) => (
              <SelectItem key={crypto.id} value={crypto.symbol || 'btc'}>
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="quantity">Quantité</Label>
        <Input
          id="quantity"
          type="number"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: parseFloat(e.target.value) })
          }
          placeholder="0.00"
        />
      </div>

      <div>
        <Label htmlFor="purchasePrice">Prix d&apos;achat unitaire</Label>
        <Input
          id="purchasePrice"
          type="number"
          value={formData.purchasePrice}
          onChange={(e) =>
            setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) })
          }
          placeholder="0.00"
        />
      </div>

      <div>
        <Label htmlFor="purchaseDate">Date d&apos;achat</Label>
        <Input
          id="purchaseDate"
          type="date"
          value={formData.purchaseDate.toISOString().split('T')[0]}
          onChange={(e) =>
            setFormData({ ...formData, purchaseDate: new Date(e.target.value) })
          }
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Ajouter l&apos;investissement
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Annuler
        </Button>
      </div>
    </form>
  );
} 