#!/usr/bin/env node

// Script simple pour tester la configuration Supabase
const fs = require('fs');
const path = require('path');

console.log('🧪 Test de la configuration Supabase...\n');

// Lire le fichier .env.local manuellement
let url = '', anonKey = '', serviceKey = '';
const envPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');
  
  envLines.forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      url = line.split('=')[1];
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      anonKey = line.split('=')[1];
    }
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
      serviceKey = line.split('=')[1];
    }
  });
}

console.log('📋 Variables d\'environnement:');
console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${url ? '✅ Définie' : '❌ Manquante'}`);
console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${anonKey ? '✅ Définie' : '❌ Manquante'}`);
console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${serviceKey ? '✅ Définie' : '❌ Manquante'}\n`);

if (url) {
  console.log(`🌐 URL Supabase: ${url.substring(0, 30)}...`);
}

if (!url || !anonKey) {
  console.log('❌ Configuration incomplète !');
  console.log('\n📝 Actions requises:');
  console.log('   1. Créez le fichier .env.local à la racine du projet');
  console.log('   2. Ajoutez vos clés Supabase:');
  console.log('      NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.log('      NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
  console.log('      SUPABASE_SERVICE_ROLE_KEY=your-service-key');
  console.log('   3. Redémarrez le serveur de développement\n');
  process.exit(1);
}

// Test de format URL
if (url && !url.includes('supabase.co')) {
  console.log('⚠️  L\'URL ne semble pas être une URL Supabase valide\n');
}

// Test de longueur des clés
if (anonKey && anonKey.length < 100) {
  console.log('⚠️  La clé anon semble courte, vérifiez qu\'elle est complète\n');
}

console.log('✅ Configuration de base OK !');
console.log('\n🚀 Prochaines étapes:');
console.log('   1. Démarrez votre serveur: npm run dev');
console.log('   2. Visitez: http://localhost:3000/test');
console.log('   3. Utilisez le composant de test Supabase pour une validation complète\n'); 