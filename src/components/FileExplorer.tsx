import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Search, File, Folder } from 'lucide-react';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  content?: string;
}

interface FileExplorerProps {
  onFileSelect: (file: FileNode) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'src/components', 'src/pages']));

  // Mock file structure based on the current project
  const fileStructure: FileNode[] = [
    {
      name: 'src',
      type: 'folder',
      path: 'src',
      children: [
        {
          name: 'components',
          type: 'folder',
          path: 'src/components',
          children: [
            { name: 'ChatPanel.tsx', type: 'file', path: 'src/components/ChatPanel.tsx', content: '// ChatPanel component' },
            { name: 'CodePreview.tsx', type: 'file', path: 'src/components/CodePreview.tsx', content: '// CodePreview component' },
            { name: 'FileExplorer.tsx', type: 'file', path: 'src/components/FileExplorer.tsx', content: '// FileExplorer component' },
            { name: 'Footer.tsx', type: 'file', path: 'src/components/Footer.tsx', content: '// Footer component' },
            { name: 'GlobalNav.tsx', type: 'file', path: 'src/components/GlobalNav.tsx', content: '// GlobalNav component' },
            { name: 'Logo.tsx', type: 'file', path: 'src/components/Logo.tsx', content: '// Logo component' },
            { name: 'PromptInput.tsx', type: 'file', path: 'src/components/PromptInput.tsx', content: '// PromptInput component' },
            {
              name: 'ui',
              type: 'folder',
              path: 'src/components/ui',
              children: [
                { name: 'button.tsx', type: 'file', path: 'src/components/ui/button.tsx', content: '// Button component' },
                { name: 'input.tsx', type: 'file', path: 'src/components/ui/input.tsx', content: '// Input component' },
                { name: 'card.tsx', type: 'file', path: 'src/components/ui/card.tsx', content: '// Card component' },
                { name: 'dialog.tsx', type: 'file', path: 'src/components/ui/dialog.tsx', content: '// Dialog component' },
                { name: 'scroll-area.tsx', type: 'file', path: 'src/components/ui/scroll-area.tsx', content: '// ScrollArea component' }
              ]
            }
          ]
        },
        {
          name: 'pages',
          type: 'folder',
          path: 'src/pages',
          children: [
            { name: 'Index.tsx', type: 'file', path: 'src/pages/Index.tsx', content: '// Index page' },
            { name: 'NotFound.tsx', type: 'file', path: 'src/pages/NotFound.tsx', content: '// NotFound page' },
            { name: 'Pricing.tsx', type: 'file', path: 'src/pages/Pricing.tsx', content: '// Pricing page' },
            { name: 'Workspace.tsx', type: 'file', path: 'src/pages/Workspace.tsx', content: '// Workspace page' }
          ]
        },
        {
          name: 'context',
          type: 'folder',
          path: 'src/context',
          children: [
            { name: 'AppContext.tsx', type: 'file', path: 'src/context/AppContext.tsx', content: '// App context' }
          ]
        },
        { name: 'App.tsx', type: 'file', path: 'src/App.tsx', content: '// Main App component' },
        { name: 'main.tsx', type: 'file', path: 'src/main.tsx', content: '// App entry point' },
        { name: 'index.css', type: 'file', path: 'src/index.css', content: '/* Global styles */' }
      ]
    },
    { name: 'index.html', type: 'file', path: 'index.html', content: '<!DOCTYPE html>...' },
    { name: 'package.json', type: 'file', path: 'package.json', content: '{\n  "name": "vite_react_shadcn_ts"...' },
    { name: 'tailwind.config.ts', type: 'file', path: 'tailwind.config.ts', content: '// Tailwind configuration' },
    { name: 'vite.config.ts', type: 'file', path: 'vite.config.ts', content: '// Vite configuration' },
    { name: 'tsconfig.json', type: 'file', path: 'tsconfig.json', content: '// TypeScript configuration' },
    { name: 'README.md', type: 'file', path: 'README.md', content: '# Project README' }
  ];

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const filterFiles = (nodes: FileNode[], term: string): FileNode[] => {
    if (!term) return nodes;
    
    return nodes.reduce<FileNode[]>((acc, node) => {
      if (node.type === 'file' && node.name.toLowerCase().includes(term.toLowerCase())) {
        acc.push(node);
      } else if (node.type === 'folder' && node.children) {
        const filteredChildren = filterFiles(node.children, term);
        if (filteredChildren.length > 0 || node.name.toLowerCase().includes(term.toLowerCase())) {
          acc.push({
            ...node,
            children: filteredChildren
          });
        }
      }
      return acc;
    }, []);
  };

  const renderFileNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const paddingLeft = depth * 12 + 8;

    if (node.type === 'folder') {
      return (
        <div key={node.path}>
          <div
            className="flex items-center py-1 px-2 hover:bg-muted/50 cursor-pointer text-sm"
            style={{ paddingLeft: `${paddingLeft}px` }}
            onClick={() => toggleFolder(node.path)}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 mr-1 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3 w-3 mr-1 text-muted-foreground" />
            )}
            <Folder className="h-3 w-3 mr-2 text-blue-500" />
            <span className="text-foreground">{node.name}</span>
          </div>
          {isExpanded && node.children && (
            <div>
              {node.children.map(child => renderFileNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={node.path}
        className="flex items-center py-1 px-2 hover:bg-muted/50 cursor-pointer text-sm"
        style={{ paddingLeft: `${paddingLeft + 16}px` }}
        onClick={() => onFileSelect(node)}
      >
        <File className="h-3 w-3 mr-2 text-muted-foreground" />
        <span className="text-foreground">{node.name}</span>
      </div>
    );
  };

  const filteredFiles = filterFiles(fileStructure, searchTerm);

  return (
    <div className="h-full flex flex-col bg-background border-r border-border">
      {/* Search Bar */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-7 h-7 text-xs bg-muted/30"
          />
        </div>
      </div>

      {/* File Tree */}
      <ScrollArea className="flex-1">
        <div className="py-2">
          {filteredFiles.map(node => renderFileNode(node))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FileExplorer;