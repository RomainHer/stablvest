'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Settings, User, LogOut, LogIn, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';
import { AuthModal } from '@/components/auth/AuthModal';
import { UserMenu } from './UserMenu';

export function Navbar() {
  const pathname = usePathname();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    setIsMobileMenuOpen(false);
  };

  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold">
                Stablvest
              </Link>
              
              {/* Desktop Navigation */}
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

                        {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <UserMenu />
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAuthClick}
                  className="flex items-center space-x-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Connexion</span>
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t py-4">
              <div className="space-y-4">
                {/* Mobile Links */}
                <div className="space-y-2">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'block px-4 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md',
                        pathname === link.href
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:bg-accent'
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile User Info */}
                {user ? (
                  <div className="space-y-2 border-t pt-4">
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>
                    
                    <Link
                      href="/settings"
                      className={cn(
                        'block px-4 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md',
                        pathname === '/settings' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-accent'
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Paramètres
                    </Link>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      disabled={loading}
                      className="w-full justify-start px-4"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <div className="border-t pt-4">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleAuthClick}
                      className="w-full"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Connexion
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
} 