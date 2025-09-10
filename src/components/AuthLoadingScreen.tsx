import React from 'react';

const AuthLoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-radial from-background to-background flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      
      <div className="relative z-10 text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin rounded-full mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Loading your account...</h2>
        <p className="text-muted-foreground">Please wait while we set up your session.</p>
      </div>
    </div>
  );
};

export default AuthLoadingScreen;