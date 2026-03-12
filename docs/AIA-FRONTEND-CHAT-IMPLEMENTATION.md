# GALATEA Intelligence Frontend Chat Implementation Guide

## 📋 Overview

This document provides complete implementation instructions for creating a real-time AI chat frontend that connects to the GALATEA Intelligence WebSocket + Jobs system. The frontend will provide a modern chat experience with real-time progress indicators, typing animations, and seamless AI interaction.

## 🏗️ Architecture Overview

```
Frontend (React/Vue/Angular) 
    ↓ WebSocket Connection
Backend AIA Gateway 
    ↓ Event Bus Communication
AIA Job Service 
    ↓ AI Processing
Manager Assistant (Gemini 2.5 Flash)
```

## 🔌 WebSocket Connection Setup

### 1. Install Dependencies

```bash
npm install socket.io-client
npm install @types/socket.io-client  # For TypeScript
```

### 2. Socket Service Implementation

Create `services/aia-socket.service.ts`:

```typescript
import { io, Socket } from 'socket.io-client';

export interface AIASocketEvents {
  // Outgoing events (client to server)
  AIA_QUERY: {
    query: string;
    sessionId?: string;
  };
  
  AIA_JOIN_ROOM: {
    managerId: number;
  };
  
  AIA_LEAVE_ROOM: {
    managerId: number;
  };

  // Incoming events (server to client)
  AIA_QUERY_RECEIVED: {
    jobId: string;
    sessionId: string;
    estimatedTime?: number;
  };
  
  AIA_PROGRESS: {
    jobId: string;
    sessionId: string;
    stage: 'analyzing' | 'querying' | 'processing' | 'generating';
    message: string;
    progress: number; // 0-100
  };
  
  AIA_RESPONSE: {
    jobId: string;
    sessionId: string;
    response: string;
    metadata?: {
      executionTime: number;
      toolsUsed: string[];
    };
  };
  
  AIA_ERROR: {
    jobId: string;
    sessionId: string;
    error: string;
    code?: string;
  };
  
  AIA_TOOL_EXECUTING: {
    jobId: string;
    sessionId: string;
    toolName: string;
    toolDescription: string;
  };
  
  AIA_TOOL_COMPLETED: {
    jobId: string;
    sessionId: string;
    toolName: string;
    success: boolean;
    executionTime: number;
  };
}

export class AIASocketService {
  private socket: Socket | null = null;
  private managerId: number | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  
  constructor(private baseUrl: string, private authToken: string) {}

  /**
   * Connect to AIA WebSocket server
   */
  connect(managerId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.managerId = managerId;
      
      this.socket = io(this.baseUrl, {
        auth: {
          token: this.authToken
        },
        transports: ['websocket'],
        upgrade: false,
        rememberUpgrade: false
      });

      this.socket.on('connect', () => {
        console.log('🔌 Connected to AIA WebSocket');
        this.reconnectAttempts = 0;
        
        // Join manager room
        this.socket?.emit('AIA_JOIN_ROOM', { managerId });
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error);
        reject(error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 Disconnected:', reason);
        this.handleReconnection();
      });

      // Set up event listeners
      this.setupEventListeners();
    });
  }

  /**
   * Send query to AI assistant
   */
  sendQuery(query: string, sessionId?: string): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('AIA_QUERY', {
      query,
      sessionId
    });
  }

  /**
   * Set up event listeners for AI responses
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Query received confirmation
    this.socket.on('AIA_QUERY_RECEIVED', (data) => {
      this.onQueryReceived?.(data);
    });

    // Progress updates
    this.socket.on('AIA_PROGRESS', (data) => {
      this.onProgress?.(data);
    });

    // Final response
    this.socket.on('AIA_RESPONSE', (data) => {
      this.onResponse?.(data);
    });

    // Error handling
    this.socket.on('AIA_ERROR', (data) => {
      this.onError?.(data);
    });

    // Tool execution events
    this.socket.on('AIA_TOOL_EXECUTING', (data) => {
      this.onToolExecuting?.(data);
    });

    this.socket.on('AIA_TOOL_COMPLETED', (data) => {
      this.onToolCompleted?.(data);
    });
  }

  /**
   * Handle automatic reconnection
   */
  private handleReconnection(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      
      console.log(`🔄 Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
      
      setTimeout(() => {
        if (this.managerId) {
          this.connect(this.managerId);
        }
      }, delay);
    }
  }

  /**
   * Disconnect from server
   */
  disconnect(): void {
    if (this.socket) {
      if (this.managerId) {
        this.socket.emit('AIA_LEAVE_ROOM', { managerId: this.managerId });
      }
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Event handlers (to be overridden by components)
  onQueryReceived?: (data: AIASocketEvents['AIA_QUERY_RECEIVED']) => void;
  onProgress?: (data: AIASocketEvents['AIA_PROGRESS']) => void;
  onResponse?: (data: AIASocketEvents['AIA_RESPONSE']) => void;
  onError?: (data: AIASocketEvents['AIA_ERROR']) => void;
  onToolExecuting?: (data: AIASocketEvents['AIA_TOOL_EXECUTING']) => void;
  onToolCompleted?: (data: AIASocketEvents['AIA_TOOL_COMPLETED']) => void;
}
```

## 🎨 React Chat Component Implementation

### 1. Chat Types

Create `types/chat.types.ts`:

```typescript
export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'processing' | 'completed' | 'error';
  progress?: number;
  metadata?: {
    executionTime?: number;
    toolsUsed?: string[];
    jobId?: string;
  };
}

export interface ChatSession {
  id: string;
  managerId: number;
  messages: ChatMessage[];
  isActive: boolean;
  lastActivity: Date;
}

export interface ProgressState {
  isVisible: boolean;
  stage: string;
  message: string;
  progress: number;
  currentTool?: string;
}
```

### 2. Chat Hook

Create `hooks/useAIAChat.ts`:

```typescript
import { useState, useEffect, useCallback, useRef } from 'react';
import { AIASocketService } from '../services/aia-socket.service';
import { ChatMessage, ChatSession, ProgressState } from '../types/chat.types';
import { v4 as uuidv4 } from 'uuid';

export const useAIAChat = (managerId: number, authToken: string) => {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<ProgressState>({
    isVisible: false,
    stage: '',
    message: '',
    progress: 0
  });
  
  const socketService = useRef<AIASocketService | null>(null);
  const currentJobId = useRef<string | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const initSocket = async () => {
      try {
        socketService.current = new AIASocketService(
          process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:3000',
          authToken
        );

        // Set up event handlers
        socketService.current.onQueryReceived = handleQueryReceived;
        socketService.current.onProgress = handleProgress;
        socketService.current.onResponse = handleResponse;
        socketService.current.onError = handleError;
        socketService.current.onToolExecuting = handleToolExecuting;
        socketService.current.onToolCompleted = handleToolCompleted;

        await socketService.current.connect(managerId);
        setIsConnected(true);

        // Initialize session
        setSession({
          id: uuidv4(),
          managerId,
          messages: [],
          isActive: true,
          lastActivity: new Date()
        });

      } catch (error) {
        console.error('Failed to connect to AIA socket:', error);
        setIsConnected(false);
      }
    };

    initSocket();

    return () => {
      socketService.current?.disconnect();
    };
  }, [managerId, authToken]);

  // Event handlers
  const handleQueryReceived = useCallback((data: any) => {
    currentJobId.current = data.jobId;
    setIsLoading(true);
    setProgress({
      isVisible: true,
      stage: 'received',
      message: '🤖 Query received, starting processing...',
      progress: 5
    });
  }, []);

  const handleProgress = useCallback((data: any) => {
    setProgress({
      isVisible: true,
      stage: data.stage,
      message: data.message,
      progress: data.progress
    });
  }, []);

  const handleResponse = useCallback((data: any) => {
    if (!session) return;

    const aiMessage: ChatMessage = {
      id: uuidv4(),
      type: 'ai',
      content: data.response,
      timestamp: new Date(),
      status: 'completed',
      metadata: data.metadata
    };

    setSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, aiMessage],
      lastActivity: new Date()
    } : null);

    setIsLoading(false);
    setProgress({ isVisible: false, stage: '', message: '', progress: 0 });
    currentJobId.current = null;
  }, [session]);

  const handleError = useCallback((data: any) => {
    if (!session) return;

    const errorMessage: ChatMessage = {
      id: uuidv4(),
      type: 'system',
      content: `Error: ${data.error}`,
      timestamp: new Date(),
      status: 'error'
    };

    setSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, errorMessage],
      lastActivity: new Date()
    } : null);

    setIsLoading(false);
    setProgress({ isVisible: false, stage: '', message: '', progress: 0 });
    currentJobId.current = null;
  }, [session]);

  const handleToolExecuting = useCallback((data: any) => {
    setProgress(prev => ({
      ...prev,
      currentTool: data.toolName,
      message: `🔧 ${data.toolDescription}`
    }));
  }, []);

  const handleToolCompleted = useCallback((data: any) => {
    setProgress(prev => ({
      ...prev,
      currentTool: undefined
    }));
  }, []);

  // Send message function
  const sendMessage = useCallback((content: string) => {
    if (!socketService.current || !session || isLoading) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      type: 'user',
      content,
      timestamp: new Date(),
      status: 'sending'
    };

    setSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, userMessage],
      lastActivity: new Date()
    } : null);

    try {
      socketService.current.sendQuery(content, session.id);
      
      // Update message status to sent
      setSession(prev => prev ? {
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'sent' }
            : msg
        )
      } : null);
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Update message status to error
      setSession(prev => prev ? {
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'error' }
            : msg
        )
      } : null);
    }
  }, [session, isLoading]);

  return {
    session,
    isConnected,
    isLoading,
    progress,
    sendMessage
  };
};
```

### 3. Chat Component

Create `components/AIAChat.tsx`:

```typescript
import React, { useState, useRef, useEffect } from 'react';
import { useAIAChat } from '../hooks/useAIAChat';
import { ChatMessage } from '../types/chat.types';

interface AIAChatProps {
  managerId: number;
  authToken: string;
  className?: string;
}

export const AIAChat: React.FC<AIAChatProps> = ({ 
  managerId, 
  authToken, 
  className = '' 
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { 
    session, 
    isConnected, 
    isLoading, 
    progress, 
    sendMessage 
  } = useAIAChat(managerId, authToken);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages, progress]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !isConnected) return;
    
    sendMessage(inputValue.trim());
    setInputValue('');
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageStatusIcon = (status?: string) => {
    switch (status) {
      case 'sending': return '⏳';
      case 'sent': return '✓';
      case 'completed': return '✅';
      case 'error': return '❌';
      default: return '';
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.type === 'user';
    const isSystem = message.type === 'system';
    
    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-[80%] rounded-lg px-4 py-2 ${
            isUser
              ? 'bg-blue-500 text-white'
              : isSystem
              ? 'bg-red-100 text-red-800 border border-red-200'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
          <div className="flex items-center justify-between mt-1 text-xs opacity-70">
            <span>{formatTimestamp(message.timestamp)}</span>
            <span>{getMessageStatusIcon(message.status)}</span>
          </div>
          {message.metadata && (
            <div className="mt-2 text-xs opacity-60">
              {message.metadata.executionTime && (
                <div>⏱️ {message.metadata.executionTime}ms</div>
              )}
              {message.metadata.toolsUsed && message.metadata.toolsUsed.length > 0 && (
                <div>🔧 Tools: {message.metadata.toolsUsed.join(', ')}</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProgress = () => {
    if (!progress.isVisible) return null;

    return (
      <div className="flex justify-start mb-4">
        <div className="max-w-[80%] bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <div className="flex items-center space-x-2 mb-2">
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="text-sm text-blue-700">{progress.message}</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-blue-100 rounded-full h-2 mb-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.progress}%` }}
            ></div>
          </div>
          
          <div className="text-xs text-blue-600">
            {progress.progress}% complete
            {progress.currentTool && (
              <span className="ml-2">• Using: {progress.currentTool}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <h2 className="font-semibold text-gray-800">AIA Manager Assistant</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {!session?.messages.length && (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-4xl mb-2">🤖</div>
            <p>Hello! I'm your AI Manager Assistant.</p>
            <p className="text-sm mt-1">Ask me about your branches, orders, or any business insights!</p>
          </div>
        )}
        
        {session?.messages.map(renderMessage)}
        {renderProgress()}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              !isConnected 
                ? "Connecting..." 
                : isLoading 
                ? "Processing your request..." 
                : "Ask me anything about your business..."
            }
            disabled={!isConnected || isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!isConnected || isLoading || !inputValue.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
```

## 🎯 Usage Example

### 1. App Integration

```typescript
// App.tsx
import React from 'react';
import { AIAChat } from './components/AIAChat';

function App() {
  const managerId = 123; // Get from authentication
  const authToken = 'your-jwt-token'; // Get from authentication

  return (
    <div className="h-screen">
      <AIAChat 
        managerId={managerId}
        authToken={authToken}
        className="h-full"
      />
    </div>
  );
}

export default App;
```

### 2. Environment Variables

Create `.env`:

```env
REACT_APP_WEBSOCKET_URL=ws://localhost:3000
REACT_APP_API_URL=http://localhost:3000
```

## 🎨 Styling with Tailwind CSS

Add to your `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
```

## 🔧 Advanced Features

### 1. Message Persistence

```typescript
// Add to useAIAChat hook
const saveSession = useCallback(() => {
  if (session) {
    localStorage.setItem(`aia-session-${managerId}`, JSON.stringify(session));
  }
}, [session, managerId]);

const loadSession = useCallback(() => {
  const saved = localStorage.getItem(`aia-session-${managerId}`);
  if (saved) {
    const parsedSession = JSON.parse(saved);
    setSession({
      ...parsedSession,
      messages: parsedSession.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    });
  }
}, [managerId]);
```

### 2. Typing Indicators

```typescript
// Add to chat component
const [isTyping, setIsTyping] = useState(false);

// In progress handler
const handleProgress = useCallback((data: any) => {
  setIsTyping(true);
  setProgress({
    isVisible: true,
    stage: data.stage,
    message: data.message,
    progress: data.progress
  });
}, []);

// Typing indicator component
const TypingIndicator = () => (
  <div className="flex justify-start mb-4">
    <div className="bg-gray-100 rounded-lg px-4 py-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
);
```

### 3. Voice Input (Optional)

```typescript
// Add speech recognition
const [isListening, setIsListening] = useState(false);

const startListening = () => {
  if ('webkitSpeechRecognition' in window) {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
    };

    recognition.start();
  }
};
```

## 🚀 Deployment Considerations

### 1. Production WebSocket URL

```typescript
const getWebSocketUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'wss://your-domain.com';
  }
  return 'ws://localhost:3000';
};
```

### 2. Error Boundaries

```typescript
import React from 'react';

class ChatErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Chat error:', error, errorInfo);
  }

  render() {
    if ((this.state as any).hasError) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Something went wrong
            </h2>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reload Chat
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 📱 Mobile Responsiveness

```css
/* Add to your CSS */
@media (max-width: 768px) {
  .chat-container {
    height: 100vh;
    height: 100dvh; /* Dynamic viewport height */
  }
  
  .chat-input {
    padding: 12px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
```

## 🔍 Testing

### 1. Unit Tests

```typescript
// __tests__/useAIAChat.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useAIAChat } from '../hooks/useAIAChat';

describe('useAIAChat', () => {
  it('should connect and send messages', async () => {
    const { result } = renderHook(() => 
      useAIAChat(123, 'test-token')
    );

    await act(async () => {
      result.current.sendMessage('Hello AI');
    });

    expect(result.current.session?.messages).toHaveLength(1);
  });
});
```

### 2. Integration Tests

```typescript
// __tests__/AIAChat.integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AIAChat } from '../components/AIAChat';

describe('AIAChat Integration', () => {
  it('should send message and receive response', async () => {
    render(<AIAChat managerId={123} authToken="test-token" />);
    
    const input = screen.getByPlaceholderText(/ask me anything/i);
    const sendButton = screen.getByText('Send');
    
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });
});
```

## 📊 Performance Optimization

### 1. Message Virtualization (for large chat histories)

```bash
npm install react-window react-window-infinite-loader
```

### 2. Debounced Typing Indicators

```typescript
import { debounce } from 'lodash';

const debouncedTyping = debounce(() => {
  setIsTyping(false);
}, 1000);
```

## 🎉 Conclusion

This implementation provides:

- ✅ **Real-time WebSocket communication**
- ✅ **Progress indicators with visual feedback**
- ✅ **Tool execution visibility**
- ✅ **Error handling and reconnection**
- ✅ **Mobile-responsive design**
- ✅ **TypeScript support**
- ✅ **Production-ready architecture**

The frontend will seamlessly connect to your AIA Intelligence backend, providing users with a modern, responsive chat experience that shows real-time progress as the AI processes their queries.

## 🔗 Backend Integration Points

- **WebSocket Endpoint**: `ws://your-domain.com` (connects to AIAGateway)
- **Authentication**: JWT token in socket auth
- **Room Management**: Automatic manager-specific rooms
- **Event Bus**: Seamless backend communication
- **Job Processing**: Real-time progress updates

Your AI agent frontend developer can use this guide to implement a complete, production-ready chat interface that leverages all the powerful real-time features of your AIA Intelligence system.