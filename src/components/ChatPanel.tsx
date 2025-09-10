import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { ArrowUpIcon, PlusIcon, PhotoIcon, VideoCameraIcon, LightBulbIcon, XMarkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { ThumbsUp, ThumbsDown, Copy, Settings, Link2, ExternalLink, RotateCcw, CreditCard, Lightbulb, Edit, Bookmark, Code, ChevronDown, History, PanelRightClose, PanelRightOpen, Gift, Home, HelpCircle, Palette, User, LogOut, MessageSquare, Monitor, ArrowUpRight } from 'lucide-react';
import PathPreviewDropdown from './PathPreviewDropdown';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useToast } from '../hooks/use-toast';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import Logo from './Logo';
import ProjectSettingsModal from './ProjectSettingsModal';

// Metadata Row Component - Shows on hover over Prompt2App logo
const MetadataRow = () => {
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Message link copied to clipboard",
    });
  };

  const handlePreview = () => {
    toast({
      title: "Preview",
      description: "Opening preview...",
    });
  };

  const handleRestore = () => {
    toast({
      title: "Restore",
      description: "System state restored",
    });
  };

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
      <div className="flex items-center gap-4">
        <span>💡 Worked for 49s</span>
        <span>🕒 11:56 PM on Jul 28</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="p-1 hover:bg-muted rounded transition-colors"
            aria-label="Message settings"
          >
            <Settings size={16} className="text-muted-foreground hover:text-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-48 bg-background border shadow-lg z-50"
          sideOffset={5}
        >
          <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
            <span className="mr-2">🔗</span>
            Copy message link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePreview} className="cursor-pointer">
            <span className="mr-2">↗️</span>
            Preview
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRestore} className="cursor-pointer">
            <span className="mr-2">♻️</span>
            Restore
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="cursor-default opacity-75">
            <span className="mr-2">💳</span>
            Credits used: 1.50
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Summary Card Component - Shows after code changes
const SummaryCard = ({ title, hasCodeChanges }: { title: string; hasCodeChanges: boolean }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Bookmark removed" : "Bookmark saved",
      description: isBookmarked ? "Message bookmark removed" : "Message bookmarked successfully",
    });
  };

  const handleRestore = () => {
    toast({
      title: "✅ Code restored to previous version.",
    });
  };

  const handleViewCode = () => {
    toast({
      title: "Opening code view",
      description: "Viewing updated code...",
    });
  };

  if (!hasCodeChanges) return null;

  return (
    <div className="inline-block p-3 bg-gray-50 border border-gray-200 rounded-lg">{/* Changed from w-full to inline-block */}
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 mb-0.5">{title}</h3>
          <p className="text-xs text-gray-500">Preview Latest</p>
        </div>
        <button
          onClick={handleBookmark}
          className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
          aria-label="Bookmark message"
        >
          <Bookmark 
            size={16} 
            className={isBookmarked ? 'text-black fill-current' : 'text-gray-400 hover:text-gray-600'} 
          />
        </button>
      </div>

      {/* Bottom Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleRestore}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
        >
          <RotateCcw size={12} />
          Restore
        </button>
        <button
          onClick={handleViewCode}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
        >
          <Code size={12} />
          Code
        </button>
      </div>
    </div>
  );
};

// Message Actions Component - Visible by default for system messages
const MessageActions = () => {
  const [likedState, setLikedState] = useState<'like' | 'dislike' | null>(null);
  const [isDislikeModalOpen, setIsDislikeModalOpen] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const { toast } = useToast();

  const reasons = [
    "Design is off",
    "Unrelated changes made", 
    "Functionality is broken",
    "Other"
  ];

  const handleLike = () => {
    setLikedState('like');
    toast({
      title: "Thanks for the feedback",
      description: "Your feedback helps us improve",
    });
  };

  const handleDislike = () => {
    setIsDislikeModalOpen(true);
  };

  const handleDislikeSubmit = () => {
    setLikedState('dislike');
    setIsDislikeModalOpen(false);
    
    // Reset form
    setSelectedReasons([]);
    setAdditionalFeedback('');
    
    toast({
      title: "Thanks for your feedback!",
    });
  };

  const handleDislikeCancel = () => {
    setIsDislikeModalOpen(false);
    // Reset form but don't set dislike state
    setSelectedReasons([]);
    setAdditionalFeedback('');
  };

  const toggleReason = (reason: string) => {
    setSelectedReasons(prev => 
      prev.includes(reason) 
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const handleCopy = () => {
    toast({
      title: "Copied to clipboard",
      description: "Message copied successfully",
    });
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <button 
          onClick={handleLike}
          className="p-1 hover:bg-muted rounded transition-colors"
          aria-label="Like message"
        >
          <ThumbsUp 
            size={16} 
            className={likedState === 'like' ? 'text-green-600' : 'text-muted-foreground hover:text-foreground'} 
          />
        </button>
        <button 
          onClick={handleDislike}
          className="p-1 hover:bg-muted rounded transition-colors"
          aria-label="Dislike message"
        >
          <ThumbsDown 
            size={16} 
            className={likedState === 'dislike' ? 'text-black' : 'text-muted-foreground hover:text-foreground'} 
          />
        </button>
        <button 
          onClick={handleCopy}
          className="p-1 hover:bg-muted rounded transition-colors"
          aria-label="Copy message"
        >
          <Copy size={16} className="text-muted-foreground hover:text-foreground" />
        </button>
      </div>

      {/* Dislike Feedback Modal */}
      <Dialog open={isDislikeModalOpen} onOpenChange={setIsDislikeModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Help us improve</h2>
              <p className="text-sm text-gray-600 mt-1">Please tell us why this response wasn't helpful to you</p>
            </div>
            
            {/* Reason Pills */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {reasons.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => toggleReason(reason)}
                    className={`px-3 py-2 rounded-full text-sm border transition-colors ${
                      selectedReasons.includes(reason)
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Feedback */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Feedback</label>
              <textarea
                placeholder="This was not helpful because ..."
                value={additionalFeedback}
                onChange={(e) => setAdditionalFeedback(e.target.value)}
                className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleDislikeCancel}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDislikeSubmit}
                className="px-6 bg-black text-white hover:bg-gray-800"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface ChatPanelProps {
  mobileActiveTab?: 'chat' | 'preview';
  setMobileActiveTab?: (tab: 'chat' | 'preview') => void;
  onHistoryOpen?: () => void;
}

const ChatPanel = ({ mobileActiveTab, setMobileActiveTab, onHistoryOpen }: ChatPanelProps) => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isUploadMenuOpen, setIsUploadMenuOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Remove the right panel state - we only have one sidebar now
  const [isRenaming, setIsRenaming] = useState(false);
  const [projectName, setProjectName] = useState(state.projectName);
  
  // Sync local project name with global state
  React.useEffect(() => {
    setProjectName(state.projectName);
  }, [state.projectName]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Mock data - replace with real data from context/API
  const creditsUsed = 183.6;
  const creditsTotal = 300;
  const creditsRemaining = creditsTotal - creditsUsed;
  const creditProgress = (creditsUsed / creditsTotal) * 100;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    dispatch({
      type: 'ADD_MESSAGE',
      payload: { 
        role: 'user', 
        content: message,
        attachedFiles: state.attachedFiles.length > 0 ? [...state.attachedFiles] : undefined
      }
    });

    setMessage('');
    
    // Clear attached files after sending
    if (state.attachedFiles.length > 0) {
      dispatch({
        type: 'SET_FILES',
        payload: []
      });
    }

    // TODO: Implement actual AI response
    setTimeout(() => {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: 'I understand! Let me work on that for you...'
        }
      });
    }, 1000);
  };

  const validateFile = (file: File): string | null => {
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/mov', 'video/webm', 'video/avi', 'video/x-msvideo', 'video/x-matroska', 'video/x-flv'];
    const isImage = validImageTypes.includes(file.type);
    const isVideo = validVideoTypes.includes(file.type);
    
    if (isImage) {
      if (file.size > 10 * 1024 * 1024) {
        return 'Image must be under 10 MB';
      }
    } else if (isVideo) {
      if (file.size > 10 * 1024 * 1024) {
        return 'Video must be under 10 MB in supported format';
      }
    } else {
      return 'Only JPG, PNG, WEBP images and MP4, MOV, AVI, MKV, WEBM, FLV videos are supported';
    }
    
    return null;
  };

  const handleFiles = (files: File[], fileType?: 'image' | 'video') => {
    setUploadError('');
    const currentFiles = state.attachedFiles || [];
    const currentImages = currentFiles.filter(f => f.type.startsWith('image/')).length;
    const incomingImages = files.filter(f => f.type.startsWith('image/')).length;
    
    // Check image limit (max 10 images)
    if (fileType === 'image' && currentImages + incomingImages > 10) {
      setUploadError('Please upload up to 10 images (JPG/PNG/WEBP), each under 10 MB.');
      return;
    }
    
    // Check total file limit
    if (currentFiles.length + files.length > 10) {
      setUploadError('You can only upload up to 10 files total.');
      return;
    }
    
    const validFiles: File[] = [];
    const errors: string[] = [];
    
    files.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });
    
    if (errors.length > 0) {
      if (fileType === 'image') {
        setUploadError('Please upload up to 10 images (JPG/PNG/WEBP), each under 10 MB.');
      } else if (fileType === 'video') {
        setUploadError('Please upload a video under 10 MB in supported format (MP4, MOV, AVI, MKV, WEBM, FLV).');
      } else {
        setUploadError(errors[0]);
      }
      return;
    }
    
    if (validFiles.length > 0) {
      dispatch({
        type: 'SET_FILES',
        payload: [...currentFiles, ...validFiles]
      });
      
      // Show success feedback
      const fileTypeText = validFiles[0].type.startsWith('image/') ? 'image' : 'video';
      const count = validFiles.length;
      toast({
        title: "Upload successful",
        description: `${count} ${fileTypeText}${count > 1 ? 's' : ''} uploaded successfully`,
      });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = (state.attachedFiles || []).filter((_, i) => i !== index);
    dispatch({
      type: 'SET_FILES',
      payload: newFiles
    });
    // Clear upload error when files are removed
    setUploadError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files, 'image');
    e.target.value = ''; // Reset input
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files, 'video');
    e.target.value = ''; // Reset input
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [state.attachedFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header with Project Navigation */}
      <TooltipProvider>
        <div className="flex-shrink-0 p-2 sm:p-3 border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            {/* Left Panel - Project Tools - Hidden on mobile */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
              {/* Project Name Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center justify-start gap-2 text-sm font-medium px-2">
                    {isRenaming ? (
                      <input
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        onBlur={() => setIsRenaming(false)}
                        onKeyDown={(e) => e.key === 'Enter' && setIsRenaming(false)}
                        className="bg-transparent border-none outline-none w-32"
                        autoFocus
                      />
                    ) : (
                      <>
                        <Logo size="sm" showText={false} />
                        <span>{projectName}</span>
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="bottom" alignOffset={0} className="w-64 z-50 bg-card border border-border shadow-lg">
                  <DropdownMenuItem onClick={() => navigate('/')}>
                    <Home className="h-4 w-4 mr-2" />
                    Go to Dashboard
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <div className="px-2 py-2">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Workspace</DropdownMenuLabel>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{creditsRemaining.toFixed(1)} left</span>
                        <span className="text-muted-foreground">Using monthly credits</span>
                      </div>
                      <Progress value={creditProgress} className="h-2" />
                    </div>
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem>
                    <Gift className="h-4 w-4 mr-2" />
                    Get Free Credits
                  </DropdownMenuItem>
                  
                   <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                     <Settings className="h-4 w-4 mr-2" />
                     Settings
                   </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => setIsRenaming(true)}>
                    <span className="h-4 w-4 mr-2 flex items-center justify-center text-xs">✏️</span>
                    Rename Project
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem>
                    <Palette className="h-4 w-4 mr-2" />
                    Appearance
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem>
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help ↗
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Right Panel - History and Side Panel Toggle */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* History Icon - Hidden on mobile */}
              <div className="hidden sm:block">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={onHistoryOpen}
                    >
                      <History className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View project history</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Removed the side panel toggle - we only have one sidebar now managed by Workspace.tsx */}
            </div>
          </div>
        </div>
      </TooltipProvider>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 py-3 sm:py-6">
          {state.messages.map((msg) => (
            <div key={msg.id} className="mb-8 animate-fade-in">
              {msg.role === 'assistant' ? (
                // System/Bot Messages - Full width with branding, white canvas
                <div className="w-full">
                  {/* System Branding with hover metadata on same line */}
                  <div className="group/message">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">L</span>
                        </div>
                         <span className="font-medium text-purple-600">Prompt2App</span>
                        
                        {/* Timing info appears on hover after logo */}
                        <div className="opacity-0 group-hover/message:opacity-100 transition-opacity duration-200 ml-3 text-xs text-muted-foreground">
                          <span>Worked for 49s</span>
                        </div>
                      </div>
                      
                      {/* Time and Settings on same line, right side, visible on hover */}
                      <div className="opacity-0 group-hover/message:opacity-100 transition-opacity duration-200 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>11:56 PM on Jul 28</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                              <Settings className="w-3 h-3 text-gray-500" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg z-50">
                            <DropdownMenuItem className="cursor-pointer">
                              <Link2 className="w-4 h-4 text-gray-500 mr-2" />
                              Copy message link
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <ExternalLink className="w-4 h-4 text-gray-500 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <RotateCcw className="w-4 h-4 text-gray-500 mr-2" />
                              Restore
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled className="cursor-default opacity-75">
                              <CreditCard className="w-4 h-4 text-gray-500 mr-2" />
                              Credits used: 1.50
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                  
                  {/* Thought timing - clean, minimal */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-muted-foreground font-normal">
                        {(state.isGenerating || !state.previewLoaded) ? 'Thinking...' : 
                         msg.content.includes('Thought for') ? 
                         msg.content.split('\n')[0] : 'Thinking...'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Message Content - Only show detailed content when preview is loaded */}
                  {state.previewLoaded ? (
                    <>
                      {/* Message Content - Solid black text, no background */}
                      <div className="mb-4">
                        <div className="prose prose-sm max-w-none">
                          <p className="leading-relaxed text-black font-normal text-[15px] whitespace-pre-line">{msg.content}</p>
                        </div>
                      </div>
                      
                      {/* Summary text - main content in black, file actions in gray */}
                      <div className="mb-4 leading-relaxed">
                        <div className="text-black font-normal text-[15px] mb-3">I'll update the chat interface with the clean, minimal enhancements you requested while preserving all existing functionality.</div>
                        <div className="text-sm text-muted-foreground my-3 py-1 flex items-center gap-2">
                          <span>📖 Read</span>
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">src/components/ui/dropdown-menu.tsx</span>
                        </div>
                        <div className="text-black font-normal text-[15px] mb-3">The dropdown component already has proper background and z-index styling. Let me enhance the MetadataRow component to ensure proper styling and add the missing emojis for the dropdown items as specified:</div>
                        <div className="text-sm text-muted-foreground my-3 py-1 flex items-center gap-2">
                          <Edit className="w-4 h-4 text-gray-500" />
                          <span>Edited</span>
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">src/components/ChatPanel.tsx</span>
                        </div>
                        <div className="text-black font-normal text-[15px] mt-3">Updated the chat interface with clean ChatGPT-style formatting: removed system message backgrounds, added thought timing below Prompt2App label, included step-by-step chain of thought, and positioned action icons bottom-right with hover reveal.</div>
                      </div>
                      
                      {/* Summary Card - Shows after code changes */}
                      <SummaryCard 
                        title="Add code change summary card" 
                        hasCodeChanges={true}
                      />
                      
                      {/* Message Actions - Bottom right, for all messages */}
                      <MessageActions />
                    </>
                  ) : null}
                </div>
              ) : (
                // User Messages - Right aligned with light gray background
                <div className="flex justify-end mb-4 group">
                  <div className="max-w-2xl relative space-y-2">
                    {/* Display attached files if they exist */}
                    {msg.attachedFiles && msg.attachedFiles.length > 0 && (
                      <div className="flex gap-2 flex-wrap justify-end">
                        {msg.attachedFiles.map((file, index) => (
                          <Dialog key={index}>
                            <DialogTrigger asChild>
                              <div className="w-20 h-20 bg-background rounded-lg border border-border cursor-pointer hover:border-primary/50 transition-colors overflow-hidden shadow-sm">
                                {file.type.startsWith('image/') ? (
                                  <img 
                                    src={URL.createObjectURL(file)} 
                                    alt={file.name} 
                                    className="w-full h-full object-cover" 
                                  />
                                ) : file.type.startsWith('video/') ? (
                                  <video 
                                    src={URL.createObjectURL(file)} 
                                    className="w-full h-full object-cover" 
                                    muted 
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <CloudArrowUpIcon className="w-6 h-6 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                              <div className="relative">
                                {file.type.startsWith('image/') ? (
                                  <img 
                                    src={URL.createObjectURL(file)} 
                                    alt={file.name} 
                                    className="w-full h-auto max-h-[80vh] object-contain" 
                                  />
                                ) : file.type.startsWith('video/') ? (
                                  <video 
                                    src={URL.createObjectURL(file)} 
                                    controls 
                                    className="w-full h-auto max-h-[80vh]" 
                                  />
                                ) : null}
                              </div>
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>
                    )}
                    
                    {/* Text content on separate line */}
                    <div className="bg-muted/60 rounded-2xl px-4 py-3">
                      <p className="text-black font-normal text-[15px] leading-relaxed">{msg.content}</p>
                    </div>
                    
                    <div className="text-right mt-1 opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Thinking State */}
          {false && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">L</span>
                </div>
                <span className="font-medium text-purple-600">Prompt2App</span>
                <span className="text-xs text-gray-400">🔍 Thinking...</span>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">Analyzing your request...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Composer */}
      <div className="flex-shrink-0 p-2 bg-card/50 backdrop-blur-sm">
        <TooltipProvider>
          <div className="max-w-full mx-auto">
            <div 
              className={`relative transition-all duration-200 ${isDragOver ? 'scale-[1.02]' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div 
                className="w-full relative bg-white border border-gray-200 shadow-sm flex flex-col"
                style={{ 
                  borderRadius: '16px',
                  minHeight: '160px',
                  maxHeight: '400px' // Allow expansion but with reasonable limit
                }}
              >
                {/* File Thumbnails Strip */}
                {(state.attachedFiles || []).length > 0 && (
                  <div className="flex-shrink-0 p-4 border-b border-gray-100">
                    <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
                      {(state.attachedFiles || []).map((file, index) => {
                        const isImage = file.type.startsWith('image/');
                        const fileType = isImage ? 'image' : 'video';
                        const fileNumber = index + 1;
                        
                        return (
                          <div key={index} className="relative group flex-shrink-0">
                            <Dialog>
                              <DialogTrigger asChild>
                                <button
                                  className="w-20 h-20 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  aria-label={`View ${fileType} ${fileNumber}: ${file.name}`}
                                  tabIndex={0}
                                >
                                  {isImage ? (
                                    <img 
                                      src={URL.createObjectURL(file)} 
                                      alt={`${fileType} ${fileNumber}`} 
                                      className="w-full h-full object-cover" 
                                    />
                                  ) : (
                                    <video 
                                      src={URL.createObjectURL(file)} 
                                      className="w-full h-full object-cover" 
                                      muted 
                                      aria-label={`Video thumbnail ${fileNumber}`}
                                    />
                                  )}
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                                <div className="relative">
                                  {isImage ? (
                                    <img 
                                      src={URL.createObjectURL(file)} 
                                      alt={file.name} 
                                      className="w-full h-auto max-h-[80vh] object-contain" 
                                    />
                                  ) : (
                                    <video 
                                      src={URL.createObjectURL(file)} 
                                      controls 
                                      className="w-full h-auto max-h-[80vh]"
                                      aria-label={`Video: ${file.name}`}
                                    />
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button 
                                  onClick={() => removeFile(index)} 
                                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300" 
                                  aria-label={`Remove ${fileType} ${fileNumber}`}
                                  tabIndex={0}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      removeFile(index);
                                    }
                                  }}
                                >
                                  <XMarkIcon className="w-3 h-3" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remove {fileType}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Inline Error Message */}
                {uploadError && (
                  <div className="flex-shrink-0 px-4 py-2 bg-red-50 border-b border-red-200">
                    <p className="text-sm text-red-600">{uploadError}</p>
                  </div>
                )}

                  {/* Text Input Area - Flexible height */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 p-3 sm:p-4 pb-2 overflow-y-auto">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask me anything about your app..."
                        className="w-full h-full min-h-[80px] bg-transparent border-none outline-none resize-none placeholder-gray-400 text-gray-700 text-base sm:text-base leading-relaxed"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>

                  {/* Fixed Bottom Action Bar */}
                  <div className="flex-shrink-0 p-3 sm:p-4 pt-2 bg-white rounded-b-2xl">
                    <div className="flex items-center justify-between gap-3">
                      {/* Upload Button */}
                      <Popover open={isUploadMenuOpen} onOpenChange={setIsUploadMenuOpen}>
                        <PopoverTrigger asChild>
                          <button 
                            className="flex items-center justify-center min-w-[44px] min-h-[44px] sm:w-8 sm:h-8 sm:min-w-8 sm:min-h-8 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors relative z-10"
                            aria-label="Attach file"
                            disabled={(state.attachedFiles || []).length >= 10}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setIsUploadMenuOpen(!isUploadMenuOpen);
                            }}
                            type="button"
                          >
                            <PlusIcon className="w-4 h-4 text-gray-600" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent 
                          className="w-48 p-1 border border-gray-200 rounded-lg shadow-lg bg-white z-[9999]" 
                          side="top" 
                          align="center"
                          sideOffset={8}
                          onOpenAutoFocus={(e) => e.preventDefault()}
                        >
                          <div className="space-y-0">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                imageInputRef.current?.click();
                                setIsUploadMenuOpen(false);
                              }} 
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2"
                              aria-label="Attach image files"
                              type="button"
                            >
                              <PhotoIcon className="w-4 h-4 text-gray-500" />
                              Attach Image
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                videoInputRef.current?.click();
                                setIsUploadMenuOpen(false);
                              }} 
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2"
                              aria-label="Attach video files"
                              type="button"
                            >
                              <VideoCameraIcon className="w-4 h-4 text-gray-500" />
                              Attach Video
                            </button>
                          </div>
                        </PopoverContent>
                      </Popover>

                      {/* Mobile Tab Buttons - Only show in chat mode (hidden in preview mode) */}
                      {mobileActiveTab && setMobileActiveTab && mobileActiveTab === 'chat' && (
                        <div className="sm:hidden flex items-center gap-2">
                          <button
                            onClick={() => setMobileActiveTab('chat')}
                            className="flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition-colors bg-gray-800 text-white"
                            aria-label="Switch to Chat"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Chat
                          </button>
                          <button
                            onClick={() => setMobileActiveTab('preview')}
                            className="flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300"
                            aria-label="Switch to Preview"
                          >
                            <Monitor className="w-4 h-4" />
                            Preview
                          </button>
                        </div>
                      )}

                      {/* Submit Button */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={handleSendMessage}
                            disabled={!message.trim()}
                            className={`flex items-center justify-center min-w-[44px] min-h-[44px] sm:w-8 sm:h-8 sm:min-w-8 sm:min-h-8 rounded-full transition-colors ${
                              message.trim() 
                                ? 'bg-gray-700 hover:bg-gray-800 text-white' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            aria-label="Submit prompt"
                          >
                            <ArrowUpIcon className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Submit prompt</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                {/* Hidden file inputs */}
                <input 
                  ref={imageInputRef} 
                  type="file" 
                  multiple 
                  accept="image/jpeg,image/jpg,image/png,image/webp" 
                  onChange={handleImageChange}
                  className="hidden" 
                />
                <input 
                  ref={videoInputRef} 
                  type="file" 
                  multiple 
                  accept="video/mp4,video/mov,video/webm,video/avi,video/x-msvideo,video/x-matroska,video/x-flv" 
                  onChange={handleVideoChange}
                  className="hidden" 
                />
              </div>

              {/* Drag and Drop Overlay */}
              {isDragOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-50 border-2 border-dashed border-blue-300 rounded-2xl">
                  <div className="text-center">
                    <CloudArrowUpIcon className="w-12 h-12 mx-auto text-blue-500 mb-2" />
                    <p className="text-blue-600 font-medium">Drop files here to upload</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TooltipProvider>
      </div>

      {/* Project Settings Modal */}
      <ProjectSettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
};

export default ChatPanel;