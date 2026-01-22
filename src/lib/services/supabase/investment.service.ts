import { supabase } from '@/lib/supabase/client';
import { Investment } from '@/lib/types/investment';
import { 
  mapSupabaseToInvestment, 
  mapInvestmentToSupabaseInsert, 
  mapInvestmentToSupabaseUpdate,
  validateInvestmentData 
} from '@/lib/utils/mapping';

export class SupabaseInvestmentService {
  /**
   * Récupère tous les investissements de l'utilisateur connecté
   */
  static async getAll(): Promise<Investment[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
        .order('purchase_date', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des investissements:', error);
        throw new Error(`Erreur lors de la récupération: ${error.message}`);
      }

      // Convertir les données Supabase vers le format frontend
      return data.map(mapSupabaseToInvestment);
    } catch (error) {
      console.error('Erreur SupabaseInvestmentService.getAll:', error);
      throw error;
    }
  }

  /**
   * Récupère un investissement par son ID
   */
  static async getById(id: string): Promise<Investment | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Aucun résultat trouvé
          return null;
        }
        console.error('Erreur lors de la récupération de l\'investissement:', error);
        throw new Error(`Erreur lors de la récupération: ${error.message}`);
      }

      return mapSupabaseToInvestment(data);
    } catch (error) {
      console.error('Erreur SupabaseInvestmentService.getById:', error);
      throw error;
    }
  }

  /**
   * Ajoute un nouvel investissement
   */
  static async add(investment: Omit<Investment, 'id'>): Promise<Investment> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Validation des données
      const validationErrors = validateInvestmentData(investment);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Convertir vers le format Supabase
      const supabaseData = mapInvestmentToSupabaseInsert(investment, user.id);

      const { data, error } = await supabase
        .from('investments')
        .insert(supabaseData)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de l\'ajout de l\'investissement:', error);
        throw new Error(`Erreur lors de l'ajout: ${error.message}`);
      }

      return mapSupabaseToInvestment(data);
    } catch (error) {
      console.error('Erreur SupabaseInvestmentService.add:', error);
      throw error;
    }
  }

  /**
   * Met à jour un investissement existant
   */
  static async update(id: string, updates: Partial<Investment>): Promise<Investment> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Validation des données
      const validationErrors = validateInvestmentData({ ...updates, id: 'temp' } as Investment);
      if (validationErrors.length > 0) {
        throw new Error(`Données d'investissement invalides: ${validationErrors.join(', ')}`);
      }

      // Convertir vers le format Supabase
      const supabaseUpdates = mapInvestmentToSupabaseUpdate({ ...updates, id }, user.id);

      const { data, error } = await supabase
        .from('investments')
        .update(supabaseUpdates)
        .eq('id', id)
        .eq('user_id', user.id) // Sécurité : s'assurer que l'utilisateur possède l'investissement
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour de l\'investissement:', error);
        throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
      }

      return mapSupabaseToInvestment(data);
    } catch (error) {
      console.error('Erreur SupabaseInvestmentService.update:', error);
      throw error;
    }
  }

  /**
   * Supprime un investissement
   */
  static async delete(id: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Sécurité : s'assurer que l'utilisateur possède l'investissement

      if (error) {
        console.error('Erreur lors de la suppression de l\'investissement:', error);
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }
    } catch (error) {
      console.error('Erreur SupabaseInvestmentService.delete:', error);
      throw error;
    }
  }

  /**
   * Supprime tous les investissements de l'utilisateur
   */
  static async clear(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Erreur lors de la suppression de tous les investissements:', error);
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }
    } catch (error) {
      console.error('Erreur SupabaseInvestmentService.clear:', error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques du portfolio
   */
  static async getPortfolioStats(): Promise<{
    totalInvestments: number;
    totalValue: number;
    totalInvested: number;
    totalProfitLoss: number;
    totalFees: number;
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const { data, error } = await supabase
        .from('investments')
        .select('quantity, purchase_price, purchase_price_currency, transaction_fee, transaction_fee_currency')
        .eq('user_id', user.id);

      if (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        throw new Error(`Erreur lors de la récupération: ${error.message}`);
      }

      // Calculer les statistiques de base
      const totalInvestments = data.length;
      const totalInvested = data.reduce((sum, inv) => {
        const investmentAmount = inv.quantity * inv.purchase_price;
        const fee = inv.transaction_fee ?? 0;
        return sum + investmentAmount + fee;
      }, 0);

      // Calculer les frais totaux
      const totalFees = data.reduce((sum, inv) => sum + (inv.transaction_fee ?? 0), 0);

      // Note: Pour les calculs de valeur actuelle et profit/loss,
      // il faudrait intégrer les services de prix en temps réel
      // Pour l'instant, on retourne les données de base
      return {
        totalInvestments,
        totalValue: totalInvested, // À remplacer par le calcul avec les prix actuels
        totalInvested,
        totalProfitLoss: 0, // À calculer avec les prix actuels
        totalFees,
      };
    } catch (error) {
      console.error('Erreur SupabaseInvestmentService.getPortfolioStats:', error);
      throw error;
    }
  }
} 