"use strict";
/**
 * InventoryPage.tsx — Inventario del jugador
 * Carga desde playerStore (ya hidratado en MainLayout).
 * Si el inventario no se cargó, lo pide de nuevo.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InventoryPage;
var react_1 = require("react");
var playerStore_1 = require("@/store/playerStore");
var RARITY_CONFIG = {
    COMMON: { label: 'Común', color: '#9E9E9E', glow: 'rgba(158,158,158,0.1)', border: 'rgba(100,100,100,0.2)' },
    RARE: { label: 'Raro', color: '#30B8E8', glow: 'rgba(26,127,170,0.15)', border: 'rgba(26,127,170,0.3)' },
    EPIC: { label: 'Épico', color: '#B06EFF', glow: 'rgba(74,21,128,0.15)', border: 'rgba(123,53,208,0.3)' },
    LEGENDARY: { label: 'Legendario', color: '#F5C842', glow: 'rgba(200,134,10,0.2)', border: 'rgba(200,134,10,0.4)' },
};
var TYPE_EMOJI = {
    WEAPON: '⚔', ARMOR: '🛡', SPELL: '📜', POTION: '🧪', ARTIFACT: '🔮',
};
function InventoryPage() {
    var _a = (0, playerStore_1.usePlayerStore)(), inventory = _a.inventory, fetchInventory = _a.fetchInventory, isLoading = _a.isLoading;
    (0, react_1.useEffect)(function () {
        if (inventory.length === 0)
            fetchInventory();
    }, []);
    return (<div className="page-content fade-in">
      <div className="page-header">
        <h1 className="page-title">🎒 Inventario</h1>
        <p className="page-subtitle">Todos los ítems que has adquirido en el Nexus</p>
      </div>

      <div className="nbv-divider"><span className="nbv-divider-icon">⚜</span></div>

      {isLoading && inventory.length === 0 ? (<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {Array.from({ length: 8 }).map(function (_, i) { return (<div key={i} className="nbv-skeleton" style={{ height: 220, borderRadius: 2 }}/>); })}
        </div>) : inventory.length === 0 ? (<div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--rune-gray)', fontStyle: 'italic' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>🎒</div>
          <p>Tu inventario está vacío.</p>
          <p style={{ marginTop: '0.3rem', fontSize: '0.85rem' }}>Visita la tienda para adquirir ítems legendarios.</p>
        </div>) : (<>
          <div style={{ marginBottom: '1.2rem', color: 'var(--rune-gray)', fontSize: '0.85rem', fontStyle: 'italic' }}>
            {inventory.length} ítem{inventory.length !== 1 ? 's' : ''} en tu posesión
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {inventory.map(function (item) { return <InventoryCard key={item.id} item={item}/>; })}
          </div>
        </>)}
    </div>);
}
function InventoryCard(_a) {
    var _b, _c, _d;
    var item = _a.item;
    var cfg = (_b = RARITY_CONFIG[item.rarity]) !== null && _b !== void 0 ? _b : RARITY_CONFIG.COMMON;
    var emoji = (_c = TYPE_EMOJI[item.type]) !== null && _c !== void 0 ? _c : '✦';
    return (<div style={{
            background: 'linear-gradient(145deg, var(--stone), var(--stone-dark))',
            border: "1px solid ".concat(cfg.border),
            boxShadow: "0 0 16px ".concat(cfg.glow),
            padding: '1rem',
            position: 'relative',
            transition: 'transform 0.2s, box-shadow 0.2s',
        }} onMouseEnter={function (e) { e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseLeave={function (e) { e.currentTarget.style.transform = ''; }}>
      {/* Corner decoration */}
      <span style={{ position: 'absolute', top: 6, right: 6, color: 'var(--gold-dark)', fontSize: '0.6rem', opacity: 0.5 }}>✦</span>

      {/* Icon area */}
      <div style={{
            height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', marginBottom: '0.8rem',
            background: "rgba(0,0,0,0.2)", border: "1px solid ".concat(cfg.border),
        }}>
        {emoji}
      </div>

      {/* Rarity badge */}
      <span style={{
            display: 'inline-block', marginBottom: '0.5rem',
            fontFamily: 'var(--font-heading)', fontSize: '0.55rem',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            padding: '0.1rem 0.4rem', color: cfg.color,
            background: "rgba(0,0,0,0.3)", border: "1px solid ".concat(cfg.border),
        }}>{cfg.label}</span>

      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: 'var(--parchment)', marginBottom: '0.3rem', letterSpacing: '0.04em' }}>
        {item.name}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--parchment-dim)', fontStyle: 'italic', lineHeight: 1.4 }}>
        {item.description || item.type}
      </div>

      {/* Stats */}
      {Object.keys((_d = item.stats) !== null && _d !== void 0 ? _d : {}).length > 0 && (<div style={{ marginTop: '0.6rem', borderTop: "1px solid ".concat(cfg.border), paddingTop: '0.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.2rem 0.5rem' }}>
          {Object.entries(item.stats).map(function (_a) {
                var k = _a[0], v = _a[1];
                return (<div key={k} style={{ fontSize: '0.68rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--rune-gray)', textTransform: 'capitalize' }}>{k}</span>
              <span style={{ color: cfg.color, fontFamily: 'var(--font-heading)' }}>+{v}</span>
            </div>);
            })}
        </div>)}

      {item.isEquipped && (<div style={{ marginTop: '0.5rem', padding: '0.2rem 0.4rem', background: 'rgba(40,192,96,0.1)', border: '1px solid rgba(40,192,96,0.3)', textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--emerald-bright)' }}>
          EQUIPADO
        </div>)}
    </div>);
}
