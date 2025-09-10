import React from 'react';
import PromptInput from '../components/PromptInput';
import GlobalNav from '../components/GlobalNav';
import Footer from '../components/Footer';
import MyWorkspace from '../components/MyWorkspace';
import { useAuth } from '../context/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-radial from-background to-background relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      
      <GlobalNav />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-20">
        {/* Always show the prompt input and workspace if authenticated */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6 lg:text-5xl">
            From Idea to App — Delivered in 5 Minutes.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed lg:text-xl">
            Describe it with a prompt, image, or video — get your app in 5 minutes.
          </p>
        </div>
        
        <div className="animate-slide-up mb-20">
          <PromptInput />
        </div>
        
        {/* My Workspace Section - Only show when authenticated */}
        {isAuthenticated && <MyWorkspace />}
        
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary/5 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary/10 rounded-full blur-lg" />
      </div>
      
      <Footer />
    </div>
  );
};
export default Index;