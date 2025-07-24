'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [supabaseInfo, setSupabaseInfo] = useState<any>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus('testing');
      setErrorMessage('');

      // Test 1: Vérifier que les variables d'environnement sont présentes
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !anonKey) {
        throw new Error('Variables d\'environnement manquantes');
      }

      // Test 2: Tester la connexion Supabase
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      // Test 3: Tester une requête simple (même si la table n'existe pas encore)
      const { error: testError } = await supabase
        .from('investment')
        .select('count', { count: 'exact', head: true });

      setSupabaseInfo({
        url: url.substring(0, 30) + '...', // Masquer l'URL complète
        hasSession: !!data.session,
        tableAccessible: !testError,
        testError: testError?.message || null
      });

      setConnectionStatus('success');
    } catch (error) {
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Erreur inconnue');
    }
  };

  const testAuthFlow = async () => {
    try {
      // Test de la capacité de gestion d'auth sans vraiment se connecter
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        alert(`Erreur auth test: ${error.message}`);
      } else {
        // Test des méthodes auth sans connexion réelle
        const authMethods = await supabase.auth.getSession();
        alert(`Test auth réussi ! Session actuelle: ${data.session ? 'Connecté' : 'Déconnecté'}\nMéthodes auth disponibles: ✅`);
      }
    } catch (error) {
      alert(`Erreur pendant le test auth: ${error}`);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🧪 Test Configuration Supabase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Status de connexion */}
        <div className="flex items-center space-x-2">
          <span>Status de connexion:</span>
          {connectionStatus === 'testing' && (
            <span className="text-yellow-500">🔄 Test en cours...</span>
          )}
          {connectionStatus === 'success' && (
            <span className="text-green-500">✅ Connexion réussie</span>
          )}
          {connectionStatus === 'error' && (
            <span className="text-red-500">❌ Erreur de connexion</span>
          )}
        </div>

        {/* Erreur */}
        {errorMessage && (
          <div className="p-3 bg-red-100 border border-red-300 rounded">
            <strong>Erreur:</strong> {errorMessage}
          </div>
        )}

        {/* Informations Supabase */}
        {supabaseInfo && (
          <div className="p-3 bg-gray-100 rounded space-y-2">
            <div><strong>URL Supabase:</strong> {supabaseInfo.url}</div>
            <div><strong>Session active:</strong> {supabaseInfo.hasSession ? 'Oui' : 'Non'}</div>
            <div><strong>Table accessible:</strong> {supabaseInfo.tableAccessible ? 'Oui' : 'Non'}</div>
            {supabaseInfo.testError && (
              <div className="text-sm text-gray-600">
                <strong>Détail erreur table:</strong> {supabaseInfo.testError}
              </div>
            )}
          </div>
        )}

        {/* Actions de test */}
        <div className="flex space-x-2">
          <Button onClick={testConnection} variant="outline">
            🔄 Re-tester la connexion
          </Button>
          <Button onClick={testAuthFlow} variant="outline">
            🔐 Tester les méthodes d'auth
          </Button>
        </div>

        {/* Guide de résolution */}
        <div className="text-sm text-gray-600 space-y-1">
          <div><strong>Guide de résolution:</strong></div>
          <div>• Vérifiez que le fichier .env.local existe à la racine</div>
          <div>• Vérifiez que les variables NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont définies</div>
          <div>• Redémarrez le serveur de développement après modification du .env.local</div>
          <div>• La table 'investment' peut ne pas encore exister (normal à cette étape)</div>
        </div>

      </CardContent>
    </Card>
  );
} 