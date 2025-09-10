import React from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { UserPlus, Users, ExternalLink } from 'lucide-react';

const InviteButton = () => {
  const collaborators = [
    { name: "Demo's Prompt2App", email: "demo@prompt2app.dev", role: "Owner", initials: "DP" },
    { name: "John Doe", email: "john@example.com", role: "Editor", initials: "JD" },
    { name: "Jane Smith", email: "jane@example.com", role: "Viewer", initials: "JS" },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Invite
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4" />
            <h3 className="font-semibold">Invite Collaborators</h3>
          </div>
          
          <div className="space-y-3 mb-4">
            <Input 
              placeholder="Enter email address" 
              className="text-sm"
            />
            <Button size="sm" className="w-full">
              Send Invite
            </Button>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Demo's Prompt2App</h4>
              <span className="text-xs text-muted-foreground">{collaborators.length} members</span>
            </div>

            <div className="space-y-2">
              {collaborators.map((collaborator, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                    {collaborator.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{collaborator.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{collaborator.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{collaborator.role}</span>
                </div>
              ))}
            </div>

            <Separator className="my-3" />

            <div className="text-xs text-muted-foreground p-2 bg-muted/20 rounded-md">
              💡 Collaborators will use credits from the project owner's workspace.
            </div>

            <div className="text-center">
              <Button variant="link" size="sm" className="text-xs h-auto p-0">
                Need more than 20 collaborators? Contact support
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InviteButton;