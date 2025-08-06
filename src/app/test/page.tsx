import { ServiceTest } from '@/components/test/ServiceTest';
import { SupabaseTest } from '@/components/test/SupabaseTest';
import { MappingTest } from '@/components/test/MappingTest';
import { AuthTest } from '@/components/test/AuthTest';
import { RouteProtectionTest } from '@/components/test/RouteProtectionTest';
import { LandingPageTest } from '@/components/test/LandingPageTest';

export default function TestPage() {
  return (
    <main className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Service Tests</h1>
      
      {/* Test Supabase Configuration */}
      <SupabaseTest />
      
      {/* Test des Mappings de Données */}
      <MappingTest />
      
      {/* Test du Système d'Authentification */}
      <AuthTest />
      
      {/* Test de Protection des Routes */}
      <RouteProtectionTest />
      
      {/* Test de la Landing Page */}
      <LandingPageTest />
      
      {/* Tests des services existants */}
      <ServiceTest />
    </main>
  );
} 