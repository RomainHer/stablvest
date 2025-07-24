'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Investment } from '@/lib/types/investment';
import { SupabaseInvestmentRow } from '@/lib/types/supabase';
import { 
  mapSupabaseToInvestment, 
  mapInvestmentToSupabaseInsert,
  mapInvestmentToSupabaseUpdate,
  validateInvestmentData 
} from '@/lib/utils/mapping';

export function MappingTest() {
  const [testResults, setTestResults] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const runMappingTests = () => {
    try {
      setError('');

      // Test 1: Données Supabase mock (snake_case)
      const mockSupabaseData: SupabaseInvestmentRow = {
        id: 123,
        type: 'crypto',
        symbol: 'BTC',
        token_id: 'bitcoin',
        name: 'Bitcoin',
        quantity: 1.5,
        purchase_price: 45000,
        purchase_price_currency: 'EUR',
        purchase_date: '2024-01-15',
        user_id: 'test-user-123'
      };

      // Test 2: Conversion Supabase → Frontend
      const frontendInvestment = mapSupabaseToInvestment(mockSupabaseData);

      // Test 3: Conversion Frontend → Supabase Insert
      const investmentForInsert = {
        type: frontendInvestment.type,
        tokenId: frontendInvestment.tokenId,
        symbol: frontendInvestment.symbol,
        name: frontendInvestment.name,
        quantity: frontendInvestment.quantity,
        purchasePrice: frontendInvestment.purchasePrice,
        purchasePriceCurrency: frontendInvestment.purchasePriceCurrency,
        purchaseDate: frontendInvestment.purchaseDate,
      };
      const supabaseInsertData = mapInvestmentToSupabaseInsert(investmentForInsert, 'test-user-123');

      // Test 4: Conversion Frontend → Supabase Update
      const supabaseUpdateData = mapInvestmentToSupabaseUpdate(
        { ...frontendInvestment, quantity: 2.0 }, 
        'test-user-123'
      );

      // Test 5: Validation
      const validationErrors = validateInvestmentData(frontendInvestment);

      // Test 6: Validation avec données invalides
      const invalidData: Partial<Investment> = {
        type: 'invalid' as any,
        quantity: -1,
        purchasePrice: 0,
      };
      const validationErrorsInvalid = validateInvestmentData(invalidData);

      setTestResults({
        supabaseData: mockSupabaseData,
        frontendData: frontendInvestment,
        insertData: supabaseInsertData,
        updateData: supabaseUpdateData,
        validationValid: validationErrors,
        validationInvalid: validationErrorsInvalid,
      });

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🔄 Test des Mappings de Données</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <Button onClick={runMappingTests} className="w-full">
          🧪 Lancer les tests de mapping
        </Button>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded">
            <strong>Erreur:</strong> {error}
          </div>
        )}

        {testResults && (
          <div className="space-y-4">
            
            {/* Test 1: Données Supabase (snake_case) */}
            <div className="p-3 bg-blue-50 rounded">
              <h4 className="font-semibold mb-2">📥 Données Supabase (snake_case)</h4>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(testResults.supabaseData, null, 2)}
              </pre>
            </div>

            {/* Test 2: Données Frontend (camelCase) */}
            <div className="p-3 bg-green-50 rounded">
              <h4 className="font-semibold mb-2">📤 Données Frontend (camelCase)</h4>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(testResults.frontendData, null, 2)}
              </pre>
            </div>

            {/* Test 3: Données d'insertion */}
            <div className="p-3 bg-yellow-50 rounded">
              <h4 className="font-semibold mb-2">💾 Données pour insertion Supabase</h4>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(testResults.insertData, null, 2)}
              </pre>
            </div>

            {/* Test 4: Données de mise à jour */}
            <div className="p-3 bg-purple-50 rounded">
              <h4 className="font-semibold mb-2">🔄 Données pour mise à jour Supabase</h4>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(testResults.updateData, null, 2)}
              </pre>
            </div>

            {/* Test 5: Validation OK */}
            <div className="p-3 bg-green-100 rounded">
              <h4 className="font-semibold mb-2">✅ Validation (données valides)</h4>
              <p className="text-sm">
                {testResults.validationValid.length === 0 
                  ? '✅ Aucune erreur de validation' 
                  : `❌ ${testResults.validationValid.length} erreurs`
                }
              </p>
              {testResults.validationValid.length > 0 && (
                <ul className="text-xs mt-1">
                  {testResults.validationValid.map((error: string, i: number) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Test 6: Validation Erreurs */}
            <div className="p-3 bg-red-100 rounded">
              <h4 className="font-semibold mb-2">❌ Validation (données invalides)</h4>
              <p className="text-sm">
                ✅ {testResults.validationInvalid.length} erreurs détectées (attendu)
              </p>
              <ul className="text-xs mt-1">
                {testResults.validationInvalid.map((error: string, i: number) => (
                  <li key={i}>• {error}</li>
                ))}
              </ul>
            </div>

          </div>
        )}

        {/* Guide */}
        <div className="text-sm text-gray-600 space-y-1">
          <div><strong>Ce qui est testé:</strong></div>
          <div>• 🔄 Conversion Supabase (snake_case) → Frontend (camelCase)</div>
          <div>• 💾 Conversion Frontend → Supabase Insert</div>
          <div>• 🔄 Conversion Frontend → Supabase Update</div>
          <div>• ✅ Validation des données valides</div>
          <div>• ❌ Détection des données invalides</div>
          <div>• 📅 Gestion des dates (ISO string ↔ Date object)</div>
          <div>• 🔢 Gestion des IDs (number ↔ string)</div>
        </div>

      </CardContent>
    </Card>
  );
} 