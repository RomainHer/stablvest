import { Database } from '@/lib/supabase/types';

// Types extraits de la base de données Supabase
export type SupabaseInvestment = Database['public']['Tables']['investments']['Row'];

// Type pour les données reçues de Supabase (snake_case)
export interface SupabaseInvestmentRow {
  id: number;
  type: string;
  symbol: string;
  token_id: string;
  name: string;
  quantity: number;
  purchase_price: number;
  purchase_price_currency: string;
  purchase_date: string; // ISO date string from Supabase
  user_id: string;
}

// Type pour les insertions vers Supabase (snake_case, sans id)
export interface SupabaseInvestmentInsertData {
  type: string;
  symbol: string;
  token_id: string;
  name: string;
  quantity: number;
  purchase_price: number;
  purchase_price_currency: string;
  purchase_date: string; // ISO date string
  user_id: string;
}

// Type pour les mises à jour vers Supabase (snake_case, tout optionnel sauf id)
export interface SupabaseInvestmentUpdateData {
  id: number;
  type?: string;
  symbol?: string;
  token_id?: string;
  name?: string;
  quantity?: number;
  purchase_price?: number;
  purchase_price_currency?: string;
  purchase_date?: string;
  user_id?: string;
} 