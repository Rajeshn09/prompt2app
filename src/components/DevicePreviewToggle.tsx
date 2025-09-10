import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

const DevicePreviewToggle = () => {
  const { state, dispatch } = useApp();

  const devices = [
    { type: 'mobile' as const, icon: Smartphone, label: 'Mobile view' },
    { type: 'tablet' as const, icon: Tablet, label: 'Tablet view' },
    { type: 'desktop' as const, icon: Monitor, label: 'Desktop view' }
  ];

  const currentIndex = devices.findIndex(device => device.type === state.deviceView);
  const nextIndex = (currentIndex + 1) % devices.length;
  const nextDevice = devices[nextIndex];

  const handleToggle = () => {
    dispatch({ type: 'SET_DEVICE_VIEW', payload: nextDevice.type });
  };

  const currentDevice = devices[currentIndex];
  const CurrentIcon = currentDevice.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        >
          <CurrentIcon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Show {nextDevice.label}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default DevicePreviewToggle;