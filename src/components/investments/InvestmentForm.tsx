'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Investment, InvestmentType } from '@/lib/types/investment';
import { SupabaseInvestmentService } from '@/lib/services/supabase/investment.service';
import { useSettingsStore } from '@/lib/stores/settingsStore';

const investmentSchema = z.object({
  type: z.enum(['crypto', 'stock']),
  symbol: z.string().min(1, 'Symbol is required'),
  tokenId: z.string().min(1, 'Token ID is required').optional(),
  name: z.string().min(1, 'Name is required'),
  quantity: z.number().min(0.00000001, 'Quantity must be greater than 0'),
  purchasePrice: z.number().min(0.00000001, 'Price must be greater than 0'),
  purchaseDate: z.string().min(1, 'Date is required'),
  transactionFee: z.number().min(0, 'Fee cannot be negative').optional().nullable(),
  transactionFeeCurrency: z.string().optional().nullable(),
}).refine((data) => {
  if (data.type === 'crypto') {
    return !!data.tokenId;
  }
  return true;
}, {
  message: "Token ID is required for cryptocurrency investments",
  path: ["tokenId"]
}).refine((data) => {
  if (data.transactionFee && data.transactionFee > 0) {
    return !!data.transactionFeeCurrency && data.transactionFeeCurrency.trim() !== '';
  }
  return true;
}, {
  message: "Currency is required when transaction fee is specified",
  path: ["transactionFeeCurrency"]
});

type InvestmentFormData = z.infer<typeof investmentSchema> & {
  tokenId?: string;
  transactionFee?: number | null;
  transactionFeeCurrency?: string | null;
};

interface InvestmentFormProps {
  onInvestmentAdded?: (investment: Investment) => void;
}

export function InvestmentForm({ onInvestmentAdded }: InvestmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currency } = useSettingsStore();
  
  const form = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      type: 'crypto',
      symbol: '',
      name: '',
      tokenId: '',
      quantity: 0,
      purchasePrice: 0,
      purchaseDate: new Date().toISOString().split('T')[0],
      transactionFee: undefined,
      transactionFeeCurrency: undefined,
    },
  });

  const onSubmit = async (data: InvestmentFormData) => {
    setIsSubmitting(true);
    try {
      const created = await SupabaseInvestmentService.add({
        type: data.type,
        symbol: data.symbol,
        name: data.name,
        tokenId: data.tokenId || '',
        quantity: data.quantity,
        purchasePrice: data.purchasePrice,
        purchasePriceCurrency: currency,
        purchaseDate: new Date(data.purchaseDate),
        transactionFee: data.transactionFee || null,
        transactionFeeCurrency: data.transactionFeeCurrency || null,
      });
      onInvestmentAdded?.(created);
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Investment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Investment Type</Label>
            <Select
              onValueChange={(value) => form.setValue('type', value as InvestmentType)}
              defaultValue={form.getValues('type')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crypto">Cryptocurrency</SelectItem>
                <SelectItem value="stock">Stock/ETF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              placeholder="BTC, AAPL, etc."
              {...form.register('symbol')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Bitcoin, Apple Inc, etc."
              {...form.register('name')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              step="any"
              {...form.register('quantity', { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchasePrice">Purchase Price</Label>
            <Input
              id="purchasePrice"
              type="number"
              step="any"
              {...form.register('purchasePrice', { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchaseDate">Purchase Date</Label>
            <Input
              id="purchaseDate"
              type="date"
              {...form.register('purchaseDate')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionFee">Transaction Fee (Optional)</Label>
            <Input
              id="transactionFee"
              type="number"
              step="any"
              placeholder="0.00"
              {...form.register('transactionFee', { valueAsNumber: true })}
            />
            <p className="text-xs text-muted-foreground">
              Fee paid when purchasing this investment
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionFeeCurrency">Fee Currency (Optional)</Label>
            <Input
              id="transactionFeeCurrency"
              placeholder="EUR, USD, etc."
              {...form.register('transactionFeeCurrency')}
            />
            <p className="text-xs text-muted-foreground">
              Defaults to purchase currency if not specified
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Ajout...' : 'Ajouter'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 