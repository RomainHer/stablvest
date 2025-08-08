'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { LandingPage } from '@/components/landing/LandingPage';
import { Dashboard } from '@/components/dashboard/Dashboard';
 

export default function HomePage() {
  const { user, loading, initialized } = useAuth();

  // Affichage de chargement pendant l'initialisation
  if (!initialized || loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  // Utilisateur connecté : afficher le dashboard
  if (user) {
    return <Dashboard />;
  }

  // Utilisateur non connecté : afficher la landing page
  return <LandingPage />;
} 