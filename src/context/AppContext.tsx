import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface AppState {
  prompt: string;
  attachedFiles: File[];
  projectName: string;
  messages: Message[];
  codeFiles: CodeFiles;
  activeTab: string;
  isLoggedIn: boolean;
  clearFilesAfterSubmit: boolean;
  preservedPrompt: string;
  preservedFiles: File[];
  previewRoute: string;
  deviceView: 'mobile' | 'tablet' | 'desktop';
  isGenerating: boolean;
  generationStartTime: number | null;
  previewError: boolean;
  previewLoaded: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachedFiles?: File[];
}

interface CodeFiles {
  html: string;
  css: string;
  js: string;
}

type AppAction =
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'SET_FILES'; payload: File[] }
  | { type: 'SET_PROJECT_NAME'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: Omit<Message, 'id' | 'timestamp'> }
  | { type: 'UPDATE_LAST_MESSAGE'; payload: { content: string } }
  | { type: 'SET_CODE_FILES'; payload: CodeFiles }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'SET_LOGIN_STATUS'; payload: boolean }
  | { type: 'PRESERVE_PROMPT'; payload: { prompt: string; files: File[] } }
  | { type: 'CLEAR_PRESERVED'; payload: void }
  | { type: 'SET_PREVIEW_ROUTE'; payload: string }
  | { type: 'SET_DEVICE_VIEW'; payload: 'mobile' | 'tablet' | 'desktop' }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_GENERATION_START_TIME'; payload: number | null }
  | { type: 'SET_PREVIEW_ERROR'; payload: boolean }
  | { type: 'SET_PREVIEW_LOADED'; payload: boolean }
  | { type: 'CLEAR_FILES_AFTER_SUBMIT'; payload: void };

// Function to generate project name from prompt
const generateProjectName = (prompt: string): string => {
  // Remove special characters and convert to lowercase
  const cleanPrompt = prompt
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim();
  
  // Take first 3-4 meaningful words
  const words = cleanPrompt.split(/\s+/).filter(word => 
    word.length > 2 && 
    !['the', 'and', 'for', 'with', 'that', 'this', 'build', 'create', 'make', 'app', 'application'].includes(word)
  );
  
  // Take up to 3 words and join with hyphens
  const projectWords = words.slice(0, 3);
  const baseName = projectWords.length > 0 ? projectWords.join('-') : 'ai-project';
  
  // Add random suffix to ensure uniqueness
  const randomSuffix = Math.floor(Math.random() * 1000);
  return `${baseName}-${randomSuffix}`;
};

const initialState: AppState = {
  prompt: '',
  attachedFiles: [],
  projectName: 'ai-sketchpad-70',
  messages: [],
  codeFiles: {
    html: '',
    css: '',
    js: ''
  },
  activeTab: 'preview',
  isLoggedIn: false, // Always false - use AuthContext for auth state
  preservedPrompt: '',
  preservedFiles: [],
  previewRoute: '/workspace',
  deviceView: 'desktop',
  isGenerating: false,
  generationStartTime: null,
  previewError: false,
  previewLoaded: false,
  clearFilesAfterSubmit: false
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_PROMPT':
      // Generate project name when setting prompt
      const newProjectName = action.payload.trim() ? generateProjectName(action.payload) : state.projectName;
      return { 
        ...state, 
        prompt: action.payload,
        projectName: newProjectName
      };
    case 'SET_FILES':
      return { ...state, attachedFiles: action.payload };
    case 'SET_PROJECT_NAME':
      return { ...state, projectName: action.payload };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            ...action.payload,
            id: Date.now().toString(),
            timestamp: new Date()
          }
        ]
      };
    case 'UPDATE_LAST_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((message, index) =>
          index === state.messages.length - 1
            ? { ...message, content: action.payload.content }
            : message
        )
      };
    case 'SET_CODE_FILES':
      return { ...state, codeFiles: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_LOGIN_STATUS':
      return { ...state, isLoggedIn: action.payload };
    case 'PRESERVE_PROMPT':
      return { 
        ...state, 
        preservedPrompt: action.payload.prompt,
        preservedFiles: action.payload.files
      };
    case 'CLEAR_PRESERVED':
      return { 
        ...state, 
        preservedPrompt: '',
        preservedFiles: []
      };
    case 'SET_PREVIEW_ROUTE':
      return { ...state, previewRoute: action.payload };
    case 'SET_DEVICE_VIEW':
      return { ...state, deviceView: action.payload };
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };
    case 'SET_GENERATION_START_TIME':
      return { ...state, generationStartTime: action.payload };
    case 'SET_PREVIEW_ERROR':
      return { ...state, previewError: action.payload };
    case 'SET_PREVIEW_LOADED':
      return { ...state, previewLoaded: action.payload };
    case 'CLEAR_FILES_AFTER_SUBMIT':
      return { ...state, attachedFiles: [] };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};