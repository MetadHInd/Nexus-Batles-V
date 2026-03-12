"use strict";
/**
 * Eventos específicos para GALATEA (AI Assistant) WebSocket
 * Extiende el sistema genérico de eventos para chat con AI
 * Sistema integrado con Event Bus para pub/sub
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GALATEA_PROGRESS_STAGES = exports.GALATEAEventType = void 0;
var GALATEAEventType;
(function (GALATEAEventType) {
    // Eventos de entrada (cliente -> servidor)
    GALATEAEventType["GALATEA_QUERY"] = "GALATEA_QUERY";
    GALATEAEventType["GALATEA_JOIN_SESSION"] = "GALATEA_JOIN_SESSION";
    GALATEAEventType["GALATEA_LEAVE_SESSION"] = "GALATEA_LEAVE_SESSION";
    // Eventos de salida (servidor -> cliente)
    GALATEAEventType["GALATEA_RESPONSE"] = "GALATEA_RESPONSE";
    GALATEAEventType["GALATEA_PROGRESS"] = "GALATEA_PROGRESS";
    GALATEAEventType["GALATEA_TYPING"] = "GALATEA_TYPING";
    GALATEAEventType["GALATEA_ERROR"] = "GALATEA_ERROR";
    GALATEAEventType["GALATEA_SESSION_CREATED"] = "GALATEA_SESSION_CREATED";
    GALATEAEventType["GALATEA_SESSION_ENDED"] = "GALATEA_SESSION_ENDED";
    // Eventos de estado
    GALATEAEventType["GALATEA_TOOL_EXECUTING"] = "GALATEA_TOOL_EXECUTING";
    GALATEAEventType["GALATEA_TOOL_COMPLETED"] = "GALATEA_TOOL_COMPLETED";
    GALATEAEventType["GALATEA_PROCESSING_COMPLETE"] = "GALATEA_PROCESSING_COMPLETE";
})(GALATEAEventType || (exports.GALATEAEventType = GALATEAEventType = {}));
// Constantes para progreso
exports.GALATEA_PROGRESS_STAGES = {
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
