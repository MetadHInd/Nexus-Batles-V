/**
 * Eventos específicos para GALATEA (AI Assistant) WebSocket
 * Extiende el sistema genérico de eventos para chat con AI
 * Sistema integrado con Event Bus para pub/sub
 */

export enum GALATEAEventType {
  // Eventos de entrada (cliente -> servidor)
  GALATEA_QUERY = 'GALATEA_QUERY',
  GALATEA_JOIN_SESSION = 'GALATEA_JOIN_SESSION',
  GALATEA_LEAVE_SESSION = 'GALATEA_LEAVE_SESSION',

  // Eventos de salida (servidor -> cliente)
  GALATEA_RESPONSE = 'GALATEA_RESPONSE',
  GALATEA_PROGRESS = 'GALATEA_PROGRESS',
  GALATEA_TYPING = 'GALATEA_TYPING',
  GALATEA_ERROR = 'GALATEA_ERROR',
  GALATEA_SESSION_CREATED = 'GALATEA_SESSION_CREATED',
  GALATEA_SESSION_ENDED = 'GALATEA_SESSION_ENDED',

  // Eventos de estado
  GALATEA_TOOL_EXECUTING = 'GALATEA_TOOL_EXECUTING',
  GALATEA_TOOL_COMPLETED = 'GALATEA_TOOL_COMPLETED',
  GALATEA_PROCESSING_COMPLETE = 'GALATEA_PROCESSING_COMPLETE',
}

// Payloads para eventos de entrada
export interface GALATEAQueryPayload {
  sessionId: string;
  managerId: string;
  query: string;
  userInfo?: any;
  timestamp: string;
}

export interface GALATEAJoinSessionPayload {
  managerId: string;
  userInfo?: any;
}

export interface GALATEALeaveSessionPayload {
  sessionId: string;
  managerId: string;
}

// Payloads para eventos de salida
export interface GALATEAResponsePayload {
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

export interface GALATEAProgressPayload {
  sessionId: string;
  managerId: string;
  stage: 'analyzing' | 'querying' | 'processing' | 'generating';
  message: string;
  progress: number; // 0-100
  timestamp: string;
}

export interface GALATEATypingPayload {
  sessionId: string;
  managerId: string;
  isTyping: boolean;
}

export interface GALATEAErrorPayload {
  sessionId: string;
  managerId: string;
  error: string;
  code: string;
  timestamp: string;
}

export interface GALATEASessionCreatedPayload {
  sessionId: string;
  managerId: string;
  timestamp: string;
}

export interface GALATEASessionEndedPayload {
  sessionId: string;
  managerId: string;
  reason: 'user_left' | 'timeout' | 'error';
  timestamp: string;
}

export interface GALATEAToolExecutingPayload {
  sessionId: string;
  managerId: string;
  toolName: string;
  toolDescription: string;
  timestamp: string;
}

export interface GALATEAToolCompletedPayload {
  sessionId: string;
  managerId: string;
  toolName: string;
  success: boolean;
  executionTime: number;
  timestamp: string;
}

export interface GALATEAProcessingCompletePayload {
  sessionId: string;
  managerId: string;
  totalExecutionTime: number;
  toolsExecuted: string[];
  timestamp: string;
}

// Mapa de tipos de eventos a payloads
export interface GALATEAEventPayloadMap {
  [GALATEAEventType.GALATEA_QUERY]: GALATEAQueryPayload;
  [GALATEAEventType.GALATEA_JOIN_SESSION]: GALATEAJoinSessionPayload;
  [GALATEAEventType.GALATEA_LEAVE_SESSION]: GALATEALeaveSessionPayload;
  [GALATEAEventType.GALATEA_RESPONSE]: GALATEAResponsePayload;
  [GALATEAEventType.GALATEA_PROGRESS]: GALATEAProgressPayload;
  [GALATEAEventType.GALATEA_TYPING]: GALATEATypingPayload;
  [GALATEAEventType.GALATEA_ERROR]: GALATEAErrorPayload;
  [GALATEAEventType.GALATEA_SESSION_CREATED]: GALATEASessionCreatedPayload;
  [GALATEAEventType.GALATEA_SESSION_ENDED]: GALATEASessionEndedPayload;
  [GALATEAEventType.GALATEA_TOOL_EXECUTING]: GALATEAToolExecutingPayload;
  [GALATEAEventType.GALATEA_TOOL_COMPLETED]: GALATEAToolCompletedPayload;
  [GALATEAEventType.GALATEA_PROCESSING_COMPLETE]: GALATEAProcessingCompletePayload;
}

// Constantes para progreso
export const GALATEA_PROGRESS_STAGES = {
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
