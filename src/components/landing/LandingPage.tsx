'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthModal } from '@/components/auth/AuthModal';
import { 
  TrendingUp, 
  Shield, 
  BarChart3, 
  Globe, 
  Zap, 
  Users,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Suivi en temps réel",
      description: "Surveillez vos investissements crypto et actions avec des données actualisées en temps réel."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analyses avancées",
      description: "Graphiques détaillés et indicateurs de performance pour optimiser votre stratégie."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Sécurité maximale",
      description: "Vos données sont protégées par une authentification sécurisée et un chiffrement de bout en bout."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Multi-devises",
      description: "Gérez vos investissements depuis n'importe quel appareil, partout dans le monde."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Interface intuitive",
      description: "Design moderne et ergonomique pour une expérience utilisateur optimale."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Communauté",
      description: "Rejoignez une communauté d'investisseurs passionnés et partagez vos stratégies."
    }
  ];

  const benefits = [
    "Gestion centralisée de vos investissements",
    "Calcul automatique des profits/pertes",
    "Historique complet de vos transactions",
    "Alertes personnalisées",
    "Rapports détaillés et exportables",
    "Support client réactif"
  ];

  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Stablvest
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                La plateforme moderne pour gérer vos investissements crypto et actions
              </p>
              <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
                Simplifiez la gestion de votre portefeuille d'investissement avec des outils 
                professionnels et une interface intuitive. Suivez vos performances en temps réel.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-lg px-8 py-3"
                >
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-3"
                >
                  Voir la démo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tout ce dont vous avez besoin pour investir
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Une suite complète d'outils pour optimiser votre stratégie d'investissement
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Pourquoi choisir Stablvest ?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Rejoignez des milliers d'investisseurs qui font confiance à notre plateforme
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Fonctionnalités principales</h3>
                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card p-8 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-semibold mb-6">Prêt à commencer ?</h3>
                  <p className="text-muted-foreground mb-6">
                    Créez votre compte gratuitement et commencez à gérer vos investissements 
                    en quelques minutes.
                  </p>
                  <Button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full"
                    size="lg"
                  >
                    Créer mon compte
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Prêt à optimiser vos investissements ?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Rejoignez Stablvest aujourd'hui et prenez le contrôle de votre avenir financier.
              </p>
              <Button 
                size="lg" 
                onClick={() => setIsAuthModalOpen(true)}
                className="text-lg px-8 py-3"
              >
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
} 