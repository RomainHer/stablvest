'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Settings, User, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';
import { AuthModal } from '@/components/auth/AuthModal';

export function Navbar() {
  const pathname = usePathname();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  const publicLinks = [
    { href: '/test', label: 'Test' },
  ];

  const authenticatedLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/test', label: 'Test' },
  ];

  const links = user ? authenticatedLinks : publicLinks;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <nav className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold">
                Stablvest
              </Link>
              <div className="hidden md:flex space-x-6">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-primary',
                      pathname === link.href
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {/* Utilisateur connecté */}
                  <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  
                  <Link
                    href="/settings"
                    className={cn(
                      'p-2 rounded-md transition-colors hover:bg-accent',
                      pathname === '/settings' ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    disabled={loading}
                    className="flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden md:inline">Déconnexion</span>
                  </Button>
                </>
              ) : (
                <>
                  {/* Utilisateur non connecté */}
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center space-x-2"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Connexion</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
} 