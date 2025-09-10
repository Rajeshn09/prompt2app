import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './ui/resizable';
import { Progress } from './ui/progress';
import FileExplorer from './FileExplorer';
import CodeEditor from './CodeEditor';
import PathPreviewDropdown from './PathPreviewDropdown';
import DevicePreviewToggle from './DevicePreviewToggle';
import InviteButton from './InviteButton';
import GitHubSyncButton from './GitHubSyncButton';
import PublishButton from './PublishButton';
import { Button } from './ui/button';

const CodePreview = () => {
  const { state, dispatch } = useApp();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isIframeLoading, setIsIframeLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const tabs = [
    { id: 'preview', label: '👁️ Preview', icon: '👁️' },
    { id: 'code', label: '</> Code', icon: '🔧' }
  ];

  const getDeviceWidth = () => {
    switch (state.deviceView) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      case 'desktop': return '100%';
      default: return '100%';
    }
  };

  useEffect(() => {
    if (state.activeTab === 'preview' && iframeRef.current && !state.isGenerating) {
      setIsIframeLoading(true);
      setLoadingProgress(0);
      
      // Simulate loading progress
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 200);
      
      // Create preview URL based on selected route
      const baseUrl = window.location.origin;
      const previewUrl = `${baseUrl}${state.previewRoute}`;
      iframeRef.current.src = previewUrl;
    }
  }, [state.activeTab, state.previewRoute, state.isGenerating]);

  const handleIframeLoad = () => {
    setLoadingProgress(100);
    setTimeout(() => {
      setIsIframeLoading(false);
      dispatch({ type: 'SET_PREVIEW_ERROR', payload: false });
      dispatch({ type: 'SET_PREVIEW_LOADED', payload: true });
    }, 300);
  };

  const handleIframeError = () => {
    setIsIframeLoading(false);
    dispatch({ type: 'SET_PREVIEW_ERROR', payload: true });
    dispatch({ type: 'SET_PREVIEW_LOADED', payload: false });
  };

  const handleRegeneratePreview = () => {
    // Reset error state and reload
    dispatch({ type: 'SET_PREVIEW_ERROR', payload: false });
    setIsIframeLoading(true);
    setLoadingProgress(0);
    
    // Trigger reload by changing the src
    if (iframeRef.current) {
      const baseUrl = window.location.origin;
      const previewUrl = `${baseUrl}${state.previewRoute}?t=${Date.now()}`;
      iframeRef.current.src = previewUrl;
    }
  };

  const handleFileSelect = (file: any) => {
    // Open file in the code editor
    if ((window as any).openFileInEditor) {
      (window as any).openFileInEditor(file);
    }
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Top Navigation */}
      <div className="flex-shrink-0 bg-background border-b border-border">
        {/* Mobile Layout */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between p-2">
            {/* Left: Tab buttons - Mobile sized */}
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
                  className={`px-3 py-2.5 mr-1 text-sm font-medium rounded-md transition-all inline-flex items-center gap-1.5 min-h-[44px] ${
                    state.activeTab === tab.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }`}
                >
                  <span className="text-xs">{tab.id === 'code' ? '</>' : '👁️'}</span>
                  {tab.id === 'code' ? 'Code' : 'Preview'}
                </button>
              ))}
            </div>
            
            {/* Right: Action buttons - Mobile sized */}
            <div className="flex items-center gap-1">
              <PublishButton />
            </div>
          </div>
          
          {/* Preview controls row for mobile (when preview tab is active) */}
          {state.activeTab === 'preview' && (
            <div className="flex items-center justify-center gap-3 p-2 border-t border-border">
              <DevicePreviewToggle />
              <PathPreviewDropdown />
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between p-2">
          {/* Left: Tab buttons */}
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
                className={`px-4 py-2 mr-2 text-sm font-medium rounded-md transition-all inline-flex items-center gap-2 ${
                  state.activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                <span className="text-xs">{tab.id === 'code' ? '</>' : '👁️'}</span>
                {tab.id === 'code' ? 'Code' : 'Preview'}
              </button>
            ))}
          </div>

          {/* Center: Preview controls (only show when preview tab is active) */}
          {state.activeTab === 'preview' && (
            <div className="flex items-center gap-3">
              <DevicePreviewToggle />
              <PathPreviewDropdown />
            </div>
          )}

          {/* Right: Invite, GitHub, and Publish buttons */}
          <div className="flex items-center gap-2">
            <InviteButton />
            <GitHubSyncButton />
            <PublishButton />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative">
        {state.activeTab === 'preview' ? (
          <div className="w-full h-full bg-background flex justify-center">
            <div 
              className="bg-white border-x border-border transition-all duration-300"
              style={{ width: getDeviceWidth(), maxWidth: '100%' }}
            >
              {state.isGenerating ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  {/* Animated loader */}
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-8"></div>
                  
                  {/* Main marketing message */}
                  <h2 className="text-2xl font-semibold text-foreground mb-4 leading-relaxed">
                    Every great product starts with an idea.<br />
                    You're moments away from seeing yours come to life.
                  </h2>
                  
                  {/* Subtext */}
                  <div className="text-muted-foreground space-y-1">
                    <p>Hang tight while we generate your full-stack app from your input.</p>
                    <p className="text-sm">(Powered by AI – no code, no delays, just creation.)</p>
                  </div>
                </div>
              ) : state.previewError ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#F8F9FA] rounded-lg shadow-sm">
                  {/* Error illustration */}
                  <div className="text-6xl mb-6">🤖💫</div>
                  
                  {/* Headline */}
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Well, that wasn't supposed to happen.
                  </h2>
                  
                  {/* Subtext */}
                  <div className="text-gray-600 mb-8 space-y-1">
                    <p>Sometimes even AI needs a second shot.</p>
                    <p>Your app is just a click away — let's try again.</p>
                  </div>
                  
                  {/* Regenerate button */}
                  <Button 
                    onClick={handleRegeneratePreview}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg shadow-sm transition-all hover:shadow-md"
                    title="Retry building your app preview"
                  >
                    🔄 Regenerate Preview
                  </Button>
                  
                  {/* Optional tooltip */}
                  <p className="text-xs text-gray-500 mt-4 max-w-md">
                    Error loading preview. Don't worry — your prompt is safe, and we're ready to try again.
                  </p>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  {isIframeLoading && (
                    <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center p-8 text-center">
                      {/* Animated loader */}
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-8"></div>
                      
                      {/* Main marketing message */}
                      <h2 className="text-2xl font-semibold text-foreground mb-4 leading-relaxed">
                        Every great product starts with an idea.<br />
                        You're moments away from seeing yours come to life.
                      </h2>
                      
                      {/* Subtext */}
                      <div className="text-muted-foreground space-y-1 mb-6">
                        <p>Hang tight while we generate your full-stack app from your input.</p>
                        <p className="text-sm">(Powered by AI – no code, no delays, just creation.)</p>
                      </div>

                      {/* Loading progress */}
                      <div className="w-64 space-y-2">
                        <p className="text-sm font-medium text-foreground">Loading Preview</p>
                        <Progress value={loadingProgress} className="w-full h-2" />
                        <p className="text-xs text-muted-foreground">{Math.round(loadingProgress)}%</p>
                      </div>
                    </div>
                  )}
                  <iframe
                    ref={iframeRef}
                    className="w-full h-full border-0"
                    title="Live Preview"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    style={{ 
                      overflow: 'auto',
                      WebkitOverflowScrolling: 'touch'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full">
            {/* Mobile Code View - Stack vertically */}
            <div className="sm:hidden h-full flex flex-col">
              <div className="h-1/3 border-b border-border">
                <FileExplorer onFileSelect={handleFileSelect} />
              </div>
              <div className="h-2/3">
                <CodeEditor />
              </div>
            </div>
            
            {/* Desktop Code View - Side by side */}
            <div className="hidden sm:block h-full">
              <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                  <FileExplorer onFileSelect={handleFileSelect} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={75}>
                  <CodeEditor />
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodePreview;