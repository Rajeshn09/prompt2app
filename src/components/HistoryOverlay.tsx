import React from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface HistoryOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const HistoryOverlay = ({ isOpen, onClose }: HistoryOverlayProps) => {
  // Mock history data
  const historyItems = [
    {
      id: 1,
      title: "Added hero section with gradient background",
      timestamp: "2:30 PM",
      date: "Today"
    },
    {
      id: 2,
      title: "Updated navigation menu styling",
      timestamp: "1:45 PM", 
      date: "Today"
    },
    {
      id: 3,
      title: "Created responsive contact form",
      timestamp: "11:20 AM",
      date: "Today"
    },
    {
      id: 4,
      title: "Implemented dark mode toggle",
      timestamp: "4:15 PM",
      date: "Yesterday"
    },
    {
      id: 5,
      title: "Added image gallery component",
      timestamp: "2:30 PM",
      date: "Yesterday"
    },
    {
      id: 6,
      title: "Fixed mobile responsiveness issues",
      timestamp: "10:45 AM",
      date: "August 3"
    }
  ];

  const groupedHistory = historyItems.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = [];
    }
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, typeof historyItems>);

  if (!isOpen) return null;

  return (
    <>
      {/* Desktop - Right panel */}
      <div className="hidden lg:block">
        <div className="fixed inset-y-0 right-0 w-[400px] bg-background border-l border-border shadow-lg z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-lg font-semibold">History</h3>
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
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {Object.entries(groupedHistory).map(([date, items]) => (
                <div key={date}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">{date}</h4>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        className="w-full p-3 text-left rounded-lg hover:bg-muted transition-colors"
                      >
                        <p className="text-sm font-medium text-foreground mb-1">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.timestamp}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
        />
      </div>

      {/* Tablet - Bottom sheet (halfway up) */}
      <div className="hidden sm:block lg:hidden">
        <div className="fixed inset-0 z-50 flex items-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          
          {/* Panel */}
          <div className="relative w-full h-1/2 bg-background border-t border-border rounded-t-2xl">
            {/* Drag Handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-8 h-1 bg-muted-foreground/30 rounded-full" />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold">History</h3>
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
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                {Object.entries(groupedHistory).map(([date, items]) => (
                  <div key={date}>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">{date}</h4>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          className="w-full p-3 text-left rounded-lg hover:bg-muted transition-colors"
                        >
                          <p className="text-sm font-medium text-foreground mb-1">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.timestamp}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile - Full bottom sheet */}
      <div className="sm:hidden">
        <div className="fixed inset-0 z-50 flex items-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          
          {/* Panel */}
          <div className="relative w-full h-3/4 bg-background border-t border-border rounded-t-2xl">
            {/* Drag Handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-8 h-1 bg-muted-foreground/30 rounded-full" />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold">History</h3>
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
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                {Object.entries(groupedHistory).map(([date, items]) => (
                  <div key={date}>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">{date}</h4>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          className="w-full p-4 text-left rounded-lg hover:bg-muted transition-colors min-h-[44px]"
                        >
                          <p className="text-sm font-medium text-foreground mb-1">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.timestamp}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryOverlay;