'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/useAuth';

export function LandingPageTest() {
  const { user } = useAuth();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🏠 Test de la Landing Page</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* État actuel */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-semibold mb-2">Comportement de la route / :</h4>
          <div className="text-sm space-y-2">
            <div><strong>Utilisateur:</strong> {user ? `✅ Connecté (${user.email})` : '❌ Déconnecté'}</div>
            <div><strong>Page affichée:</strong> {user ? 'Dashboard' : 'Landing Page'}</div>
            <div><strong>URL:</strong> http://localhost:3000/</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-semibold mb-2">Comment tester :</h4>
          <div className="text-sm space-y-1">
            <div>1. <strong>Déconnecté :</strong> Allez sur / → Landing page s'affiche</div>
            <div>2. <strong>Connecté :</strong> Allez sur / → Dashboard s'affiche</div>
            <div>3. <strong>Test manuel :</strong> Connectez/déconnectez-vous et rafraîchissez la page</div>
          </div>
        </div>

        {/* Test rapide */}
        <div className="p-3 bg-green-50 border border-green-200 rounded">
          <h4 className="font-semibold mb-2">Test rapide :</h4>
          <div className="text-sm space-y-2">
            <div>• Cliquez sur "Déconnexion" puis allez sur la page d'accueil</div>
            <div>• Vous devriez voir la landing page avec "Commencer gratuitement"</div>
            <div>• Connectez-vous puis retournez sur la page d'accueil</div>
            <div>• Vous devriez voir le dashboard avec vos investissements</div>
          </div>
        </div>

        {/* Avantages de cette approche */}
        <div className="p-3 bg-purple-50 border border-purple-200 rounded">
          <h4 className="font-semibold mb-2">✅ Avantages de cette approche :</h4>
          <div className="text-sm space-y-1">
            <div>• <strong>UX optimale :</strong> Les visiteurs voient une landing page attractive</div>
            <div>• <strong>Conversion :</strong> Plus de chances d'inscription avec une présentation claire</div>
            <div>• <strong>SEO :</strong> Page d'accueil optimisée pour les moteurs de recherche</div>
            <div>• <strong>Performance :</strong> Les utilisateurs connectés accèdent directement au dashboard</div>
            <div>• <strong>Standard SaaS :</strong> Comportement attendu par les utilisateurs</div>
          </div>
        </div>

        {/* Exemples d'autres SaaS */}
        <div className="text-sm text-gray-600 space-y-1">
          <div><strong>Autres SaaS qui font pareil :</strong></div>
          <div>• Stripe : / → landing → /dashboard (connecté)</div>
          <div>• Notion : / → landing → /workspace (connecté)</div>
          <div>• Linear : / → landing → /dashboard (connecté)</div>
          <div>• Figma : / → landing → /files (connecté)</div>
        </div>

      </CardContent>
    </Card>
  );
} 