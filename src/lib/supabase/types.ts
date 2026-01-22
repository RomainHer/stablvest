export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      investments: {
        Row: {
          id: number
          type: string
          symbol: string
          token_id: string
          name: string
          quantity: number
          purchase_price: number
          purchase_price_currency: string
          purchase_date: string
          user_id: string
          transaction_fee: number | null
          transaction_fee_currency: string | null
        }
        Insert: {
          id?: number
          type: string
          symbol: string
          token_id: string
          name: string
          quantity: number
          purchase_price: number
          purchase_price_currency: string
          purchase_date: string
          user_id: string
          transaction_fee?: number | null
          transaction_fee_currency?: string | null
        }
        Update: {
          id?: number
          type?: string
          symbol?: string
          token_id?: string
          name?: string
          quantity?: number
          purchase_price?: number
          purchase_price_currency?: string
          purchase_date?: string
          user_id?: string
          transaction_fee?: number | null
          transaction_fee_currency?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 