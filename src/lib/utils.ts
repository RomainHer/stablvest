import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function currencyFormatted(currency: string): string {
  switch(currency) {
    case "USD":
      return "$"
    case "EUR": 
      return "€"
    case "GBP":
      return "£"
    default:
      return currency
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function calculateProfitLoss(
  quantity: number,
  purchasePrice: number,
  currentPrice: number
): number {
  return (currentPrice - purchasePrice) * quantity;
}

/**
 * Calculate effective purchase price including transaction fees
 */
export function calculateEffectivePurchasePrice(
  purchasePrice: number,
  quantity: number,
  transactionFee?: number | null
): number {
  if (!transactionFee || transactionFee <= 0 || quantity <= 0) {
    return purchasePrice;
  }
  const feePerUnit = transactionFee / quantity;
  return purchasePrice + feePerUnit;
}

/**
 * Calculate profit/loss with fees included
 */
export function calculateProfitLossWithFees(
  quantity: number,
  purchasePrice: number,
  currentPrice: number,
  transactionFee?: number | null
): number {
  const effectivePrice = calculateEffectivePurchasePrice(purchasePrice, quantity, transactionFee);
  return (currentPrice - effectivePrice) * quantity;
}
