"use strict";
/**
 * RankingsPage.tsx — Tabla de Honor del Nexus
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RankingsPage;
var react_1 = require("react");
var players_1 = require("@/api/players");
var authStore_1 = require("@/store/authStore");
var ROLE_CONFIG = {
    ADMIN: { label: 'Admin', cls: 'nbv-badge-gold' },
    MODERATOR: { label: 'Mod', cls: 'nbv-badge-arcane' },
    PLAYER: { label: 'Jugador', cls: 'nbv-badge-gray' },
};
function RankingsPage() {
    var _a = (0, react_1.useState)([]), players = _a[0], setPlayers = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var player = (0, authStore_1.useAuthStore)().player;
    (0, react_1.useEffect)(function () {
        players_1.playersApi.getRankings(50)
            .then(function (r) { return setPlayers(r.data.data); })
            .catch(function () { })
            .finally(function () { return setLoading(false); });
    }, []);
    return (<div className="page-content fade-in">
      <div className="page-header">
        <h1 className="page-title">👑 Tabla de Honor</h1>
        <p className="page-subtitle">Los guerreros más poderosos del Nexus</p>
      </div>

      <div className="nbv-divider"><span className="nbv-divider-icon">⚜</span></div>

      {loading ? (<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {Array.from({ length: 10 }).map(function (_, i) { return (<div key={i} className="nbv-skeleton" style={{ height: 52, borderRadius: 2 }}/>); })}
        </div>) : (<div style={{
                background: 'linear-gradient(145deg, var(--stone-dark), var(--dungeon))',
                border: '1px solid rgba(200,134,10,0.2)',
                overflow: 'hidden',
            }}>
          {/* Header */}
          <div style={{
                display: 'grid', gridTemplateColumns: '60px 1fr 120px 120px 80px',
                padding: '0.7rem 1.2rem',
                background: 'rgba(0,0,0,0.4)',
                borderBottom: '1px solid rgba(200,134,10,0.2)',
                fontFamily: 'var(--font-heading)', fontSize: '0.62rem',
                letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase',
            }}>
            <span>Puesto</span>
            <span>Guerrero</span>
            <span style={{ textAlign: 'right' }}>Monedas</span>
            <span style={{ textAlign: 'right' }}>XP</span>
            <span style={{ textAlign: 'right' }}>Rol</span>
          </div>

          {players.length === 0 ? (<div style={{ padding: '3rem', textAlign: 'center', color: 'var(--rune-gray)', fontStyle: 'italic' }}>
              No hay datos de ranking disponibles
            </div>) : (players.map(function (p, i) {
                var _a, _b, _c, _d, _e;
                var isMe = p.id === (player === null || player === void 0 ? void 0 : player.id);
                var pos = i + 1;
                var roleConf = (_a = ROLE_CONFIG[p.role]) !== null && _a !== void 0 ? _a : ROLE_CONFIG.PLAYER;
                return (<div key={p.id} style={{
                        display: 'grid',
                        gridTemplateColumns: '60px 1fr 120px 120px 80px',
                        padding: '0.75rem 1.2rem',
                        borderBottom: '1px solid rgba(200,134,10,0.06)',
                        background: isMe
                            ? 'rgba(200,134,10,0.06)'
                            : pos <= 3 ? 'rgba(200,134,10,0.03)' : 'transparent',
                        alignItems: 'center',
                        transition: 'background 0.15s',
                    }}>
                  {/* Position */}
                  <span style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: pos <= 3 ? '1.1rem' : '0.85rem',
                        color: pos === 1 ? 'var(--gold-light)' : pos === 2 ? '#C0C0C0' : pos === 3 ? '#CD7F32' : 'var(--rune-gray)',
                        fontWeight: pos <= 3 ? 700 : 400,
                    }}>
                    {pos === 1 ? '👑' : pos === 2 ? '⚔' : pos === 3 ? '🛡' : "#".concat(pos)}
                  </span>

                  {/* Username */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--arcane), var(--crimson))',
                        border: "1px solid ".concat(pos <= 3 ? 'var(--gold-dark)' : 'var(--stone-light)'),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-heading)', fontSize: '0.7rem', color: 'var(--gold-light)',
                        flexShrink: 0,
                    }}>
                      {p.username.charAt(0).toUpperCase()}
                    </div>
                    <span style={{
                        fontFamily: 'var(--font-heading)', fontSize: '0.82rem',
                        color: isMe ? 'var(--gold-light)' : 'var(--parchment)',
                        letterSpacing: '0.04em',
                    }}>
                      {p.username}
                      {isMe && <span style={{ marginLeft: '0.4rem', fontSize: '0.6rem', color: 'var(--gold)', letterSpacing: '0.15em' }}>(tú)</span>}
                    </span>
                  </div>

                  {/* Gold */}
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.78rem', color: 'var(--gold-bright)', textAlign: 'right' }}>
                    ✦ {(_c = (_b = p.gold) === null || _b === void 0 ? void 0 : _b.toLocaleString()) !== null && _c !== void 0 ? _c : 0}
                  </span>

                  {/* XP */}
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.78rem', color: 'var(--arcane-glow)', textAlign: 'right' }}>
                    {(_e = (_d = p.xp) === null || _d === void 0 ? void 0 : _d.toLocaleString()) !== null && _e !== void 0 ? _e : 0}
                  </span>

                  {/* Role */}
                  <div style={{ textAlign: 'right' }}>
                    <span className={"nbv-badge ".concat(roleConf.cls)}>{roleConf.label}</span>
                  </div>
                </div>);
            }))}
        </div>)}
    </div>);
}
