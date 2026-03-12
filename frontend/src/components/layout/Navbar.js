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
exports.Navbar = Navbar;
/**
 * Navbar.tsx — Barra de navegación superior
 * Lee: authStore (usuario) + playerStore (monedas/rango en tiempo real)
 * Incluye: logo, nav links, contador de monedas, avatar, logout
 */
var react_router_dom_1 = require("react-router-dom");
var authStore_1 = require("@/store/authStore");
var playerStore_1 = require("@/store/playerStore");
var chatbotStore_1 = require("@/store/chatbotStore");
var NAV_LINKS = [
    { to: '/dashboard', label: 'Panel', icon: '⚜' },
    { to: '/shop', label: 'Tienda', icon: '🏪' },
    { to: '/auctions', label: 'Subastas', icon: '⚔' },
    { to: '/missions', label: 'Misiones', icon: '🔮' },
    { to: '/inventory', label: 'Inventario', icon: '🎒' },
    { to: '/rankings', label: 'Ranking', icon: '👑' },
];
function Navbar() {
    var _this = this;
    var _a, _b, _c, _d;
    var _e = (0, authStore_1.useAuthStore)(), player = _e.player, logout = _e.logout;
    var profile = (0, playerStore_1.usePlayerStore)(function (s) { return s.profile; });
    var unreadCount = (0, chatbotStore_1.useChatbotStore)(function (s) { return s.unreadCount; });
    var toggleChatbot = (0, chatbotStore_1.useChatbotStore)(function (s) { return s.toggle; });
    var navigate = (0, react_router_dom_1.useNavigate)();
    var coins = (_a = profile === null || profile === void 0 ? void 0 : profile.gold) !== null && _a !== void 0 ? _a : 0;
    var displayName = (_c = (_b = player === null || player === void 0 ? void 0 : player.username) !== null && _b !== void 0 ? _b : profile === null || profile === void 0 ? void 0 : profile.username) !== null && _c !== void 0 ? _c : '…';
    var initial = displayName.charAt(0).toUpperCase();
    var handleLogout = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, logout()];
                case 1:
                    _a.sent();
                    navigate('/login');
                    return [2 /*return*/];
            }
        });
    }); };
    return (<nav className="nbv-navbar">
      {/* Logo */}
      <react_router_dom_1.NavLink to="/dashboard" className="nbv-navbar__logo">
        ⚔ Nexus Battles
      </react_router_dom_1.NavLink>

      {/* Links */}
      <ul className="nbv-navbar__links">
        {NAV_LINKS.map(function (_a) {
            var to = _a.to, label = _a.label, icon = _a.icon;
            return (<li key={to}>
            <react_router_dom_1.NavLink to={to} className={function (_a) {
                    var isActive = _a.isActive;
                    return "nbv-navbar__link".concat(isActive ? ' nbv-navbar__link--active' : '');
                }}>
              <span className="nbv-navbar__link-icon">{icon}</span>
              {label}
            </react_router_dom_1.NavLink>
          </li>);
        })}
      </ul>

      {/* Right side */}
      <div className="nbv-navbar__right">
        {/* Monedas */}
        <div className="nbv-coins">
          <span className="nbv-coins-icon">✦</span>
          <span>{coins.toLocaleString()}</span>
        </div>

        {/* Chatbot trigger con badge */}
        <button className="nbv-navbar__chatbot-btn" onClick={toggleChatbot} title="NexusBot — Oráculo" aria-label="Abrir chatbot">
          🔮
          {unreadCount > 0 && (<span className="nbv-navbar__chatbot-badge">{unreadCount}</span>)}
        </button>

        {/* Avatar + dropdown */}
        <div className="nbv-navbar__avatar-wrap">
          <button className="nbv-navbar__avatar" title={displayName}>
            {initial}
          </button>
          <div className="nbv-navbar__dropdown">
            <div className="nbv-navbar__dropdown-name">{displayName}</div>
            <div className="nbv-navbar__dropdown-role">
              {(_d = player === null || player === void 0 ? void 0 : player.role) !== null && _d !== void 0 ? _d : 'PLAYER'}
            </div>
            <div className="nbv-divider" style={{ margin: '0.5rem 0' }}>
              <span className="nbv-divider-icon" style={{ fontSize: '0.6rem' }}>⚔</span>
            </div>
            <react_router_dom_1.NavLink to="/profile" className="nbv-navbar__dropdown-item">
              ◈ Mi Perfil
            </react_router_dom_1.NavLink>
            <button className="nbv-navbar__dropdown-item nbv-navbar__dropdown-item--danger" onClick={handleLogout}>
              ✗ Salir del Nexus
            </button>
          </div>
        </div>
      </div>
    </nav>);
}
