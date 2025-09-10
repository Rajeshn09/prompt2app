import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

const LoginButton: React.FC = () => {
  const { user, profile, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Welcome, {profile?.display_name || user.email?.split('@')[0]}</span>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Link to="/auth/signin">
      <Button variant="outline" className="gap-2">
        <User className="w-4 h-4" />
        Sign In
      </Button>
    </Link>
  );
};

export default LoginButton;