import { io, Socket } from 'socket.io-client';

// Updated types to match backend GALATEA events
export interface GALATEASocketEvents {
  'GALATEA_SESSION_CREATED': {
    sessionId: string;
    managerId: string;
    timestamp: string;
  };
  'GALATEA_TYPING': {
    sessionId: string;
    managerId: string;
    isTyping: boolean;
  };
  'GALATEA_PROGRESS': {
    sessionId: string;
    managerId: string;
    stage: 'analyzing' | 'querying' | 'processing' | 'generating';
    message: string;
    progress: number;
    timestamp: string;
  };
  'GALATEA_RESPONSE': {
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
  'GALATEA_ERROR': {
    sessionId: string;
    managerId: string;
    error: string;
    code: string;
    timestamp: string;
  };
  'GALATEA_TOOL_EXECUTING': {
    sessionId: string;
    managerId: string;
    toolName: string;
    toolDescription: string;
    timestamp: string;
  };
  'GALATEA_TOOL_COMPLETED': {
    sessionId: string;
    managerId: string;
    toolName: string;
    success: boolean;
    executionTime: number;
    timestamp: string;
  };
  'GALATEA_PROCESSING_COMPLETE': {
    sessionId: string;
    managerId: string;
    totalExecutionTime: number;
    toolsExecuted: string[];
    timestamp: string;
  };
}

export class GALATEASocketService {
  private socket: Socket | null = null;
  private managerId: string | null = null;
  private sessionId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  
  constructor(private baseUrl: string, private authToken: string) {}

  /**
   * Connect to GALATEA WebSocket server
   * Utiliza Event Bus interno para comunicación
   */
  connect(managerId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.managerId = String(managerId);
      
      console.log('🔌 Connecting to GALATEA WebSocket:', this.baseUrl);
      
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
        console.log('🔌 Connected to GALATEA WebSocket');
        this.reconnectAttempts = 0;
      });

      // Handle session creation (automatic from backend via Event Bus)
      this.socket.on('GALATEA_SESSION_CREATED', (data: GALATEASocketEvents['GALATEA_SESSION_CREATED']) => {
        console.log('🆔 GALATEA Session created:', data);
        this.sessionId = data.sessionId;
        this.onSessionCreated?.(data);
        resolve();
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
   * Send query to GALATEA AI assistant
   * El backend propaga esto via Event Bus
   */
  sendQuery(query: string): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    if (!this.sessionId || !this.managerId) {
      throw new Error('Session not established. Please wait for connection to complete.');
    }

    console.log('📤 Sending query to GALATEA:', { query, sessionId: this.sessionId });
    
    this.socket.emit('GALATEA_QUERY', {
      sessionId: this.sessionId,
      managerId: this.managerId,
      query: query,
      timestamp: new Date().toISOString(),
      userInfo: {}
    });
  }

  /**
   * Set up event listeners for GALATEA AI responses
   * Recibe eventos propagados via Event Bus
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('GALATEA_SESSION_CREATED', (data: GALATEASocketEvents['GALATEA_SESSION_CREATED']) => {
      console.log('🆔 Session created:', data);
      this.sessionId = data.sessionId;
      this.onSessionCreated?.(data);
    });

    this.socket.on('GALATEA_TYPING', (data: GALATEASocketEvents['GALATEA_TYPING']) => {
      console.log('⌨️ Typing status:', data);
      this.onTyping?.(data);
    });

    this.socket.on('GALATEA_PROGRESS', (data: GALATEASocketEvents['GALATEA_PROGRESS']) => {
      console.log('📊 Progress update:', data);
      this.onProgress?.(data);
    });

    this.socket.on('GALATEA_RESPONSE', (data: GALATEASocketEvents['GALATEA_RESPONSE']) => {
      console.log('✅ Response received:', data);
      this.onResponse?.(data);
    });

    this.socket.on('GALATEA_ERROR', (data: GALATEASocketEvents['GALATEA_ERROR']) => {
      console.error('❌ GALATEA Error:', data);
      this.onError?.(data);
    });

    this.socket.on('GALATEA_TOOL_EXECUTING', (data: GALATEASocketEvents['GALATEA_TOOL_EXECUTING']) => {
      console.log('🔧 Tool executing:', data);
      this.onToolExecuting?.(data);
    });

    this.socket.on('GALATEA_TOOL_COMPLETED', (data: GALATEASocketEvents['GALATEA_TOOL_COMPLETED']) => {
      console.log('✅ Tool completed:', data);
      this.onToolCompleted?.(data);
    });

    this.socket.on('GALATEA_PROCESSING_COMPLETE', (data: GALATEASocketEvents['GALATEA_PROCESSING_COMPLETE']) => {
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
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;
      
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
      console.log('🔌 Disconnecting from GALATEA WebSocket');
      this.socket.disconnect();
      this.socket = null;
      this.sessionId = null;
    }
  }

  // Event handlers (to be overridden by components)
  onSessionCreated?: (data: GALATEASocketEvents['GALATEA_SESSION_CREATED']) => void;
  onTyping?: (data: GALATEASocketEvents['GALATEA_TYPING']) => void;
  onProgress?: (data: GALATEASocketEvents['GALATEA_PROGRESS']) => void;
  onResponse?: (data: GALATEASocketEvents['GALATEA_RESPONSE']) => void;
  onError?: (data: GALATEASocketEvents['GALATEA_ERROR']) => void;
  onToolExecuting?: (data: GALATEASocketEvents['GALATEA_TOOL_EXECUTING']) => void;
  onToolCompleted?: (data: GALATEASocketEvents['GALATEA_TOOL_COMPLETED']) => void;
  onProcessingComplete?: (data: GALATEASocketEvents['GALATEA_PROCESSING_COMPLETE']) => void;
}
