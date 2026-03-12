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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotBubble = ChatbotBubble;
/**
 * ChatbotBubble.tsx — Burbuja de Chatbot Global Persistente
 *
 * ARQUITECTURA:
 *   - Renderizado en MainLayout → aparece en TODAS las páginas (incluso Shop/Pagos)
 *   - Lee chatbotStore (mensajes, estado typing, unread)
 *   - Lee playerStore solo para contexto de bienvenida — NO interfiere con pagos
 *   - Comunicación con Shop: solo vía <Link to="/shop"> en mensajes del bot
 *   - position: fixed → z-index 9999 → nunca bloqueado por ningún módulo
 */
var react_1 = require("react");
var chatbotStore_1 = require("@/store/chatbotStore");
var playerStore_1 = require("@/store/playerStore");
var authStore_1 = require("@/store/authStore");
var SUGGESTIONS = [
    '¿Qué héroes hay disponibles?',
    '¿Cómo funciona el sistema de subastas?',
    '¿Cuáles son los mejores ítems?',
    '¿Cómo completo misiones?',
    '¿Qué puedo comprar en la tienda?',
];
function formatTime(date) {
    return date.getHours().toString().padStart(2, '0') + ':' +
        date.getMinutes().toString().padStart(2, '0');
}
function ChatbotBubble() {
    var _this = this;
    var _a, _b;
    var _c = (0, chatbotStore_1.useChatbotStore)(), isOpen = _c.isOpen, isTyping = _c.isTyping, messages = _c.messages, unreadCount = _c.unreadCount, toggle = _c.toggle, sendMessage = _c.sendMessage, clearHistory = _c.clearHistory;
    var profile = (0, playerStore_1.usePlayerStore)(function (s) { return s.profile; });
    var player = (0, authStore_1.useAuthStore)().player;
    var _d = (0, react_1.useState)(''), input = _d[0], setInput = _d[1];
    var messagesEndRef = (0, react_1.useRef)(null);
    var inputRef = (0, react_1.useRef)(null);
    var username = (_b = (_a = player === null || player === void 0 ? void 0 : player.username) !== null && _a !== void 0 ? _a : profile === null || profile === void 0 ? void 0 : profile.username) !== null && _b !== void 0 ? _b : 'Aventurero';
    // Auto-scroll al último mensaje
    (0, react_1.useEffect)(function () {
        var _a;
        if (isOpen) {
            (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, isOpen]);
    // Focus al abrir
    (0, react_1.useEffect)(function () {
        if (isOpen) {
            setTimeout(function () { var _a; return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus(); }, 100);
        }
    }, [isOpen]);
    var handleSend = function () { return __awaiter(_this, void 0, void 0, function () {
        var text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    text = input.trim();
                    if (!text)
                        return [2 /*return*/];
                    setInput('');
                    return [4 /*yield*/, sendMessage(text)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleKey = function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    var handleSuggestion = function (text) {
        sendMessage(text);
    };
    var showSuggestions = messages.length === 0 && !isTyping;
    return (<div className="chatbot-root">
      {/* ── Orb flotante ──────────────────────────────── */}
      <button className={"chatbot-orb".concat(isOpen ? ' chatbot-orb--open' : '')} onClick={toggle} aria-label={isOpen ? 'Cerrar NexusBot' : 'Abrir NexusBot'} title="NexusBot — Oráculo del Nexus">
        <div className="chatbot-orb__pulse"/>
        <span className="chatbot-orb__icon">{isOpen ? '✕' : '⚔'}</span>
        {unreadCount > 0 && !isOpen && (<span className="chatbot-orb__badge">{unreadCount}</span>)}
      </button>

      {/* ── Ventana del chat ──────────────────────────── */}
      <div className={"chatbot-window".concat(isOpen ? ' chatbot-window--open' : '')} role="dialog" aria-label="NexusBot — Oráculo del Nexus" aria-hidden={!isOpen}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header__left">
            <div className="chatbot-header__avatar">N</div>
            <div>
              <div className="chatbot-header__title">NexusBot</div>
              <div className="chatbot-header__subtitle">
                {isTyping ? 'Consultando el oráculo…' : 'En línea'}
              </div>
            </div>
          </div>
          <div className="chatbot-header__actions">
            <button className="chatbot-header__btn" onClick={clearHistory} title="Limpiar historial">
              🗑
            </button>
            <button className="chatbot-header__btn" onClick={toggle} title="Cerrar">
              ✕
            </button>
          </div>
        </div>

        {/* Mensajes */}
        <div className="chatbot-messages">
          {/* Mensaje de bienvenida */}
          {messages.length === 0 && (<div className="chatbot-welcome">
              <div className="chatbot-welcome__icon">🔮</div>
              <div className="chatbot-welcome__title">Salve, {username}</div>
              <div className="chatbot-welcome__text">
                Soy el oráculo del Nexus. Pregúntame sobre héroes, ítems,
                misiones o cómo conquistar el campo de batalla.
              </div>
            </div>)}

          {/* Historial de mensajes */}
          {messages.map(function (msg) { return (<div key={msg.id} className={"chatbot-msg chatbot-msg--".concat(msg.role).concat(msg.isError ? ' chatbot-msg--error' : '')}>
              {msg.role === 'assistant' && (<div className="chatbot-msg__avatar">N</div>)}
              <div className="chatbot-msg__bubble">
                <div className="chatbot-msg__content">{msg.content}</div>
                <div className="chatbot-msg__time">{formatTime(msg.timestamp)}</div>
              </div>
            </div>); })}

          {/* Typing indicator */}
          {isTyping && (<div className="chatbot-msg chatbot-msg--assistant">
              <div className="chatbot-msg__avatar">N</div>
              <div className="chatbot-msg__bubble">
                <div className="chatbot-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>)}

          <div ref={messagesEndRef}/>
        </div>

        {/* Sugerencias rápidas */}
        {showSuggestions && (<div className="chatbot-suggestions">
            {SUGGESTIONS.map(function (s) { return (<button key={s} className="chatbot-suggestion" onClick={function () { return handleSuggestion(s); }}>
                {s}
              </button>); })}
          </div>)}

        {/* Input */}
        <div className="chatbot-input-area">
          <input ref={inputRef} className="chatbot-input" type="text" value={input} onChange={function (e) { return setInput(e.target.value); }} onKeyDown={handleKey} placeholder="Pregunta al oráculo del Nexus…" maxLength={500} disabled={isTyping} aria-label="Mensaje para NexusBot"/>
          <button className="chatbot-send" onClick={handleSend} disabled={isTyping || !input.trim()} aria-label="Enviar mensaje" title="Enviar">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>);
}
