'use client';

import { SettingsForm } from '@/components/settings/SettingsForm';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <SettingsForm />
      </div>
    </ProtectedRoute>
  );
}
