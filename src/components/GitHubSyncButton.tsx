import React from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Github, ExternalLink, Settings, GitBranch, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';

const GitHubSyncButton = () => {
  const { state } = useApp();
  return (
    <TooltipProvider>
      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Github className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sync your project to GitHub</p>
          </TooltipContent>
        </Tooltip>

        <DialogContent className="w-96 p-0">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                GitHub Integration
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                  Connected
                </Badge>
              </div>

              <Separator />

              {/* Repository */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Repository</span>
                <div className="flex items-center gap-2 p-2 rounded-md border bg-muted/20">
                   <div className="flex-1 min-w-0">
                     <p className="text-sm font-mono truncate">Arshit007/{state.projectName}</p>
                   </div>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Edit in VS Code
                </Button>

                <Button variant="outline" className="w-full justify-start gap-2">
                  <GitBranch className="h-4 w-4" />
                  Sync Branches
                </Button>

                <Button variant="outline" className="w-full justify-start gap-2">
                  <Upload className="h-4 w-4" />
                  Push Changes
                </Button>
              </div>

              <Separator />

              {/* Configure */}
              <Button className="w-full gap-2">
                <Settings className="h-4 w-4" />
                Configure
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default GitHubSyncButton;