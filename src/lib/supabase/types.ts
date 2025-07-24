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