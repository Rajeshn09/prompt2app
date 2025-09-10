import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { ChevronDown, Check } from 'lucide-react';

const PathPreviewDropdown = () => {
  const { state, dispatch } = useApp();

  const routes = [
    { path: '/', label: 'Home' },
    { path: '/workspace', label: 'Workspace' },
    { path: '/auth/signin', label: 'Sign In' },
    { path: '/auth/signup', label: 'Sign Up' },
    { path: '/auth/forgot-password', label: 'Forgot Password' },
    { path: '/pricing', label: 'Pricing' }
  ];

  const handleRouteSelect = (path: string) => {
    dispatch({ type: 'SET_PREVIEW_ROUTE', payload: path });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-mono bg-muted text-muted-foreground rounded-md hover:bg-muted/80 hover:text-foreground transition-colors">
        <span>{state.previewRoute}</span>
        <ChevronDown className="h-3 w-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-popover" align="center">
        {routes.map((route) => (
          <DropdownMenuItem
            key={route.path}
            onClick={() => handleRouteSelect(route.path)}
            className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-muted/50"
          >
            <span className="font-mono text-xs">{route.path}</span>
            {state.previewRoute === route.path && (
              <Check className="h-3 w-3 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PathPreviewDropdown;