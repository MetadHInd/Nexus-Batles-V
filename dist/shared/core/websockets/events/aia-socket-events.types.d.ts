export declare enum AIAEventType {
    AIA_QUERY = "AIA_QUERY",
    AIA_JOIN_SESSION = "AIA_JOIN_SESSION",
    AIA_LEAVE_SESSION = "AIA_LEAVE_SESSION",
    AIA_RESPONSE = "AIA_RESPONSE",
    AIA_PROGRESS = "AIA_PROGRESS",
    AIA_TYPING = "AIA_TYPING",
    AIA_ERROR = "AIA_ERROR",
    AIA_SESSION_CREATED = "AIA_SESSION_CREATED",
    AIA_SESSION_ENDED = "AIA_SESSION_ENDED",
    AIA_TOOL_EXECUTING = "AIA_TOOL_EXECUTING",
    AIA_TOOL_COMPLETED = "AIA_TOOL_COMPLETED",
    AIA_PROCESSING_COMPLETE = "AIA_PROCESSING_COMPLETE"
}
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
    progress: number;
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
export declare const AIA_PROGRESS_STAGES: {
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
