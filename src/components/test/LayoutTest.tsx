'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/useAuth';

export function LayoutTest() {
  const { user } = useAuth();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🎨 Test des Améliorations du Layout</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* État actuel */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-semibold mb-2">Composants du layout :</h4>
          <div className="text-sm space-y-2">
            <div><strong>Utilisateur:</strong> {user ? `✅ Connecté (${user.email})` : '❌ Déconnecté'}</div>
            <div><strong>Navbar:</strong> ✅ Responsive avec menu mobile</div>
            <div><strong>UserMenu:</strong> {user ? '✅ Menu déroulant' : '❌ Non affiché'}</div>
            <div><strong>Footer:</strong> {user ? '✅ Minimal' : '✅ Complet (landing)'}</div>
          </div>
        </div>

        {/* Améliorations Navbar */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-semibold mb-2">✅ Améliorations Navbar :</h4>
          <div className="text-sm space-y-1">
            <div>• <strong>Sticky :</strong> Navbar reste en haut lors du scroll</div>
            <div>• <strong>Backdrop blur :</strong> Effet de flou moderne</div>
            <div>• <strong>Menu mobile :</strong> Navigation responsive complète</div>
            <div>• <strong>UserMenu :</strong> Menu déroulant avec infos utilisateur</div>
            <div>• <strong>Truncate email :</strong> Emails longs coupés proprement</div>
          </div>
        </div>

        {/* Améliorations Footer */}
        <div className="p-3 bg-green-50 border border-green-200 rounded">
          <h4 className="font-semibold mb-2">✅ Améliorations Footer :</h4>
          <div className="text-sm space-y-1">
            <div>• <strong>Adaptatif :</strong> Différent selon l'état de connexion</div>
            <div>• <strong>Connecté :</strong> Footer minimal avec liens essentiels</div>
            <div>• <strong>Déconnecté :</strong> Footer complet pour la landing page</div>
            <div>• <strong>Responsive :</strong> Grille adaptative sur mobile</div>
            <div>• <strong>Sticky bottom :</strong> Footer toujours en bas</div>
          </div>
        </div>

        {/* Tests à effectuer */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
          <h4 className="font-semibold mb-2">🧪 Tests à effectuer :</h4>
          <div className="text-sm space-y-2">
            <div><strong>Desktop :</strong></div>
            <div>• Vérifiez que la navbar est sticky</div>
            <div>• Testez le menu utilisateur déroulant</div>
            <div>• Vérifiez que le footer est en bas</div>
            
            <div><strong>Mobile :</strong></div>
            <div>• Ouvrez le menu hamburger</div>
            <div>• Testez la navigation mobile</div>
            <div>• Vérifiez que le footer s'adapte</div>
            
            <div><strong>Responsive :</strong></div>
            <div>• Redimensionnez la fenêtre</div>
            <div>• Vérifiez les breakpoints</div>
          </div>
        </div>

        {/* Fonctionnalités UserMenu */}
        <div className="p-3 bg-purple-50 border border-purple-200 rounded">
          <h4 className="font-semibold mb-2">👤 Fonctionnalités UserMenu :</h4>
          <div className="text-sm space-y-1">
            <div>• <strong>Click outside :</strong> Se ferme en cliquant à l'extérieur</div>
            <div>• <strong>User info :</strong> Email + statut de vérification</div>
            <div>• <strong>Navigation :</strong> Lien vers les paramètres</div>
            <div>• <strong>Déconnexion :</strong> Bouton avec confirmation visuelle</div>
            <div>• <strong>Animations :</strong> Chevron qui tourne</div>
          </div>
        </div>

        {/* Avantages UX */}
        <div className="text-sm text-gray-600 space-y-1">
          <div><strong>Avantages UX de ces améliorations :</strong></div>
          <div>• Navigation plus intuitive et moderne</div>
          <div>• Meilleure expérience mobile</div>
          <div>• Interface adaptée au contexte (connecté/déconnecté)</div>
          <div>• Accessibilité améliorée</div>
          <div>• Design cohérent avec les standards SaaS</div>
        </div>

      </CardContent>
    </Card>
  );
} 