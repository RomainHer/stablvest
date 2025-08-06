'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';

export function Footer() {
  const { user } = useAuth();

  // Footer minimal pour les utilisateurs connectés
  if (user) {
    return (
      <footer className="border-t py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2024 Stablvest. Tous droits réservés.
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link href="/test" className="hover:text-foreground transition-colors">
                Tests
              </Link>
              <Link href="/settings" className="hover:text-foreground transition-colors">
                Paramètres
              </Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Footer complet pour la landing page
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Stablvest</h3>
            <p className="text-sm text-muted-foreground">
              La plateforme moderne pour gérer vos investissements crypto et actions.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold">Produit</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link href="/test" className="block hover:text-foreground transition-colors">
                Fonctionnalités
              </Link>
              <Link href="/test" className="block hover:text-foreground transition-colors">
                Tarifs
              </Link>
              <Link href="/test" className="block hover:text-foreground transition-colors">
                Intégrations
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link href="/test" className="block hover:text-foreground transition-colors">
                Centre d'aide
              </Link>
              <Link href="/test" className="block hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link href="/test" className="block hover:text-foreground transition-colors">
                Documentation
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold">Légal</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link href="/test" className="block hover:text-foreground transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="/test" className="block hover:text-foreground transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/test" className="block hover:text-foreground transition-colors">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2024 Stablvest. Tous droits réservés.
            </div>
            <div className="text-sm text-muted-foreground">
              Fait avec ❤️ pour les investisseurs
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 