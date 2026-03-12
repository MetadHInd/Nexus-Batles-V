import { io, Socket } from 'socket.io-client';

// Updated types to match backend
export interface AIASocketEvents {
  'AIA_SESSION_CREATED': {
    sessionId: string;
    managerId: string;
    timestamp: string;
  };
  'AIA_TYPING': {
    sessionId: string;
    managerId: string;
    isTyping: boolean;
  };
  'AIA_PROGRESS': {
    sessionId: string;
    managerId: string;
    stage: 'analyzing' | 'querying' | 'processing' | 'generating';
    message: string;
    progress: number;
    timestamp: string;
  };
  'AIA_RESPONSE': {
    sessionId: string;
    managerId: string;
    response: string;
    timestamp: string;
    metadata?: {
      toolsUsed?: string[];
      executionTime?: number;
      tokensUsed?: number;
    };
  };
  'AIA_ERROR': {
    sessionId: string;
    managerId: string;
    error: string;
    code: string;
    timestamp: string;
  };
  'AIA_TOOL_EXECUTING': {
    sessionId: string;
    managerId: string;
    toolName: string;
    toolDescription: string;
    timestamp: string;
  };
  'AIA_TOOL_COMPLETED': {
    sessionId: string;
    managerId: string;
    toolName: string;
    success: boolean;
    executionTime: number;
    timestamp: string;
  };
  'AIA_PROCESSING_COMPLETE': {
    sessionId: string;
    managerId: string;
    totalExecutionTime: number;
    toolsExecuted: string[];
    timestamp: string;
  };
}

export class AIASocketService {
  private socket: Socket | null = null;
  private managerId: string | null = null; // Changed to string to match backend
  private sessionId: string | null = null; // Track session ID from backend
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  
  constructor(private baseUrl: string, private authToken: string) {}

  /**
   * Connect to AIA WebSocket server
   */
  connect(managerId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.managerId = String(managerId); // Convert to string for backend compatibility
      
      console.log('🔌 Connecting to AIA WebSocket:', this.baseUrl);
      
      this.socket = io(this.baseUrl, {
        auth: {
          token: this.authToken
        },
        transports: ['websocket'],
        upgrade: false,
        rememberUpgrade: false,
        timeout: 10000,
        forceNew: true
      });

      this.socket.on('connect', () => {
        console.log('🔌 Connected to AIA WebSocket');
        this.reconnectAttempts = 0;
        // Don't resolve here - wait for session creation
      });

      // Handle session creation (automatic from backend)
      this.socket.on('AIA_SESSION_CREATED', (data: AIASocketEvents['AIA_SESSION_CREATED']) => {
        console.log('🆔 Session created:', data);
        this.sessionId = data.sessionId;
        this.onSessionCreated?.(data);
        resolve(); // Resolve here when session is ready
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error);
        reject(error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 Disconnected:', reason);
        if (reason !== 'io client disconnect') {
          this.handleReconnection();
        }
      });

      // Set up event listeners
      this.setupEventListeners();
    });
  }

  /**
   * Send query to AI assistant
   */
  sendQuery(query: string): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    if (!this.sessionId || !this.managerId) {
      throw new Error('Session not established. Please wait for connection to complete.');
    }

    console.log('📤 Sending query to AIA:', { query, sessionId: this.sessionId });
    
    // Use correct payload structure expected by backend
    this.socket.emit('AIA_QUERY', {
      sessionId: this.sessionId,
      managerId: this.managerId,
      query: query,
      timestamp: new Date().toISOString(),
      userInfo: {} // Optional field
    });
  }

  /**
   * Set up event listeners for AI responses
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Session created (handled in connect method too)
    this.socket.on('AIA_SESSION_CREATED', (data: AIASocketEvents['AIA_SESSION_CREATED']) => {
      console.log('🆔 Session created:', data);
      this.sessionId = data.sessionId;
      this.onSessionCreated?.(data);
    });

    // Typing indicator
    this.socket.on('AIA_TYPING', (data: AIASocketEvents['AIA_TYPING']) => {
      console.log('⌨️ Typing status:', data);
      this.onTyping?.(data);
    });

    // Progress updates
    this.socket.on('AIA_PROGRESS', (data: AIASocketEvents['AIA_PROGRESS']) => {
      console.log('📊 Progress update:', data);
      this.onProgress?.(data);
    });

    // Final response
    this.socket.on('AIA_RESPONSE', (data: AIASocketEvents['AIA_RESPONSE']) => {
      console.log('✅ Response received:', data);
      this.onResponse?.(data);
    });

    // Error handling
    this.socket.on('AIA_ERROR', (data: AIASocketEvents['AIA_ERROR']) => {
      console.error('❌ AIA Error:', data);
      this.onError?.(data);
    });

    // Tool execution events
    this.socket.on('AIA_TOOL_EXECUTING', (data: AIASocketEvents['AIA_TOOL_EXECUTING']) => {
      console.log('🔧 Tool executing:', data);
      this.onToolExecuting?.(data);
    });

    this.socket.on('AIA_TOOL_COMPLETED', (data: AIASocketEvents['AIA_TOOL_COMPLETED']) => {
      console.log('✅ Tool completed:', data);
      this.onToolCompleted?.(data);
    });

    // Processing complete
    this.socket.on('AIA_PROCESSING_COMPLETE', (data: AIASocketEvents['AIA_PROCESSING_COMPLETE']) => {
      console.log('🎉 Processing complete:', data);
      this.onProcessingComplete?.(data);
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
          this.connect(parseInt(this.managerId)).catch(console.error);
        }
      }, delay);
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  }

  /**
   * Check if socket is connected and session is ready
   */
  isConnected(): boolean {
    return this.socket?.connected && this.sessionId !== null || false;
  }

  /**
   * Get current session ID
   */
  getSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * Disconnect from server
   */
  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Disconnecting from AIA WebSocket');
      this.socket.disconnect();
      this.socket = null;
      this.sessionId = null;
    }
  }

  // Event handlers (to be overridden by components)
  onSessionCreated?: (data: AIASocketEvents['AIA_SESSION_CREATED']) => void;
  onTyping?: (data: AIASocketEvents['AIA_TYPING']) => void;
  onProgress?: (data: AIASocketEvents['AIA_PROGRESS']) => void;
  onResponse?: (data: AIASocketEvents['AIA_RESPONSE']) => void;
  onError?: (data: AIASocketEvents['AIA_ERROR']) => void;
  onToolExecuting?: (data: AIASocketEvents['AIA_TOOL_EXECUTING']) => void;
  onToolCompleted?: (data: AIASocketEvents['AIA_TOOL_COMPLETED']) => void;
  onProcessingComplete?: (data: AIASocketEvents['AIA_PROCESSING_COMPLETE']) => void;
}