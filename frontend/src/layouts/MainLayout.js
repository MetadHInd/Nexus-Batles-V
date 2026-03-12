"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainLayout = MainLayout;
/**
 * MainLayout.tsx — Layout principal de la aplicación
 *
 * ESTRUCTURA:
 *   ┌──────────────────────────── Navbar (fixed) ─────────────────────────────┐
 *   │ Logo │ Nav Links │ Coins │ ChatbotBtn │ Avatar                          │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *   ┌─────────────────┬───────────────────────────────────────────────────────┐
 *   │ Sidebar (sticky)│  <Outlet /> — Contenido de la página actual           │
 *   │ Player card     │                                                        │
 *   │ Stats           │                                                        │
 *   │ Nav             │                                                        │
 *   └─────────────────┴───────────────────────────────────────────────────────┘
 *                                              ChatbotBubble (fixed bottom-right)
 *
 * CICLO DE VIDA:
 *   - Al montar: carga el perfil del jugador (playerStore.fetchProfile)
 *   - Al autenticar: sincroniza sessionId del bot con userId
 *   - Al hacer logout: limpia ambos stores
 */
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var Navbar_1 = require("@/components/layout/Navbar");
var Sidebar_1 = require("@/components/layout/Sidebar");
var ChatbotBubble_1 = require("@/components/chatbot/ChatbotBubble");
var authStore_1 = require("@/store/authStore");
var playerStore_1 = require("@/store/playerStore");
var chatbotStore_1 = require("@/store/chatbotStore");
require("@/components/layout/layout.css");
require("@/components/chatbot/ChatbotBubble.css");
function MainLayout() {
    var _a = (0, authStore_1.useAuthStore)(), player = _a.player, isAuthenticated = _a.isAuthenticated;
    var fetchProfile = (0, playerStore_1.usePlayerStore)().fetchProfile;
    var setSession = (0, chatbotStore_1.useChatbotStore)().setSession;
    // Hidrata datos del jugador y conecta sesión del chatbot al montar
    (0, react_1.useEffect)(function () {
        if (isAuthenticated) {
            fetchProfile();
        }
    }, [isAuthenticated, fetchProfile]);
    // Sincroniza sessionId del chatbot con el userId real del jugador
    (0, react_1.useEffect)(function () {
        if (player === null || player === void 0 ? void 0 : player.id) {
            setSession(player.id);
        }
    }, [player === null || player === void 0 ? void 0 : player.id, setSession]);
    return (<div className="nbv-layout">
      {/* Runas flotantes de fondo */}
      <div className="rune-bg" aria-hidden="true">
        <span>⚔</span>
        <span>⚜</span>
        <span>🔮</span>
        <span>⚡</span>
        <span>✦</span>
        <span>◈</span>
      </div>

      {/* Navbar fijo */}
      <Navbar_1.Navbar />

      {/* Cuerpo: Sidebar + Contenido */}
      <div className="nbv-layout__body">
        <Sidebar_1.Sidebar />
        <main className="nbv-layout__main">
          <react_router_dom_1.Outlet />
        </main>
      </div>

      {/* Chatbot — SIEMPRE presente, independiente de la ruta activa */}
      <ChatbotBubble_1.ChatbotBubble />
    </div>);
}
