import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { useToast } from '../../hooks/use-toast';
import Logo from '../../components/Logo';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Key, KeySquare } from 'lucide-react';
import GoogleIcon from '../../components/GoogleIcon';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, dispatch } = useApp();
  const { signIn, signInWithProvider, login } = useAuth();

  // Auto-restore preserved prompt after successful login
  const handleSuccessfulLogin = () => {
    // Set login status
    dispatch({ type: 'SET_LOGIN_STATUS', payload: true });
    
    // Check if there's a preserved prompt to restore
    if (state.preservedPrompt) {
      // Restore the prompt and files
      dispatch({ type: 'SET_PROMPT', payload: state.preservedPrompt });
      dispatch({ type: 'SET_FILES', payload: state.preservedFiles });
      
      // Clear preserved data
      dispatch({ type: 'CLEAR_PRESERVED', payload: undefined });
      
      // Navigate to workspace to auto-trigger generation
      navigate('/workspace');
    } else {
      // No preserved prompt, go to home page
      navigate('/');
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // First try Supabase auth
      const { error } = await signIn(email, password);
      
      if (error) {
        // Fallback to mock auth for backward compatibility
        const success = login(email, password);
        
        if (success) {
          toast({
            title: "Welcome back!",
            description: "Successfully signed in to your account (mock).",
          });
          handleSuccessfulLogin();
        } else {
          toast({
            title: "Authentication failed",
            description: error.includes('Invalid') ? 
              "Invalid credentials. Try creating an account or use: arshit20jain@gmail.com / arshit" : 
              error,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to your account.",
        });
        handleSuccessfulLogin();
      }
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    
    try {
      const { error } = await signInWithProvider(provider);
      
      if (error) {
        setIsLoading(false);
        if (error.includes('not configured') || error.includes('OAuth')) {
          toast({
            title: `${provider === 'google' ? 'Google' : 'GitHub'} not configured`,
            description: `${provider === 'google' ? 'Google' : 'GitHub'} OAuth is not set up yet. Using demo mode.`,
            variant: "destructive"
          });
          
          // Fallback to simulated OAuth for demo
          setTimeout(() => {
            setIsLoading(false);
            toast({
              title: "Welcome back!",
              description: `Successfully signed in with ${provider === 'google' ? 'Google' : 'GitHub'} (demo).`,
            });
            handleSuccessfulLogin();
          }, 1000);
        } else {
          toast({
            title: "Authentication failed",
            description: error,
            variant: "destructive"
          });
        }
      }
      // If successful, the auth state change will handle the redirect
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Authentication failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSSOSignIn = () => {
    setIsLoading(true);
    
    // Simulate SSO flow
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Welcome back!",
        description: "Successfully signed in with SSO.",
      });
      handleSuccessfulLogin();
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-background to-background flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      
      <Card className="w-full max-w-md p-8 bg-glass backdrop-blur-sm border-glass-border relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <Logo size="lg" showText={false} />
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to Prompt2App</h1>
          <p className="text-muted-foreground">Turn your ideas into apps faster than ever</p>
        </div>

        <div className="space-y-4">
          {/* OAuth Buttons */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthSignIn('google')}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
            ) : (
              <GoogleIcon className="w-5 h-5 mr-2" />
            )}
            Continue with Google
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthSignIn('github')}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            )}
            Continue with GitHub
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleSSOSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
            ) : (
              <KeySquare className="w-5 h-5 mr-2" />
            )}
            Sign in with SSO
          </Button>

          <div className="relative">
            <Separator className="my-6" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-sm text-muted-foreground">
              Or continue with email
            </span>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
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
            <div>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Forgot Password */}
          <div className="text-center">
            <Link 
              to="/auth/forgot-password" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link 
                to="/auth/signup" 
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SignIn;