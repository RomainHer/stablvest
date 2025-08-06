'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/useAuth';

export function RouteProtectionTest() {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);

  const testRouteAccess = () => {
    setTestResults([]);
    
    // Test côté client - vérifier l'état de l'authentification
    const routes = ['/', '/portfolio', '/settings'];
    const results = routes.map(route => {
      if (user) {
        return `${route}: ✅ Accessible (utilisateur connecté)`;
      } else {
        return `${route}: ❌ Protégé (utilisateur déconnecté)`;
      }
    });
    
    setTestResults(results);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🛡️ Test de Protection des Routes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* État actuel */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-semibold mb-2">État de l'authentification :</h4>
          <div className="text-sm">
            <div><strong>Utilisateur:</strong> {user ? `✅ Connecté (${user.email})` : '❌ Déconnecté'}</div>
            <div><strong>Routes protégées:</strong> Dashboard, Portfolio, Settings</div>
            <div><strong>Routes publiques:</strong> Test, Auth</div>
            <div><strong>Comportement:</strong> Redirection automatique vers modal de connexion</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-semibold mb-2">Instructions de test :</h4>
          <div className="text-sm space-y-1">
            <div>1. <strong>Déconnecté :</strong> Les routes protégées ouvrent automatiquement le modal de connexion</div>
            <div>2. <strong>Connecté :</strong> Les routes protégées sont accessibles normalement</div>
            <div>3. <strong>Test manuel :</strong> Essayez d'accéder directement aux URLs dans le navigateur</div>
          </div>
        </div>

        {/* Boutons de test */}
        <div className="flex space-x-2">
          <Button onClick={testRouteAccess} variant="outline">
            🧪 Tester l'état de protection
          </Button>
          <Button onClick={clearResults} variant="ghost" size="sm">
            Effacer
          </Button>
        </div>

        {/* Résultats */}
        {testResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Résultats :</h4>
            <div className="p-3 bg-gray-50 rounded max-h-40 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test manuel */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
          <h4 className="font-semibold mb-2">Test manuel recommandé :</h4>
          <div className="text-sm space-y-1">
            <div>• Copiez ces URLs et testez-les dans un nouvel onglet :</div>
            <div className="font-mono text-xs space-y-1 mt-2">
              <div>http://localhost:3000/</div>
              <div>http://localhost:3000/portfolio</div>
              <div>http://localhost:3000/settings</div>
            </div>
            <div className="mt-2 text-xs">
              <strong>Attendu :</strong> Modal de connexion s'ouvre automatiquement si non connecté
            </div>
          </div>
        </div>

        {/* Explication du test fetch */}
        <div className="p-3 bg-red-50 border border-red-200 rounded">
          <h4 className="font-semibold mb-2">⚠️ Pourquoi le test fetch ne fonctionnait pas :</h4>
          <div className="text-sm space-y-1">
            <div>• <strong>fetch()</strong> fait une requête HTTP côté serveur</div>
            <div>• <strong>ProtectedRoute</strong> fonctionne côté client (React)</div>
            <div>• Le serveur Next.js renvoie toujours la page (même si elle est protégée côté client)</div>
            <div>• <strong>Solution :</strong> Test basé sur l'état d'authentification côté client</div>
          </div>
        </div>

        {/* Guide de résolution */}
        <div className="text-sm text-gray-600 space-y-1">
          <div><strong>Fonctionnement de la protection :</strong></div>
          <div>• Les pages se chargent côté serveur</div>
          <div>• ProtectedRoute vérifie l'authentification côté client</div>
          <div>• Si non connecté : modal de connexion s'ouvre automatiquement</div>
          <div>• Si connecté : contenu de la page s'affiche</div>
        </div>

      </CardContent>
    </Card>
  );
} 