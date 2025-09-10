import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowUpIcon, PlusIcon, XMarkIcon, CloudArrowUpIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../context/AuthContext';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
const PromptInput = () => {
  const {
    state,
    dispatch
  } = useApp();
  const { isAuthenticated } = useAuth();
  const [localPrompt, setLocalPrompt] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploadMenuOpen, setIsUploadMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const promptTemplates = [
    ["Build a landing page", "Build a TikTok game", "Build a todo application"],
    ["Build a food delivery mobile application", "Build a CRM tool"]
  ];
  const validateFile = (file: File): string | null => {
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const isImage = validImageTypes.includes(file.type);
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      return 'Only JPG, PNG, WEBP images and video files are supported';
    }
    if (isVideo && file.size > 10 * 1024 * 1024) {
      return 'Video files must be under 10MB';
    }
    return null;
  };
  // Clear files after generation starts
  useEffect(() => {
    if (state.clearFilesAfterSubmit) {
      dispatch({ type: 'CLEAR_FILES_AFTER_SUBMIT', payload: undefined });
    }
  }, [state.clearFilesAfterSubmit, dispatch]);

  const handleSubmit = () => {
    if (!localPrompt.trim()) return;

    // Check if user is logged in
    if (!isAuthenticated) {
      // Preserve prompt and files before redirecting to login
      dispatch({
        type: 'PRESERVE_PROMPT',
        payload: {
          prompt: localPrompt,
          files: state.attachedFiles
        }
      });
      navigate('/auth/signin');
      return;
    }

    // User is logged in, proceed with normal flow
    dispatch({
      type: 'SET_PROMPT',
      payload: localPrompt
    });
    
    // Clear the local prompt and attached files
    setLocalPrompt('');
    dispatch({
      type: 'SET_FILES',
      payload: []
    });
    
    navigate('/workspace');
  };

  const handleStopGeneration = () => {
    // Stop the generation process
    dispatch({ type: 'SET_GENERATING', payload: false });
    dispatch({ type: 'SET_PREVIEW_LOADED', payload: false });
    
    // Add a cancelled message
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        role: 'assistant',
        content: 'This message was cancelled.'
      }
    });

    // Show feedback
    toast({
      title: "Generation stopped",
      description: "Code generation has been cancelled",
    });
  };
  const handleTemplateClick = (template: string) => {
    setLocalPrompt(template);
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };
  const handleFiles = (files: File[]) => {
    const currentFiles = state.attachedFiles;
    if (currentFiles.length + files.length > 10) {
      toast({
        title: "Upload limit exceeded",
        description: "You can only upload up to 10 files",
        variant: "destructive"
      });
      return;
    }
    const validFiles: File[] = [];
    const errors: string[] = [];
    files.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });
    if (errors.length > 0) {
      toast({
        title: "Upload errors",
        description: errors.join(', '),
        variant: "destructive"
      });
    }
    if (validFiles.length > 0) {
      dispatch({
        type: 'SET_FILES',
        payload: [...currentFiles, ...validFiles]
      });
    }
  };
  const removeFile = (index: number) => {
    const newFiles = state.attachedFiles.filter((_, i) => i !== index);
    dispatch({
      type: 'SET_FILES',
      payload: newFiles
    });
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
  return <div className="w-full max-w-5xl mx-auto space-y-6" data-prompt-input>
      {/* Clean minimal prompt input */}
      <div className={`relative transition-all duration-200 ${isDragOver ? 'scale-[1.02]' : ''}`} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
        <div className="w-full min-h-[120px] p-4 border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary transition-all relative bg-background">
          {/* Thumbnails inside input */}
          {state.attachedFiles.length > 0 && <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {state.attachedFiles.map((file, index) => <TooltipProvider key={index}>
                  <div className="relative group flex-shrink-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="w-16 h-16 bg-muted rounded-lg border border-border cursor-pointer hover:border-primary/50 transition-colors overflow-hidden">
                          {file.type.startsWith('image/') ? <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" /> : file.type.startsWith('video/') ? <video src={URL.createObjectURL(file)} className="w-full h-full object-cover" muted /> : <div className="w-full h-full flex items-center justify-center">
                              <CloudArrowUpIcon className="w-6 h-6 text-muted-foreground" />
                            </div>}
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                        <div className="relative">
                          {file.type.startsWith('image/') ? <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-auto max-h-[80vh] object-contain" /> : file.type.startsWith('video/') ? <video src={URL.createObjectURL(file)} controls className="w-full h-auto max-h-[80vh]" /> : null}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={() => removeFile(index)} className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90 text-xs" aria-label={`Remove ${file.type.startsWith('video/') ? 'video' : 'image'}`}>
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove {file.type.startsWith('video/') ? 'video' : 'image'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>)}
            </div>}
          
          <div className="relative pb-12">
            <textarea value={localPrompt} onChange={e => setLocalPrompt(e.target.value)} placeholder="Describe the app you want to build..." className="w-full min-h-[80px] bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground text-base leading-relaxed text-left" style={{
            textAlign: 'left',
            paddingLeft: '0',
            paddingRight: '0',
            paddingBottom: '2rem'
          }} onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              handleSubmit();
            }
          }} />
            
            {/* Upload button with dropdown menu - bottom left */}
            <Popover open={isUploadMenuOpen} onOpenChange={setIsUploadMenuOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="absolute bottom-2 left-0 w-8 h-8 p-0 rounded-full bg-background border border-border hover:bg-muted shadow-sm hover:shadow-md transition-all duration-200 z-10" disabled={state.attachedFiles.length >= 10} onClick={() => console.log('Plus button clicked')}>
                  <PlusIcon className="w-4 h-4 text-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2 z-[9999] border border-border rounded-lg shadow-xl" side="top" align="start" style={{
              backgroundColor: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))'
            }}>
                <div className="space-y-1">
                  <Button variant="ghost" size="sm" onClick={() => {
                  console.log('Attach Image clicked');
                  imageInputRef.current?.click();
                  setIsUploadMenuOpen(false);
                }} className="w-full justify-start text-left hover:bg-muted transition-colors">
                    <PhotoIcon className="w-4 h-4 mr-2" />
                    Attach Image
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => {
                  console.log('Attach Video clicked');
                  videoInputRef.current?.click();
                  setIsUploadMenuOpen(false);
                }} className="w-full justify-start text-left hover:bg-muted transition-colors">
                    <VideoCameraIcon className="w-4 h-4 mr-2" />
                    Attach Video
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Submit/Stop button inside input - bottom right */}
            {state.isGenerating ? (
              <Button 
                onClick={handleStopGeneration} 
                className="absolute bottom-2 right-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full w-8 h-8 p-0" 
                size="sm"
                title="Stop code generation"
              >
                <span className="text-xs">⏹️</span>
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!localPrompt.trim()} className="absolute bottom-2 right-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-8 h-8 p-0" size="sm">
                <ArrowUpIcon className="w-3 h-3" />
              </Button>
            )}
          </div>
          
          {/* Separate file inputs for images and videos */}
          <input ref={imageInputRef} type="file" multiple accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
          <input ref={videoInputRef} type="file" multiple accept="video/*" onChange={handleVideoChange} className="hidden" />
          <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/jpg,image/png,image/webp,video/*" onChange={handleFileChange} className="hidden" />
        </div>
        
        {isDragOver && <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-xl border-2 border-dashed border-primary">
            <div className="text-center">
              <CloudArrowUpIcon className="w-12 h-12 mx-auto text-primary mb-2" />
              <p className="text-primary font-medium">Drop files here to upload</p>
            </div>
          </div>}
      </div>

      {/* Template Prompts */}
      <div className="space-y-4">
        <p className="text-center text-muted-foreground">Or try one of these templates:</p>
        <div className="space-y-3">
          {promptTemplates.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-wrap justify-center gap-3">
              {row.map((template, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  onClick={() => handleTemplateClick(template)} 
                  className="rounded-full px-6 py-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105"
                >
                  {template}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>;
};
export default PromptInput;