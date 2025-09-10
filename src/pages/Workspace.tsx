import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChatPanel from '../components/ChatPanel';
import CodePreview from '../components/CodePreview';
import GlobalNav from '../components/GlobalNav';
import DevicePreviewToggle from '../components/DevicePreviewToggle';
import { Button } from '../components/ui/button';
import { MessageSquare, Monitor, History, Globe, ArrowLeft, ChevronDown, LayoutDashboard, Settings, Gift, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../components/ui/dropdown-menu';
import PathPreviewDropdown from '../components/PathPreviewDropdown';
import InviteButton from '../components/InviteButton';
import MobilePublishPanel from '../components/MobilePublishPanel';
import HistoryOverlay from '../components/HistoryOverlay';
const Workspace = () => {
  const {
    state,
    dispatch
  } = useApp();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileActiveTab, setMobileActiveTab] = useState<'chat' | 'preview'>('chat');
  const [projectState, setProjectState] = useState<'landing-page-826' | 'landing-page-990' | 'landing-page-19'>('landing-page-826');
  const [isPublishPanelOpen, setIsPublishPanelOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  useEffect(() => {
    // If not authenticated or no prompt, redirect to home
    if (!isAuthenticated || !state.prompt) {
      navigate('/');
      return;
    }

    // Add the user's prompt as the first message in the chat
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        role: 'user',
        content: state.prompt,
        attachedFiles: state.attachedFiles.length > 0 ? [...state.attachedFiles] : undefined
      }
    });

    // Clear attached files after submission
    dispatch({ type: 'CLEAR_FILES_AFTER_SUBMIT', payload: undefined });

    // Start the generation flow with thinking state
    const startTime = Date.now();
    dispatch({
      type: 'SET_GENERATION_START_TIME',
      payload: startTime
    });
    dispatch({
      type: 'SET_GENERATING',
      payload: true
    });
    dispatch({
      type: 'SET_PREVIEW_ERROR',
      payload: false
    });
    dispatch({
      type: 'SET_PREVIEW_LOADED',
      payload: false
    });
    const thinkingMessageId = Date.now().toString();
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        role: 'assistant',
        content: 'Thinking...'
      }
    });

    // Simulate generation delay
    setTimeout(() => {
      const scaffoldCode = {
        html: `<div class="app-container">
  <header class="header">
    <h1>Welcome to Your App</h1>
    <p>Generated from: "${state.prompt}"</p>
  </header>
  
  <main class="main-content">
    <div class="card">
      <h2>Hello from ${state.prompt.split(' ').slice(0, 3).join(' ')}!</h2>
      <p>Your app is now ready for customization.</p>
      <button onclick="handleClick()" class="cta-button">Get Started</button>
    </div>
  </main>
  
  <footer class="footer">
    <p>&copy; 2024 Generated App</p>
  </footer>
</div>`,
        css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.6;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.main-content {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
}

.card h2 {
  font-size: 2rem;
  margin-bottom: 15px;
  color: #333;
}

.card p {
  font-size: 1.1rem;
  margin-bottom: 25px;
  color: #666;
}

.cta-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.1rem;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.footer {
  text-align: center;
  color: white;
  opacity: 0.8;
  margin-top: 40px;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }
  
  .card {
    margin: 0 20px;
    padding: 30px 20px;
  }
}`,
        js: `console.log('Generated app is ready!');

function handleClick() {
  alert('Welcome to your generated app! Start customizing it by chatting with the AI.');
}

// Add some interactivity
document.addEventListener('DOMContentLoaded', function() {
  console.log('App initialized for: ${state.prompt}');
  
  // Add smooth scroll behavior
  document.documentElement.style.scrollBehavior = 'smooth';
  
  // Add click animations
  const button = document.querySelector('.cta-button');
  if (button) {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.style.cssText = \`
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      \`;
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
      ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
      
      this.style.position = 'relative';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  }
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = \`
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
\`;
document.head.appendChild(style);`
      };
      dispatch({
        type: 'SET_CODE_FILES',
        payload: scaffoldCode
      });
      dispatch({
        type: 'SET_GENERATING',
        payload: false
      });

      // Calculate the time taken for generation
      const endTime = Date.now();
      const timeTaken = Math.round((endTime - startTime) / 1000);

      // Update the last message with the actual time
      dispatch({
        type: 'UPDATE_LAST_MESSAGE',
        payload: {
          content: `Thought for ${timeTaken}s\n\nPerfect! I've generated your app based on "${state.prompt}". You can see the live preview and explore the HTML, CSS, and JavaScript code. What would you like to modify or add next?`
        }
      });
    }, 2000);
  }, [state.prompt, isAuthenticated, navigate, dispatch]);
  return <div className="h-screen flex flex-col bg-background">
      {/* Mobile Layout (sm and below) */}
      <div className="sm:hidden flex flex-col h-full">
        <div className="flex-shrink-0 bg-background border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Landing-page-826: Back Arrow + Project Actions + Invite Button */}
            {projectState === 'landing-page-826' && (
              <>
                <button 
                  onClick={() => navigate('/')}
                  className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg hover:bg-muted transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>

                {/* Project Name and Actions Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-1 min-h-[44px] rounded-lg hover:bg-muted transition-colors">
                      <span className="text-sm font-medium text-foreground">{state.projectName}</span>
                      <ChevronDown className="w-4 h-4 text-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" side="bottom" className="w-64 z-50 bg-card border border-border shadow-lg">
                    <DropdownMenuItem onClick={() => navigate('/')}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Go to Dashboard
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem>
                      <span className="h-4 w-4 mr-2 flex items-center justify-center text-xs">✏️</span>
                      Rename Project
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Appearance
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem>
                      <Gift className="h-4 w-4 mr-2" />
                      Get Free Credits
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem>
                      <span className="h-4 w-4 mr-2">❓</span>
                      Help ↗
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex-1"></div>

                <div className="min-w-[44px] flex justify-end">
                  {mobileActiveTab !== 'preview' && <InviteButton />}
                </div>
              </>
            )}

            {/* Landing-page-990: Only Centered Project Name */}
            {projectState === 'landing-page-990' && (
              <div className="flex items-center gap-2 flex-1 justify-center">
                <h1 className="text-lg font-semibold text-foreground">landing-page-990</h1>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
            )}

            {/* Landing-page-19: Back Arrow + History Button + Centered Actions + Invite Button */}
            {projectState === 'landing-page-19' && (
              <>
                <button 
                  onClick={() => navigate('/')}
                  className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg hover:bg-muted transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>

                <button 
                  onClick={() => setIsHistoryOpen(true)}
                  className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg hover:bg-muted transition-colors"
                >
                  <History className="w-5 h-5 text-foreground" />
                </button>

                {/* Hide sidebar toggle - next to history button */}
                <button 
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg hover:bg-muted transition-colors"
                  title={isSidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
                >
                  {isSidebarCollapsed ? <PanelRightOpen className="w-5 h-5 text-foreground" /> : <PanelRightClose className="w-5 h-5 text-foreground" />}
                </button>

                <div className="flex items-center justify-center gap-4 flex-1">
                  <button className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg hover:bg-muted transition-colors">
                    <LayoutDashboard className="w-5 h-5 text-foreground" />
                  </button>
                  <button className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg hover:bg-muted transition-colors">
                    <Settings className="w-5 h-5 text-foreground" />
                  </button>
                </div>

                <div className="min-w-[44px] flex justify-end">
                  {mobileActiveTab !== 'preview' && <InviteButton />}
                </div>
              </>
            )}
          </div>
        </div>
        {/* Mobile Preview Mode - Full Screen */}
        {mobileActiveTab === 'preview' && <>
            {/* Device Controls Header */}
            
            
            {/* Full Preview Content - Hide code view entirely */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full flex flex-col bg-card">
                <div className="flex-1 relative">
                  <div className="w-full h-full bg-background flex justify-center">
                    <div className="bg-white border-x border-border transition-all duration-300" style={{
                  width: '100%',
                  maxWidth: '100%'
                }}>
                      {state.isGenerating ? <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-8"></div>
                          <h2 className="text-2xl font-semibold text-foreground mb-4 leading-relaxed">
                            Every great product starts with an idea.<br />
                            You're moments away from seeing yours come to life.
                          </h2>
                          <div className="text-muted-foreground space-y-1">
                            <p>Hang tight while we generate your full-stack app from your input.</p>
                            <p className="text-sm">(Powered by AI – no code, no delays, just creation.)</p>
                          </div>
                        </div> : <div className="relative w-full h-full">
                          <iframe className="w-full h-full border-0" title="Live Preview" src={`${window.location.origin}${state.previewRoute}`} sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation" style={{
                      overflow: 'auto',
                      WebkitOverflowScrolling: 'touch'
                    }} />
                        </div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Action Toolbar - Fixed Above Bottom */}
            <div className="flex-shrink-0 bg-background border-t border-border p-3">
              <div className="flex items-center justify-center gap-2 mb-3">
                {/* History Icon */}
                <button 
                  onClick={() => setIsHistoryOpen(true)}
                  className="flex items-center justify-center min-w-[44px] min-h-[44px] bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors" 
                  aria-label="Open code history"
                >
                  <History className="w-5 h-5 text-gray-600" />
                </button>

                {/* Chat Tab */}
                <button onClick={() => setMobileActiveTab('chat')} className="flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300" aria-label="Switch to Chat">
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </button>

                {/* Preview Tab - Active */}
                <button onClick={() => setMobileActiveTab('preview')} className="flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition-colors bg-gray-800 text-white" aria-label="Switch to Preview">
                  <Monitor className="w-4 h-4" />
                  Preview
                </button>

                {/* Globe Icon */}
                <button 
                  onClick={() => setIsPublishPanelOpen(true)}
                  className="flex items-center justify-center min-w-[44px] min-h-[44px] bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors" 
                  aria-label="Open publish panel"
                >
                  <Globe className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Bottom Input Bar with Route Controls */}
              
            </div>
          </>}

        {/* Mobile Chat Mode */}
        {mobileActiveTab === 'chat' && <div className="flex-1 overflow-hidden">
            <ChatPanel 
              mobileActiveTab={mobileActiveTab} 
              setMobileActiveTab={setMobileActiveTab} 
              onHistoryOpen={() => setIsHistoryOpen(true)}
            />
          </div>}
      </div>

      {/* Tablet Layout (md screens) */}
      <div className="hidden sm:flex lg:hidden h-full">
        <div className="w-1/2 border-r border-border">
          <ChatPanel onHistoryOpen={() => setIsHistoryOpen(true)} />
        </div>
        <div className="w-1/2">
          <CodePreview />
        </div>
      </div>

      {/* Desktop Layout (lg and above) */}
      <div className="hidden lg:flex h-full">
        {/* Left Sidebar - ChatPanel */}
        <div className={`${isSidebarCollapsed ? 'w-0 overflow-hidden' : 'w-[35%]'} transition-all duration-300 border-r border-border`}>
          {!isSidebarCollapsed && <ChatPanel onHistoryOpen={() => setIsHistoryOpen(true)} />}
        </div>
        
        {/* Main Content Area - CodePreview */}
        <div className={`${isSidebarCollapsed ? 'w-full' : 'w-[65%]'} flex-1 transition-all duration-300`}>
          <CodePreview />
        </div>
      </div>

      {/* Overlays */}
      <MobilePublishPanel 
        isOpen={isPublishPanelOpen} 
        onClose={() => setIsPublishPanelOpen(false)} 
      />
      <HistoryOverlay 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
      />
    </div>;
};
export default Workspace;