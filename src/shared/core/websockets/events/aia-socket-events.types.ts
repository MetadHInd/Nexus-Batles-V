/**
 * Eventos específicos para AIA (AI Assistant) WebSocket
 * Extiende el sistema genérico de eventos para chat con AI
 */

export enum AIAEventType {
  // Eventos de entrada (cliente -> servidor)
  AIA_QUERY = 'AIA_QUERY',
  AIA_JOIN_SESSION = 'AIA_JOIN_SESSION',
  AIA_LEAVE_SESSION = 'AIA_LEAVE_SESSION',

  // Eventos de salida (servidor -> cliente)
  AIA_RESPONSE = 'AIA_RESPONSE',
  AIA_PROGRESS = 'AIA_PROGRESS',
  AIA_TYPING = 'AIA_TYPING',
  AIA_ERROR = 'AIA_ERROR',
  AIA_SESSION_CREATED = 'AIA_SESSION_CREATED',
  AIA_SESSION_ENDED = 'AIA_SESSION_ENDED',

  // Eventos de estado
  AIA_TOOL_EXECUTING = 'AIA_TOOL_EXECUTING',
  AIA_TOOL_COMPLETED = 'AIA_TOOL_COMPLETED',
  AIA_PROCESSING_COMPLETE = 'AIA_PROCESSING_COMPLETE',
}

// Payloads para eventos de entrada
export interface AIAQueryPayload {
  sessionId: string;
  managerId: string;
  query: string;
  userInfo?: any;
  timestamp: string;
}

export interface AIAJoinSessionPayload {
  managerId: string;
  userInfo?: any;
}

export interface AIALeaveSessionPayload {
  sessionId: string;
  managerId: string;
}

// Payloads para eventos de salida
export interface AIAResponsePayload {
  sessionId: string;
  managerId: string;
  response: string;
  timestamp: string;
  metadata?: {
    toolsUsed?: string[];
    executionTime?: number;
    tokensUsed?: number;
  };
}

export interface AIAProgressPayload {
  sessionId: string;
  managerId: string;
  stage: 'analyzing' | 'querying' | 'processing' | 'generating';
  message: string;
  progress: number; // 0-100
  timestamp: string;
}

export interface AIATypingPayload {
  sessionId: string;
  managerId: string;
  isTyping: boolean;
}

export interface AIAErrorPayload {
  sessionId: string;
  managerId: string;
  error: string;
  code: string;
  timestamp: string;
}

export interface AIASessionCreatedPayload {
  sessionId: string;
  managerId: string;
  timestamp: string;
}

export interface AIASessionEndedPayload {
  sessionId: string;
  managerId: string;
  reason: 'user_left' | 'timeout' | 'error';
  timestamp: string;
}

export interface AIAToolExecutingPayload {
  sessionId: string;
  managerId: string;
  toolName: string;
  toolDescription: string;
  timestamp: string;
}

export interface AIAToolCompletedPayload {
  sessionId: string;
  managerId: string;
  toolName: string;
  success: boolean;
  executionTime: number;
  timestamp: string;
}

export interface AIAProcessingCompletePayload {
  sessionId: string;
  managerId: string;
  totalExecutionTime: number;
  toolsExecuted: string[];
  timestamp: string;
}

// Mapa de tipos de eventos a payloads
export interface AIAEventPayloadMap {
  [AIAEventType.AIA_QUERY]: AIAQueryPayload;
  [AIAEventType.AIA_JOIN_SESSION]: AIAJoinSessionPayload;
  [AIAEventType.AIA_LEAVE_SESSION]: AIALeaveSessionPayload;
  [AIAEventType.AIA_RESPONSE]: AIAResponsePayload;
  [AIAEventType.AIA_PROGRESS]: AIAProgressPayload;
  [AIAEventType.AIA_TYPING]: AIATypingPayload;
  [AIAEventType.AIA_ERROR]: AIAErrorPayload;
  [AIAEventType.AIA_SESSION_CREATED]: AIASessionCreatedPayload;
  [AIAEventType.AIA_SESSION_ENDED]: AIASessionEndedPayload;
  [AIAEventType.AIA_TOOL_EXECUTING]: AIAToolExecutingPayload;
  [AIAEventType.AIA_TOOL_COMPLETED]: AIAToolCompletedPayload;
  [AIAEventType.AIA_PROCESSING_COMPLETE]: AIAProcessingCompletePayload;
}

// Constantes para progreso
export const AIA_PROGRESS_STAGES = {
  ANALYZING: {
    stage: 'analyzing' as const,
    message: '🤖 Analizando tu consulta...',
    progress: 10,
  },
  QUERYING: {
    stage: 'querying' as const,
    message: '📊 Consultando información...',
    progress: 40,
  },
  PROCESSING: {
    stage: 'processing' as const,
    message: '⚡ Procesando datos...',
    progress: 70,
  },
  GENERATING: {
    stage: 'generating' as const,
    message: '💡 Generando respuesta...',
    progress: 90,
  },
} as const;
