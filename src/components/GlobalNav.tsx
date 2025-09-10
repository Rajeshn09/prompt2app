import React, { useState } from 'react';
import { Button } from './ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, History, PanelRightClose, PanelRightOpen, Settings, User, HelpCircle, Palette, CreditCard, Gift, Home, LogOut } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Progress } from './ui/progress';
import Logo from './Logo';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import LoginButton from './LoginButton';
import OAuthConnectionManager from './OAuthConnectionManager';
const GlobalNav = () => {
  const {
    state
  } = useApp();
  const {
    signOut,
    isAuthenticated,
    user,
    profile
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [projectName, setProjectName] = useState(state.projectName);

  // Sync local project name with global state
  React.useEffect(() => {
    setProjectName(state.projectName);
  }, [state.projectName]);
  const isWorkspace = location.pathname === '/workspace';
  const isHome = location.pathname === '/';

  // Mock data - replace with real data from context/API
  const creditsUsed = 183.6;
  const creditsTotal = 300;
  const creditsRemaining = creditsTotal - creditsUsed;
  const creditProgress = creditsUsed / creditsTotal * 100;
  const handleSignOut = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Logged out state - landing page
  if (!isAuthenticated) {
    return <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <Logo size="sm" showText={true} />
            </Link>
            
            <div className="flex items-center gap-3">
              <LoginButton />
              <Link to="/auth/signin">
                <Button size="sm" className="rounded-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>;
  }

  // Logged in - Workspace view (no nav needed since it's in ChatPanel)
  if (isWorkspace) {
    return null;
  }

  // Logged in - Home page with account dropdown
  return <TooltipProvider>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center">
                <Logo size="sm" showText={true} />
              </Link>
              
              <Button variant="outline" size="sm">
                <Gift className="h-4 w-4 mr-2" />
                Get Free Credits
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:bg-muted/50 rounded-md px-2 py-1 transition-colors">
                    <div className="w-8 h-8 bg-purple-600 rounded text-white text-sm font-bold flex items-center justify-center">
                      {(profile?.display_name || user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{profile?.display_name || user?.email?.split('@')[0] || 'User'}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <div className="px-3 py-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-purple-600 rounded text-white text-sm font-bold flex items-center justify-center">
                        {(profile?.display_name || user?.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{profile?.display_name || user?.email?.split('@')[0] || 'User'}</div>
                        <div className="text-sm text-muted-foreground">{user?.email || 'No email'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm">Free plan</span>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        Turn Pro
                      </Button>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span>Credits</span>
                        <span className="text-muted-foreground">3.4 left</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: '34%' }}></div>
                      </div>
                      <div className="text-xs text-muted-foreground">• Daily credits used first</div>
                    </div>
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    Invite
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuLabel>Workspaces (3)</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs font-bold flex items-center justify-center">M</div>
                        <span>My Lovable</span>
                      </div>
                      <span className="text-xs text-muted-foreground">FREE</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-purple-600 rounded text-white text-xs font-bold flex items-center justify-center">D</div>
                        <span>Demo's Lovable</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">PRO</span>
                        <span>✓</span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gray-600 rounded text-white text-xs font-bold flex items-center justify-center">T</div>
                        <span>Test</span>
                      </div>
                      <span className="text-xs bg-gray-400 text-white px-2 py-0.5 rounded">INACTIVE</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>+ Create new workspace</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem>
                    <Gift className="h-4 w-4 mr-2" />
                    Get Free Credits
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem>
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help Center
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem>
                    <Palette className="h-4 w-4 mr-2" />
                    Appearance
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <div className="px-3 py-2">
                    <DropdownMenuLabel className="text-xs font-medium mb-2">Connected Accounts</DropdownMenuLabel>
                    <OAuthConnectionManager />
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
    </TooltipProvider>;
};
export default GlobalNav;