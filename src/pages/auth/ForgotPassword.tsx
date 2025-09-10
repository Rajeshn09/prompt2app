import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';
import Logo from '../../components/Logo';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate password reset request
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast({
        title: "Reset link sent",
        description: "If an account exists for this email, a reset link has been sent.",
      });
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-radial from-background to-background flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
        
        <Card className="w-full max-w-md p-8 bg-glass backdrop-blur-sm border-glass-border relative z-10 text-center">
          <Link to="/" className="inline-block mb-6">
            <Logo size="lg" showText={true} />
          </Link>
          
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📧</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
            <p className="text-muted-foreground">
              If an account exists for <strong>{email}</strong>, a reset link has been sent.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Didn't receive an email? Check your spam folder or try again.
            </p>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setIsSubmitted(false);
                setEmail('');
              }}
            >
              Try different email
            </Button>
            
            <Link to="/auth/signin">
              <Button variant="ghost" className="w-full">
                Back to sign in
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-radial from-background to-background flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      
      <Card className="w-full max-w-md p-8 bg-glass backdrop-blur-sm border-glass-border relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <Logo size="lg" showText={true} />
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-2">Reset your password</h1>
          <p className="text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !email}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
                Sending reset link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>

        <div className="text-center pt-6 border-t border-border mt-6">
          <Link 
            to="/auth/signin" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to sign in
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;