import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import GlobalNav from '../components/GlobalNav';
import Footer from '../components/Footer';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        '5 projects per month',
        'Basic templates',
        'Community support',
        'Public projects only'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      features: [
        'Unlimited projects',
        'Premium templates',
        'Priority support',
        'Private projects',
        'Custom domains',
        'Advanced analytics'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Team',
      price: '$99',
      period: 'per month',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'SSO integration',
        'Advanced permissions',
        'Dedicated support',
        'Custom integrations'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-radial from-background to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      
      <GlobalNav />
      
      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that's right for you and your team. Start building today.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`p-8 bg-glass backdrop-blur-sm border-glass-border relative ${
                  plan.popular ? 'ring-2 ring-blue-accent scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-accent text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-muted-foreground">
                      <span className="text-green-accent mr-3">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${plan.popular ? 'bg-blue-accent hover:bg-blue-accent/90' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="text-center mt-16 pt-16 border-t border-border">
            <h2 className="text-3xl font-bold text-foreground mb-8">Frequently asked questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-left">
                <h3 className="font-semibold text-foreground mb-2">Can I change my plan later?</h3>
                <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground mb-2">Is there a free trial?</h3>
                <p className="text-muted-foreground">Yes, we offer a 14-day free trial for our Pro plan. No credit card required.</p>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">We accept all major credit cards, PayPal, and wire transfers for enterprise customers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Pricing;