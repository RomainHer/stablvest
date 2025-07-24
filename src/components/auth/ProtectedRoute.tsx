'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { AuthModal } from './AuthModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading, initialized } = useAuth();

  // Affichage de chargement pendant l'initialisation
  if (!initialized || loading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Vérification de l'authentification...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Utilisateur connecté : afficher le contenu protégé
  if (user) {
    return <>{children}</>;
  }

  // Utilisateur non connecté : afficher le fallback ou le message par défaut
  if (fallback) {
    return <>{fallback}</>;
  }

  return <UnauthenticatedFallback />;
}

function UnauthenticatedFallback() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">🔒 Accès restreint</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Vous devez être connecté pour accéder à cette page.
          </p>
          <p className="text-sm text-muted-foreground">
            Utilisez le bouton "Connexion" dans la barre de navigation pour vous authentifier.
          </p>
          <div className="pt-4">
            <p className="text-xs text-muted-foreground">
              Nouveau ? Créez un compte via l'onglet "Inscription"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 