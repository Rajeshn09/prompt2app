import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Globe, ExternalLink, Shield, Eye, RefreshCw, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import OAuthConnectionManager from './OAuthConnectionManager';

interface MobilePublishPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobilePublishPanel = ({ isOpen, onClose }: MobilePublishPanelProps) => {
  const { state } = useApp();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 sm:hidden"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`fixed bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-2xl z-50 transform transition-transform duration-300 sm:hidden ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        {/* Drag Handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-8 h-1 bg-muted-foreground/30 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <h3 className="font-semibold text-lg">Publish & Deploy</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="px-4 pb-6 max-h-[50vh] overflow-y-auto">
          <div className="space-y-4">
            {/* Preview Link */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Preview Link</h4>
              <div className="flex items-center gap-2 p-3 rounded-md border bg-muted/20">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground truncate">
                    preview--{state.projectName}.prompt2app.com
                  </p>
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Published Site */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Published Site</h4>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 rounded-md border">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{state.projectName}.prompt2app.com</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Eye className="h-3 w-3" />
                      <span className="text-xs text-muted-foreground">0 Visitors</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  Want a custom domain? 
                  <Button variant="link" className="h-auto p-0 text-xs ml-1">
                    Learn more
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Security Review */}
            <div className="flex items-center justify-between p-3 rounded-md border bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Security Review</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                Free
              </Badge>
            </div>

            <Separator />

            {/* OAuth Connections */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Connected Accounts</h4>
              <OAuthConnectionManager />
            </div>

            <Separator />

            {/* Update Button */}
            <Button className="w-full gap-2 h-12">
              <RefreshCw className="h-4 w-4" />
              Update Deployment
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobilePublishPanel;