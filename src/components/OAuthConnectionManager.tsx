import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Github, Chrome, Unlink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import GoogleIcon from './GoogleIcon';

interface OAuthConnectionManagerProps {
  variant?: 'dropdown' | 'inline';
  className?: string;
}

const OAuthConnectionManager: React.FC<OAuthConnectionManagerProps> = ({ 
  variant = 'dropdown', 
  className = '' 
}) => {
  const { profile, updateProfile, signInWithProvider } = useAuth();

  const handleConnect = async (provider: 'google' | 'github') => {
    const { error } = await signInWithProvider(provider);
    
    if (error) {
      if (error.includes('not configured') || error.includes('OAuth')) {
        toast.error(`${provider === 'google' ? 'Google' : 'GitHub'} OAuth is not configured yet.`);
      } else {
        toast.error(`Failed to connect ${provider === 'google' ? 'Google' : 'GitHub'}: ${error}`);
      }
    } else {
      toast.success(`Successfully connected ${provider === 'google' ? 'Google' : 'GitHub'}!`);
    }
  };

  const handleDisconnect = async (provider: 'google' | 'github') => {
    const updates = provider === 'google' 
      ? { google_connected: false, google_email: null, google_avatar_url: null }
      : { github_connected: false, github_username: null, github_avatar_url: null };

    const { error } = await updateProfile(updates);
    
    if (error) {
      toast.error(`Failed to disconnect ${provider === 'google' ? 'Google' : 'GitHub'}`);
    } else {
      toast.success(`Disconnected ${provider === 'google' ? 'Google' : 'GitHub'}`);
    }
  };

  const connections = [
    {
      provider: 'github' as const,
      name: 'GitHub',
      icon: Github,
      connected: profile?.github_connected || false,
      info: profile?.github_username || null,
      avatar: profile?.github_avatar_url || null,
    },
    {
      provider: 'google' as const,
      name: 'Google',
      icon: GoogleIcon,
      connected: profile?.google_connected || false,
      info: profile?.google_email || null,
      avatar: profile?.google_avatar_url || null,
    },
  ];

  if (variant === 'inline') {
    return (
      <div className={`space-y-3 ${className}`}>
        {connections.map(({ provider, name, icon: Icon, connected, info }) => (
          <div key={provider} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              <div>
                <div className="font-medium">{name}</div>
                {connected && info && (
                  <div className="text-sm text-muted-foreground">{info}</div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {connected && (
                <Badge variant="secondary" className="text-xs">
                  Connected
                </Badge>
              )}
              <Button
                variant={connected ? "outline" : "default"}
                size="sm"
                onClick={() => connected ? handleDisconnect(provider) : handleConnect(provider)}
                className="gap-2"
              >
                {connected ? (
                  <>
                    <Unlink className="w-4 h-4" />
                    Disconnect
                  </>
                ) : (
                  <>
                    <Icon className="w-4 h-4" />
                    Connect
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {connections.map(({ provider, name, icon: Icon, connected, info }) => (
        <div key={provider} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <span className="text-sm">{name}</span>
            {connected && (
              <Badge variant="secondary" className="text-xs">
                Connected
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => connected ? handleDisconnect(provider) : handleConnect(provider)}
            className="text-xs px-2 py-1 h-auto"
          >
            {connected ? 'Disconnect' : 'Connect'}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default OAuthConnectionManager;