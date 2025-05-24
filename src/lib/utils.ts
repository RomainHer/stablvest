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
