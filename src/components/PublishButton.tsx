import React from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Globe, ExternalLink, Shield, Eye, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import OAuthConnectionManager from './OAuthConnectionManager';

const PublishButton = () => {
  const { state } = useApp();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          Publish
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4" />
            <h3 className="font-semibold">Publish & Deploy</h3>
          </div>
          
          <div className="space-y-4">
            {/* Preview Link */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Preview Link</h4>
              <div className="flex items-center gap-2 p-2 rounded-md border bg-muted/20">
                <div className="flex-1 min-w-0">
                   <p className="text-xs text-muted-foreground truncate">
                     preview--{state.projectName}.prompt2app.com
                   </p>
                </div>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Published Site */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Published Site</h4>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded-md border">
                   <div className="flex-1 min-w-0">
                     <p className="text-sm font-medium truncate">{state.projectName}.prompt2app.com</p>
                     <div className="flex items-center gap-1 mt-1">
                      <Eye className="h-3 w-3" />
                      <span className="text-xs text-muted-foreground">0 Visitors</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <ExternalLink className="h-3 w-3" />
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
            <div className="flex items-center justify-between p-2 rounded-md border bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Security Review</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                Free
              </Badge>
            </div>

            {/* OAuth Connections */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Connected Accounts</h4>
              <OAuthConnectionManager />
            </div>

            <Separator />

            {/* Update Button */}
            <Button className="w-full gap-2">
              <RefreshCw className="h-4 w-4" />
              Update Deployment
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PublishButton;