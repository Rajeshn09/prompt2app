import React, { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { X } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface FileTab {
  name: string;
  path: string;
  content: string;
  language: string;
}

interface CodeEditorProps {
  initialFiles?: FileTab[];
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialFiles = [] }) => {
  const [openTabs, setOpenTabs] = useState<FileTab[]>(initialFiles);
  const [activeTab, setActiveTab] = useState<string | null>(initialFiles[0]?.path || null);

  const getLanguageFromFileName = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'tsx':
      case 'ts':
        return 'typescript';
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'json':
        return 'json';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'md':
        return 'markdown';
      default:
        return 'typescript';
    }
  };

  const openFile = (file: { name: string; path: string; content?: string }) => {
    // Check if file is already open
    const existingTab = openTabs.find(tab => tab.path === file.path);
    if (existingTab) {
      setActiveTab(file.path);
      return;
    }

    // Create new tab
    const newTab: FileTab = {
      name: file.name,
      path: file.path,
      content: file.content || '// File content loading...',
      language: getLanguageFromFileName(file.name)
    };

    setOpenTabs(prev => [...prev, newTab]);
    setActiveTab(file.path);
  };

  const closeTab = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(tab => tab.path !== path);
    setOpenTabs(newTabs);
    
    if (activeTab === path) {
      // Set active tab to the last tab, or null if no tabs remain
      setActiveTab(newTabs.length > 0 ? newTabs[newTabs.length - 1].path : null);
    }
  };

  const activeTabData = openTabs.find(tab => tab.path === activeTab);

  // Expose openFile method to parent component
  useEffect(() => {
    // This is a way to expose the openFile method to parent components
    (window as any).openFileInEditor = openFile;
    return () => {
      delete (window as any).openFileInEditor;
    };
  }, [openTabs]);

  return (
    <div className="h-full flex flex-col bg-[#F8F9FA]">
      {/* Tabs Bar */}
      <div className="flex-shrink-0 bg-background border-b border-border">
        <ScrollArea className="w-full">
          <div className="flex min-w-max">
            {openTabs.map(tab => (
              <div
                key={tab.path}
                className={`
                  flex items-center px-3 py-2 border-r border-border cursor-pointer text-sm
                  min-w-[120px] max-w-[200px] group relative
                  ${activeTab === tab.path 
                    ? 'bg-[#F8F9FA] text-foreground border-b-2 border-primary' 
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }
                `}
                onClick={() => setActiveTab(tab.path)}
              >
                <span className="truncate flex-1 font-roboto-mono text-xs">
                  {tab.name}
                </span>
                <button
                  className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-muted rounded p-0.5 transition-opacity"
                  onClick={(e) => closeTab(tab.path, e)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative">
        {activeTabData ? (
          <MonacoEditor
            height="100%"
            language={activeTabData.language}
            value={activeTabData.content}
            theme="vs"
            options={{
              fontFamily: "'Roboto Mono', 'Fira Code', 'Consolas', monospace",
              fontSize: 13,
              lineHeight: 1.5,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              lineNumbers: 'on',
              glyphMargin: false,
              folding: true,
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 3,
              padding: { top: 16, bottom: 16 },
              renderWhitespace: 'selection',
              automaticLayout: true,
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                indentation: true
              }
            }}
            onChange={(value) => {
              if (activeTabData && value !== undefined) {
                setOpenTabs(prev => 
                  prev.map(tab => 
                    tab.path === activeTabData.path 
                      ? { ...tab, content: value }
                      : tab
                  )
                );
              }
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="text-2xl font-roboto-mono mb-2">{ '</>' }</div>
              <p className="text-sm">No file selected</p>
              <p className="text-xs mt-1">Click on a file in the explorer to open it</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;