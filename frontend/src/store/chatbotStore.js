"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChatbotStore = void 0;
/**
 * chatbotStore.ts — Estado Global del Chatbot
 * AISLADO del módulo de pagos. Comunicación con Shop: vía router.push() únicamente.
 *
 * Conecta con:
 *   - authStore → player.id como sessionId para persistir historial
 *   - playerStore → perfil del jugador para personalizar respuestas del bot
 *   - Python API (puerto 8000) → /api/v1/chatbot/sessions/:id/messages
 */
var zustand_1 = require("zustand");
var CHATBOT_API = ((_a = import.meta.env.VITE_CHATBOT_API_URL) !== null && _a !== void 0 ? _a : 'http://localhost:8000') + '/api/v1/chatbot';
function makeId() {
    return Math.random().toString(36).slice(2, 11);
}
exports.useChatbotStore = (0, zustand_1.create)(function (set, get) { return ({
    isOpen: false,
    isTyping: false,
    messages: [],
    sessionId: null,
    unreadCount: 0,
    error: null,
    open: function () { return set({ isOpen: true, unreadCount: 0 }); },
    close: function () { return set({ isOpen: false }); },
    toggle: function () {
        var isOpen = get().isOpen;
        if (!isOpen) {
            set({ isOpen: true, unreadCount: 0 });
        }
        else {
            set({ isOpen: false });
        }
    },
    markRead: function () { return set({ unreadCount: 0 }); },
    // Llamado desde App.tsx cuando el usuario hace login
    setSession: function (userId) {
        set({ sessionId: userId, messages: [] });
    },
    sendMessage: function (text) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, sessionId, messages, userMsg, res, data, botContent, botMsg_1, err_1, errMsg_1;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = get(), sessionId = _a.sessionId, messages = _a.messages;
                    if (!text.trim() || !sessionId)
                        return [2 /*return*/];
                    userMsg = {
                        id: makeId(),
                        role: 'user',
                        content: text.trim(),
                        timestamp: new Date(),
                    };
                    set({
                        messages: __spreadArray(__spreadArray([], messages, true), [userMsg], false),
                        isTyping: true,
                        error: null,
                    });
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("".concat(CHATBOT_API, "/sessions/").concat(sessionId, "/messages"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: "Bearer ".concat((_b = localStorage.getItem('accessToken')) !== null && _b !== void 0 ? _b : ''),
                            },
                            body: JSON.stringify({ message: text.trim() }),
                        })];
                case 2:
                    res = _f.sent();
                    if (!res.ok)
                        throw new Error("HTTP ".concat(res.status));
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _f.sent();
                    botContent = (_e = (_d = (_c = data === null || data === void 0 ? void 0 : data.data) === null || _c === void 0 ? void 0 : _c.reply) !== null && _d !== void 0 ? _d : data === null || data === void 0 ? void 0 : data.reply) !== null && _e !== void 0 ? _e : 'El oráculo guarda silencio...';
                    botMsg_1 = {
                        id: makeId(),
                        role: 'assistant',
                        content: botContent,
                        timestamp: new Date(),
                    };
                    set(function (state) { return ({
                        messages: __spreadArray(__spreadArray([], state.messages, true), [botMsg_1], false),
                        isTyping: false,
                        // Si el chat está cerrado, incrementar no-leídos
                        unreadCount: state.isOpen ? 0 : state.unreadCount + 1,
                    }); });
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _f.sent();
                    errMsg_1 = {
                        id: makeId(),
                        role: 'assistant',
                        content: 'El oráculo no puede responder en este momento. Intenta de nuevo.',
                        timestamp: new Date(),
                        isError: true,
                    };
                    set(function (state) { return ({
                        messages: __spreadArray(__spreadArray([], state.messages, true), [errMsg_1], false),
                        isTyping: false,
                        error: err_1.message,
                    }); });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); },
    clearHistory: function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionId, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    sessionId = get().sessionId;
                    if (!sessionId)
                        return [2 /*return*/];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, fetch("".concat(CHATBOT_API, "/sessions/").concat(sessionId), {
                            method: 'DELETE',
                            headers: {
                                Authorization: "Bearer ".concat((_b = localStorage.getItem('accessToken')) !== null && _b !== void 0 ? _b : ''),
                            },
                        })];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 5];
                case 3:
                    _a = _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    set({ messages: [] });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); },
}); });
