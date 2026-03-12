"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = Sidebar;
/**
 * Sidebar.tsx — Panel lateral izquierdo
 * Muestra: tarjeta del jugador, barra de XP, stats rápidos, navegación secundaria
 * Lee: playerStore (datos en tiempo real)
 */
var react_router_dom_1 = require("react-router-dom");
var playerStore_1 = require("@/store/playerStore");
var authStore_1 = require("@/store/authStore");
var SIDEBAR_LINKS = [
    { to: '/dashboard', label: 'Panel de Control', icon: '⚜' },
    { to: '/shop', label: 'Tienda Imperial', icon: '🏪' },
    { to: '/auctions', label: 'Casa de Subastas', icon: '⚔' },
    { to: '/missions', label: 'Misiones Arcanas', icon: '🔮' },
    { to: '/inventory', label: 'Inventario', icon: '🎒' },
    { to: '/rankings', label: 'Tabla de Honor', icon: '👑' },
    { to: '/profile', label: 'Mi Pergamino', icon: '📜' },
];
function getRankTitle(rank) {
    if (rank >= 100)
        return 'Leyenda Inmortal';
    if (rank >= 75)
        return 'Campeón del Nexus';
    if (rank >= 50)
        return 'Veterano de Guerra';
    if (rank >= 25)
        return 'Caballero Arcano';
    if (rank >= 10)
        return 'Escudero Valiente';
    return 'Recluta';
}
function Sidebar() {
    var _a, _b, _c, _d, _e, _f;
    var player = (0, authStore_1.useAuthStore)().player;
    var _g = (0, playerStore_1.usePlayerStore)(), profile = _g.profile, isLoading = _g.isLoading;
    var username = (_b = (_a = player === null || player === void 0 ? void 0 : player.username) !== null && _a !== void 0 ? _a : profile === null || profile === void 0 ? void 0 : profile.username) !== null && _b !== void 0 ? _b : '…';
    var rank = (_c = profile === null || profile === void 0 ? void 0 : profile.rank) !== null && _c !== void 0 ? _c : 0;
    var gold = (_d = profile === null || profile === void 0 ? void 0 : profile.gold) !== null && _d !== void 0 ? _d : 0;
    var xp = (_e = profile === null || profile === void 0 ? void 0 : profile.xp) !== null && _e !== void 0 ? _e : 0;
    var initial = username.charAt(0).toUpperCase();
    // XP simulado como porcentaje (en producción vendrá del backend)
    var xpPercent = Math.min((xp % 1000) / 10, 100);
    return (<aside className="nbv-sidebar">
      {/* Tarjeta del jugador */}
      <div className="nbv-sidebar__player-card">
        <div className="nbv-sidebar__avatar">
          {isLoading ? '⋯' : initial}
        </div>
        <div className="nbv-sidebar__player-name">
          {isLoading ? <span className="nbv-skeleton" style={{ height: '14px', width: '80px', display: 'block' }}/> : username}
        </div>
        <div className="nbv-sidebar__player-rank">
          {getRankTitle(rank)}
        </div>
        {/* Barra de XP */}
        <div className="nbv-sidebar__xp-label">
          XP — {xp.toLocaleString()}
        </div>
        <div className="nbv-progress-track" style={{ marginTop: '0.4rem' }}>
          <div className="nbv-progress-fill" style={{ width: "".concat(xpPercent, "%") }}/>
        </div>
      </div>

      {/* Stats rápidos */}
      <div className="nbv-sidebar__stats">
        <div className="nbv-sidebar__stats-label">Estadísticas</div>
        <div className="nbv-sidebar__stat">
          <span>Rango</span>
          <span className="nbv-sidebar__stat-val text-gold">#{rank}</span>
        </div>
        <div className="nbv-sidebar__stat">
          <span>Monedas</span>
          <span className="nbv-sidebar__stat-val text-gold">✦ {gold.toLocaleString()}</span>
        </div>
        <div className="nbv-sidebar__stat">
          <span>Rol</span>
          <span className="nbv-sidebar__stat-val">
            <span className="nbv-badge nbv-badge-arcane" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>
              {(_f = player === null || player === void 0 ? void 0 : player.role) !== null && _f !== void 0 ? _f : 'PLAYER'}
            </span>
          </span>
        </div>
      </div>

      {/* Navegación */}
      <nav className="nbv-sidebar__nav">
        <div className="nbv-sidebar__stats-label" style={{ marginBottom: '0.5rem' }}>Navegación</div>
        {SIDEBAR_LINKS.map(function (_a) {
            var to = _a.to, label = _a.label, icon = _a.icon;
            return (<react_router_dom_1.NavLink key={to} to={to} className={function (_a) {
                    var isActive = _a.isActive;
                    return "nbv-sidebar__link".concat(isActive ? ' nbv-sidebar__link--active' : '');
                }}>
            <span className="nbv-sidebar__link-icon">{icon}</span>
            {label}
          </react_router_dom_1.NavLink>);
        })}
      </nav>
    </aside>);
}
