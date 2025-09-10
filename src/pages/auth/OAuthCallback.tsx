import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateProfile } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          toast.error(`Authentication failed: ${error.message}`);
          navigate('/auth/signin');
          return;
        }

        if (data.session?.user) {
          const user = data.session.user;
          const provider = user.app_metadata?.provider;

          // Update profile with OAuth provider information
          if (provider === 'github') {
            await updateProfile({
              github_connected: true,
              github_username: user.user_metadata?.user_name || user.user_metadata?.preferred_username,
              github_avatar_url: user.user_metadata?.avatar_url,
            });
            toast.success('Successfully connected GitHub!');
          } else if (provider === 'google') {
            await updateProfile({
              google_connected: true,
              google_email: user.email,
              google_avatar_url: user.user_metadata?.avatar_url,
            });
            toast.success('Successfully connected Google!');
          }

          // Redirect to the appropriate page
          const returnUrl = localStorage.getItem('oauth_return_url') || '/';
          localStorage.removeItem('oauth_return_url');
          navigate(returnUrl);
        } else {
          toast.error('Authentication failed - no user session');
          navigate('/auth/signin');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        toast.error('An unexpected error occurred during authentication');
        navigate('/auth/signin');
      }
    };

    handleOAuthCallback();
  }, [navigate, updateProfile]);

  return (
    <div className="min-h-screen bg-gradient-radial from-background to-background flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      
      <div className="relative z-10 text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin rounded-full mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Completing authentication...</h2>
        <p className="text-muted-foreground">Please wait while we set up your account.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;