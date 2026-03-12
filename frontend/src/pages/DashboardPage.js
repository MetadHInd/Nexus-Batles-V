"use strict";
/**
 * DashboardPage.tsx — Panel principal del jugador
 * Reemplaza el placeholder con una página real.
 * Lee: playerStore + API calls a missions y auctions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardPage;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var playerStore_1 = require("@/store/playerStore");
var authStore_1 = require("@/store/authStore");
var missions_1 = require("@/api/missions");
var auctions_1 = require("@/api/auctions");
var RARITY_COLOR = {
    COMMON: 'var(--rarity-common)',
    RARE: 'var(--ice-bright)',
    EPIC: 'var(--arcane-glow)',
    LEGENDARY: 'var(--gold-light)',
};
var STATUS_CONFIG = {
    ACTIVE: { label: 'Activa', cls: 'nbv-badge-arcane' },
    COMPLETED: { label: 'Completada', cls: 'nbv-badge-emerald' },
    FAILED: { label: 'Fallida', cls: 'nbv-badge-crimson' },
    EXPIRED: { label: 'Expirada', cls: 'nbv-badge-gray' },
};
function DashboardPage() {
    var _a, _b, _c, _d, _e, _f;
    var player = (0, authStore_1.useAuthStore)().player;
    var _g = (0, playerStore_1.usePlayerStore)(), profile = _g.profile, profileLoading = _g.isLoading;
    var _h = (0, react_1.useState)([]), missions = _h[0], setMissions = _h[1];
    var _j = (0, react_1.useState)([]), auctions = _j[0], setAuctions = _j[1];
    var _k = (0, react_1.useState)(true), loading = _k[0], setLoading = _k[1];
    var username = (_b = (_a = player === null || player === void 0 ? void 0 : player.username) !== null && _a !== void 0 ? _a : profile === null || profile === void 0 ? void 0 : profile.username) !== null && _b !== void 0 ? _b : 'Aventurero';
    var gold = (_c = profile === null || profile === void 0 ? void 0 : profile.gold) !== null && _c !== void 0 ? _c : 0;
    var rank = (_d = profile === null || profile === void 0 ? void 0 : profile.rank) !== null && _d !== void 0 ? _d : 0;
    var xp = (_e = profile === null || profile === void 0 ? void 0 : profile.xp) !== null && _e !== void 0 ? _e : 0;
    var xpPct = Math.min((xp % 1000) / 10, 100);
    (0, react_1.useEffect)(function () {
        Promise.allSettled([
            missions_1.missionsApi.getActive().then(function (r) { return setMissions(r.data.data.slice(0, 3)); }),
            auctions_1.auctionsApi.getAll({ limit: 4 }).then(function (r) { return setAuctions(r.data.data); }),
        ]).finally(function () { return setLoading(false); });
    }, []);
    return (<div className="page-content fade-in">

      {/* ── Header de bienvenida ─────────────────────────────── */}
      <div className="dashboard-hero">
        <div className="dashboard-hero__torches" aria-hidden="true">
          <TorchDecor /> <TorchDecor />
        </div>
        <div className="dashboard-hero__content">
          <div className="dashboard-hero__eyebrow">⚜ Panel del Guerrero ⚜</div>
          <h1 className="dashboard-hero__title">
            Salve, {username}
          </h1>
          <p className="dashboard-hero__sub">
            {rank > 0 ? "Rango #".concat(rank, " en el Nexus") : 'Recluta del Nexus'}
          </p>
        </div>
      </div>

      {/* ── Stats rápidos ─────────────────────────────────────── */}
      <div className="dashboard-stats">
        <StatCard icon="✦" label="Monedas de Oro" value={gold.toLocaleString()} color="var(--gold)"/>
        <StatCard icon="👑" label="Posición Global" value={rank > 0 ? "#".concat(rank) : 'Sin rango'} color="var(--gold-light)"/>
        <StatCard icon="⚡" label="Puntos de XP" value={xp.toLocaleString()} color="var(--arcane-glow)"/>
        <StatCard icon="🎒" label="Rol" value={(_f = player === null || player === void 0 ? void 0 : player.role) !== null && _f !== void 0 ? _f : 'PLAYER'} color="var(--ice-bright)"/>
      </div>

      {/* ── Barra de XP ───────────────────────────────────────── */}
      <div className="dashboard-xp-section">
        <div className="dashboard-xp-label">
          <span className="font-heading" style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase' }}>
            Progreso de XP
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--parchment-dim)' }}>
            {xp % 1000} / 1000
          </span>
        </div>
        <div className="nbv-progress-track">
          <div className="nbv-progress-fill" style={{ width: "".concat(xpPct, "%") }}/>
        </div>
      </div>

      {/* ── Grid principal ────────────────────────────────────── */}
      <div className="dashboard-grid">

        {/* Misiones activas */}
        <section className="dashboard-section">
          <div className="dashboard-section__header">
            <h2 className="dashboard-section__title">🔮 Misiones Arcanas</h2>
            <react_router_dom_1.Link to="/missions" className="dashboard-section__link">Ver todas →</react_router_dom_1.Link>
          </div>

          {loading ? (<SkeletonList count={3}/>) : missions.length === 0 ? (<EmptyState icon="🔮" text="No tienes misiones activas" action={<react_router_dom_1.Link to="/missions" className="nbv-btn nbv-btn-arcane" style={{ marginTop: '0.8rem', display: 'inline-flex' }}>Generar Misión</react_router_dom_1.Link>}/>) : (<div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {missions.map(function (m) { return (<MissionRow key={m.id} mission={m}/>); })}
            </div>)}
        </section>

        {/* Subastas recientes */}
        <section className="dashboard-section">
          <div className="dashboard-section__header">
            <h2 className="dashboard-section__title">⚔ Subastas Activas</h2>
            <react_router_dom_1.Link to="/auctions" className="dashboard-section__link">Ver todas →</react_router_dom_1.Link>
          </div>

          {loading ? (<SkeletonList count={4}/>) : auctions.length === 0 ? (<EmptyState icon="⚔" text="No hay subastas activas ahora"/>) : (<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {auctions.map(function (a) { return (<AuctionRow key={a.id} auction={a}/>); })}
            </div>)}
        </section>

      </div>

      {/* ── Acciones rápidas ──────────────────────────────────── */}
      <div className="dashboard-actions">
        <div className="nbv-divider"><span className="nbv-divider-icon">⚜</span></div>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1.5rem' }}>
          <react_router_dom_1.Link to="/shop" className="nbv-btn nbv-btn-primary">🏪 Visitar Tienda</react_router_dom_1.Link>
          <react_router_dom_1.Link to="/missions" className="nbv-btn nbv-btn-arcane">🔮 Ver Misiones</react_router_dom_1.Link>
          <react_router_dom_1.Link to="/auctions" className="nbv-btn nbv-btn-ghost">⚔ Ir a Subastas</react_router_dom_1.Link>
          <react_router_dom_1.Link to="/inventory" className="nbv-btn nbv-btn-ghost">🎒 Mi Inventario</react_router_dom_1.Link>
        </div>
      </div>

      <style>{"\n        .dashboard-hero {\n          position: relative;\n          text-align: center;\n          padding: 3rem 2rem 2.5rem;\n          margin-bottom: 2rem;\n          border-bottom: 1px solid rgba(200,134,10,0.2);\n          background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(200,134,10,0.06) 0%, transparent 70%);\n          overflow: hidden;\n        }\n        .dashboard-hero__torches {\n          position: absolute;\n          top: 50%;\n          transform: translateY(-50%);\n          width: 100%;\n          display: flex;\n          justify-content: space-between;\n          padding: 0 5%;\n          pointer-events: none;\n        }\n        .dashboard-hero__content { position: relative; z-index: 1; }\n        .dashboard-hero__eyebrow {\n          font-family: var(--font-heading);\n          font-size: 0.75rem;\n          letter-spacing: 0.5em;\n          color: var(--gold);\n          opacity: 0.8;\n          margin-bottom: 0.6rem;\n          text-transform: uppercase;\n        }\n        .dashboard-hero__title {\n          font-family: var(--font-title);\n          font-size: clamp(1.8rem, 4vw, 3rem);\n          background: linear-gradient(180deg, var(--gold-light) 0%, var(--gold) 50%, var(--gold-dark) 100%);\n          -webkit-background-clip: text;\n          -webkit-text-fill-color: transparent;\n          background-clip: text;\n          filter: drop-shadow(0 0 20px rgba(200,134,10,0.5));\n          margin-bottom: 0.3rem;\n        }\n        .dashboard-hero__sub {\n          font-family: var(--font-heading);\n          color: var(--parchment-dim);\n          font-size: 0.85rem;\n          letter-spacing: 0.15em;\n        }\n\n        .dashboard-stats {\n          display: grid;\n          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\n          gap: 0.8rem;\n          margin-bottom: 1.5rem;\n        }\n\n        .dashboard-xp-section {\n          margin-bottom: 2rem;\n          padding: 0 0.2rem;\n        }\n        .dashboard-xp-label {\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n          margin-bottom: 0.4rem;\n        }\n\n        .dashboard-grid {\n          display: grid;\n          grid-template-columns: 1fr 1fr;\n          gap: 1.5rem;\n          margin-bottom: 2rem;\n        }\n        @media (max-width: 900px) {\n          .dashboard-grid { grid-template-columns: 1fr; }\n        }\n\n        .dashboard-section {\n          background: linear-gradient(145deg, var(--stone-dark), var(--dungeon));\n          border: 1px solid rgba(200,134,10,0.18);\n          padding: 1.2rem;\n          position: relative;\n        }\n        .dashboard-section::after {\n          content: '';\n          position: absolute;\n          bottom: 0; right: 0;\n          width: 20px; height: 20px;\n          border-right: 1px solid var(--gold-dark);\n          border-bottom: 1px solid var(--gold-dark);\n        }\n        .dashboard-section__header {\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n          margin-bottom: 1rem;\n          padding-bottom: 0.6rem;\n          border-bottom: 1px solid rgba(200,134,10,0.1);\n        }\n        .dashboard-section__title {\n          font-family: var(--font-heading);\n          font-size: 0.8rem;\n          color: var(--gold);\n          letter-spacing: 0.15em;\n          text-transform: uppercase;\n          filter: none;\n        }\n        .dashboard-section__link {\n          font-family: var(--font-heading);\n          font-size: 0.65rem;\n          color: var(--parchment-dim);\n          letter-spacing: 0.1em;\n          transition: color 0.15s;\n        }\n        .dashboard-section__link:hover { color: var(--gold); }\n\n        .dashboard-actions { margin-top: 1rem; text-align: center; }\n\n        /* Stat card */\n        .stat-card {\n          background: linear-gradient(145deg, var(--stone), var(--stone-dark));\n          border: 1px solid rgba(200,134,10,0.18);\n          padding: 1rem 1.2rem;\n          display: flex;\n          flex-direction: column;\n          gap: 0.3rem;\n          position: relative;\n        }\n        .stat-card::after {\n          content: '';\n          position: absolute;\n          bottom: 0; right: 0;\n          width: 14px; height: 14px;\n          border-right: 1px solid var(--gold-dark);\n          border-bottom: 1px solid var(--gold-dark);\n        }\n        .stat-card__icon { font-size: 1.4rem; }\n        .stat-card__value {\n          font-family: var(--font-heading);\n          font-size: 1.2rem;\n          font-weight: 700;\n          letter-spacing: 0.05em;\n        }\n        .stat-card__label {\n          font-size: 0.72rem;\n          color: var(--parchment-dim);\n          font-style: italic;\n        }\n\n        /* Mission row */\n        .mission-row {\n          display: flex;\n          align-items: center;\n          gap: 0.8rem;\n          padding: 0.65rem 0.8rem;\n          background: rgba(74,21,128,0.08);\n          border: 1px solid rgba(123,53,208,0.2);\n          border-left: 3px solid var(--arcane-bright);\n          transition: border-color 0.15s;\n        }\n        .mission-row:hover { border-color: rgba(176,110,255,0.4); }\n        .mission-row__icon {\n          width: 30px; height: 30px;\n          background: rgba(74,21,128,0.2);\n          border: 1px solid rgba(123,53,208,0.3);\n          display: flex; align-items: center; justify-content: center;\n          font-size: 0.9rem; flex-shrink: 0;\n        }\n        .mission-row__name {\n          font-family: var(--font-heading);\n          font-size: 0.78rem;\n          color: var(--parchment);\n          letter-spacing: 0.04em;\n          flex: 1;\n          white-space: nowrap;\n          overflow: hidden;\n          text-overflow: ellipsis;\n        }\n        .mission-row__reward {\n          font-family: var(--font-heading);\n          font-size: 0.72rem;\n          color: var(--gold);\n          white-space: nowrap;\n        }\n\n        /* Auction row */\n        .auction-row {\n          display: flex;\n          align-items: center;\n          gap: 0.8rem;\n          padding: 0.55rem 0.8rem;\n          border: 1px solid rgba(200,134,10,0.15);\n          transition: border-color 0.15s;\n        }\n        .auction-row:hover { border-color: rgba(200,134,10,0.35); }\n        .auction-row__name {\n          font-family: var(--font-heading);\n          font-size: 0.75rem;\n          color: var(--parchment);\n          flex: 1;\n          white-space: nowrap;\n          overflow: hidden;\n          text-overflow: ellipsis;\n        }\n        .auction-row__price {\n          font-family: var(--font-heading);\n          font-size: 0.75rem;\n          color: var(--gold-bright);\n          white-space: nowrap;\n        }\n\n        /* Skeleton */\n        .skel-row {\n          height: 42px;\n          border-radius: 2px;\n          margin-bottom: 0.5rem;\n        }\n\n        @keyframes torch-flicker {\n          0%   { transform: scaleX(1) scaleY(1) rotate(-1deg); }\n          100% { transform: scaleX(0.85) scaleY(1.1) rotate(1deg); }\n        }\n      "}</style>
    </div>);
}
// ── Sub-componentes ────────────────────────────────────────────────────────────
function StatCard(_a) {
    var icon = _a.icon, label = _a.label, value = _a.value, color = _a.color;
    return (<div className="stat-card">
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__value" style={{ color: color }}>{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>);
}
function MissionRow(_a) {
    var _b;
    var mission = _a.mission;
    var cfg = (_b = STATUS_CONFIG[mission.status]) !== null && _b !== void 0 ? _b : STATUS_CONFIG.ACTIVE;
    return (<react_router_dom_1.Link to="/missions" style={{ textDecoration: 'none' }}>
      <div className="mission-row">
        <div className="mission-row__icon">🔮</div>
        <span className="mission-row__name">{mission.title}</span>
        <span className={"nbv-badge ".concat(cfg.cls)}>{cfg.label}</span>
        {mission.reward && (<span className="mission-row__reward">+✦{mission.reward.gold}</span>)}
      </div>
    </react_router_dom_1.Link>);
}
function AuctionRow(_a) {
    var _b;
    var auction = _a.auction;
    var rarityColor = (_b = RARITY_COLOR[auction.rarity]) !== null && _b !== void 0 ? _b : 'var(--parchment-dim)';
    var price = auction.currentPrice.toLocaleString();
    return (<react_router_dom_1.Link to={"/auctions/".concat(auction.id)} style={{ textDecoration: 'none' }}>
      <div className="auction-row">
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: rarityColor, flexShrink: 0, boxShadow: "0 0 4px ".concat(rarityColor) }}/>
        <span className="auction-row__name">{auction.itemName}</span>
        <span className="auction-row__price">✦ {price}</span>
      </div>
    </react_router_dom_1.Link>);
}
function SkeletonList(_a) {
    var count = _a.count;
    return (<>
      {Array.from({ length: count }).map(function (_, i) { return (<div key={i} className="nbv-skeleton skel-row"/>); })}
    </>);
}
function EmptyState(_a) {
    var icon = _a.icon, text = _a.text, action = _a.action;
    return (<div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--rune-gray)', fontStyle: 'italic' }}>
      <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem', opacity: 0.5 }}>{icon}</div>
      <p style={{ fontSize: '0.85rem' }}>{text}</p>
      {action}
    </div>);
}
function TorchDecor() {
    return (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div style={{
            width: 14, height: 28,
            background: 'radial-gradient(ellipse at 50% 80%, #F5C842 0%, #C8860A 40%, #A81020 70%, transparent 100%)',
            borderRadius: '50% 50% 30% 30%',
            animation: 'torch-flicker 0.15s infinite alternate',
            filter: 'blur(1px)',
            boxShadow: '0 0 16px 6px rgba(200,134,10,0.4)',
        }}/>
      <div style={{ width: 4, height: 28, background: 'linear-gradient(180deg,#4A2800,#2A1500)', borderRadius: 1 }}/>
      <div style={{ width: 8, height: 3, background: '#3A2010', borderRadius: 1 }}/>
    </div>);
}
