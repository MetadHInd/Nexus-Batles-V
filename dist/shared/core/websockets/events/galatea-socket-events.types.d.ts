export declare enum GALATEAEventType {
    GALATEA_QUERY = "GALATEA_QUERY",
    GALATEA_JOIN_SESSION = "GALATEA_JOIN_SESSION",
    GALATEA_LEAVE_SESSION = "GALATEA_LEAVE_SESSION",
    GALATEA_RESPONSE = "GALATEA_RESPONSE",
    GALATEA_PROGRESS = "GALATEA_PROGRESS",
    GALATEA_TYPING = "GALATEA_TYPING",
    GALATEA_ERROR = "GALATEA_ERROR",
    GALATEA_SESSION_CREATED = "GALATEA_SESSION_CREATED",
    GALATEA_SESSION_ENDED = "GALATEA_SESSION_ENDED",
    GALATEA_TOOL_EXECUTING = "GALATEA_TOOL_EXECUTING",
    GALATEA_TOOL_COMPLETED = "GALATEA_TOOL_COMPLETED",
    GALATEA_PROCESSING_COMPLETE = "GALATEA_PROCESSING_COMPLETE"
}
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
    progress: number;
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
export declare const GALATEA_PROGRESS_STAGES: {
    readonly ANALYZING: {
        readonly stage: "analyzing";
        readonly message: "🤖 Analizando tu consulta...";
        readonly progress: 10;
    };
    readonly QUERYING: {
        readonly stage: "querying";
        readonly message: "📊 Consultando información...";
        readonly progress: 40;
    };
    readonly PROCESSING: {
        readonly stage: "processing";
        readonly message: "⚡ Procesando datos...";
        readonly progress: 70;
    };
    readonly GENERATING: {
        readonly stage: "generating";
        readonly message: "💡 Generando respuesta...";
        readonly progress: 90;
    };
};
