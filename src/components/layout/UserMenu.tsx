'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Settings, User, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';

export function UserMenu() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:bg-accent"
      >
        <User className="h-4 w-4" />
        <span className="max-w-[150px] truncate hidden sm:inline">
          {user.email}
        </span>
        <ChevronDown className={cn(
          "h-3 w-3 transition-transform",
          isOpen ? "rotate-180" : ""
        )} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-background border rounded-md shadow-lg z-50">
          <div className="py-2">
            {/* User Info */}
            <div className="px-4 py-2 border-b">
              <div className="text-sm font-medium">{user.email}</div>
              <div className="text-xs text-muted-foreground">
                {user.email_confirmed_at ? 'Compte vérifié' : 'Compte non vérifié'}
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                href="/settings"
                className={cn(
                  'flex items-center px-4 py-2 text-sm transition-colors hover:bg-accent',
                  pathname === '/settings' ? 'text-primary bg-primary/10' : 'text-foreground'
                )}
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4 mr-3" />
                Paramètres
              </Link>
            </div>

            {/* Sign Out */}
            <div className="border-t pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                disabled={loading}
                className="w-full justify-start px-4 py-2 h-auto text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 