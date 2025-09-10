import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowUpRight, RotateCcw, Plus, Send } from 'lucide-react';
import PathPreviewDropdown from './PathPreviewDropdown';

interface MobilePromptInputProps {
  mobileActiveTab?: 'chat' | 'preview';
  setMobileActiveTab?: (tab: 'chat' | 'preview') => void;
}

const MobilePromptInput = ({ mobileActiveTab, setMobileActiveTab }: MobilePromptInputProps) => {
  const { state, dispatch } = useApp();
  const [prompt, setPrompt] = useState('');

  const handleSend = () => {
    if (!prompt.trim()) return;
    
    dispatch({
      type: 'ADD_MESSAGE',
      payload: { 
        role: 'user', 
        content: prompt,
        attachedFiles: state.attachedFiles.length > 0 ? [...state.attachedFiles] : undefined
      }
    });

    setPrompt('');
    
    // Clear attached files after sending
    if (state.attachedFiles.length > 0) {
      dispatch({
        type: 'SET_FILES',
        payload: []
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachFile = () => {
    // TODO: Implement file attachment
  };

  return (
    <div className="flex-shrink-0 p-4 bg-background border-t border-border sm:hidden">
      <div className="bg-card rounded-2xl border border-border shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-2">
            {/* Route Dropdown */}
            <PathPreviewDropdown />
            
            {/* Open App Arrow */}
            <button 
              className="flex items-center justify-center min-w-[44px] min-h-[44px] text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Open app"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
            
            {/* Refresh Icon */}
            <button 
              className="flex items-center justify-center min-w-[44px] min-h-[44px] text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Refresh"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            <div className="flex-1">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe the app you want to build..."
                className="w-full min-h-[44px] max-h-32 text-sm bg-transparent border-0 outline-none resize-none placeholder:text-muted-foreground"
                rows={1}
              />
            </div>
          </div>
        </div>
        
        {/* Mobile Tab Buttons Row - Only show in chat mode */}
        {mobileActiveTab === 'chat' && (
          <div className="flex items-center justify-between p-3 pt-0">
            <div className="flex items-center gap-3">
              <button
                onClick={handleAttachFile}
                className="flex items-center justify-center min-w-[44px] min-h-[44px] text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Attach file"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleSend}
              disabled={!prompt.trim()}
              className="flex items-center justify-center min-w-[44px] min-h-[44px] bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobilePromptInput;