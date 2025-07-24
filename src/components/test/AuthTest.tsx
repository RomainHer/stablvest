'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/hooks/useAuth';

export function AuthTest() {
  const { user, session, loading, initialized, signIn, signUp, signOut } = useAuth();
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('password123');
  const [testResult, setTestResult] = useState<string>('');

  const runAuthTest = async (action: 'signin' | 'signup' | 'signout') => {
    setTestResult('');
    
    try {
      switch (action) {
        case 'signin':
          const { error: signinError } = await signIn(testEmail, testPassword);
          setTestResult(signinError ? `❌ Erreur: ${signinError.message}` : '✅ Connexion réussie');
          break;
          
        case 'signup':
          const { error: signupError } = await signUp(testEmail, testPassword);
          setTestResult(signupError ? `❌ Erreur: ${signupError.message}` : '✅ Inscription réussie');
          break;
          
        case 'signout':
          await signOut();
          setTestResult('✅ Déconnexion réussie');
          break;
      }
    } catch (error) {
      setTestResult(`❌ Erreur inattendue: ${error}`);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🔐 Test du Système d'Authentification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* État actuel */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <h4 className="font-semibold">État actuel :</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Initialisé:</strong> {initialized ? '✅ Oui' : '❌ Non'}
            </div>
            <div>
              <strong>Chargement:</strong> {loading ? '🔄 Oui' : '✅ Non'}
            </div>
            <div>
              <strong>Utilisateur:</strong> {user ? '✅ Connecté' : '❌ Déconnecté'}
            </div>
            <div>
              <strong>Session:</strong> {session ? '✅ Active' : '❌ Inactive'}
            </div>
          </div>
          
          {user && (
            <div className="pt-2 border-t">
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>ID:</strong> {user.id}</div>
              <div><strong>Confirmé:</strong> {user.email_confirmed_at ? '✅ Oui' : '❌ Non'}</div>
            </div>
          )}
        </div>

        {/* Formulaire de test */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="test-email">Email de test</Label>
            <Input
              id="test-email"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="test-password">Mot de passe de test</Label>
            <Input
              id="test-password"
              type="password"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              placeholder="password123"
            />
          </div>
        </div>

        {/* Boutons de test */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button 
            onClick={() => runAuthTest('signup')} 
            disabled={loading}
            variant="outline"
          >
            📝 Test Inscription
          </Button>
          
          <Button 
            onClick={() => runAuthTest('signin')} 
            disabled={loading}
            variant="outline"
          >
            🔑 Test Connexion
          </Button>
          
          <Button 
            onClick={() => runAuthTest('signout')} 
            disabled={loading || !user}
            variant="outline"
          >
            🚪 Test Déconnexion
          </Button>
        </div>

        {/* Résultat du test */}
        {testResult && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <strong>Résultat:</strong> {testResult}
          </div>
        )}

        {/* Guide */}
        <div className="text-sm text-gray-600 space-y-1">
          <div><strong>Tests disponibles:</strong></div>
          <div>• 📝 <strong>Inscription:</strong> Crée un nouveau compte avec l'email de test</div>
          <div>• 🔑 <strong>Connexion:</strong> Se connecte avec les identifiants de test</div>
          <div>• 🚪 <strong>Déconnexion:</strong> Déconnecte l'utilisateur actuel</div>
          <div className="pt-2 text-xs">
            <strong>Note:</strong> Les vraies fonctions d'auth sont dans la navbar (bouton "Connexion")
          </div>
        </div>

      </CardContent>
    </Card>
  );
} 