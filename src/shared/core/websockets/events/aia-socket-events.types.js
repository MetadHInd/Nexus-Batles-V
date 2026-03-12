"use strict";
/**
 * Eventos específicos para AIA (AI Assistant) WebSocket
 * Extiende el sistema genérico de eventos para chat con AI
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIA_PROGRESS_STAGES = exports.AIAEventType = void 0;
var AIAEventType;
(function (AIAEventType) {
    // Eventos de entrada (cliente -> servidor)
    AIAEventType["AIA_QUERY"] = "AIA_QUERY";
    AIAEventType["AIA_JOIN_SESSION"] = "AIA_JOIN_SESSION";
    AIAEventType["AIA_LEAVE_SESSION"] = "AIA_LEAVE_SESSION";
    // Eventos de salida (servidor -> cliente)
    AIAEventType["AIA_RESPONSE"] = "AIA_RESPONSE";
    AIAEventType["AIA_PROGRESS"] = "AIA_PROGRESS";
    AIAEventType["AIA_TYPING"] = "AIA_TYPING";
    AIAEventType["AIA_ERROR"] = "AIA_ERROR";
    AIAEventType["AIA_SESSION_CREATED"] = "AIA_SESSION_CREATED";
    AIAEventType["AIA_SESSION_ENDED"] = "AIA_SESSION_ENDED";
    // Eventos de estado
    AIAEventType["AIA_TOOL_EXECUTING"] = "AIA_TOOL_EXECUTING";
    AIAEventType["AIA_TOOL_COMPLETED"] = "AIA_TOOL_COMPLETED";
    AIAEventType["AIA_PROCESSING_COMPLETE"] = "AIA_PROCESSING_COMPLETE";
})(AIAEventType || (exports.AIAEventType = AIAEventType = {}));
// Constantes para progreso
exports.AIA_PROGRESS_STAGES = {
    ANALYZING: {
        stage: 'analyzing',
        message: '🤖 Analizando tu consulta...',
        progress: 10,
    },
    QUERYING: {
        stage: 'querying',
        message: '📊 Consultando información...',
        progress: 40,
    },
    PROCESSING: {
        stage: 'processing',
        message: '⚡ Procesando datos...',
        progress: 70,
    },
    GENERATING: {
        stage: 'generating',
        message: '💡 Generando respuesta...',
        progress: 90,
    },
};
