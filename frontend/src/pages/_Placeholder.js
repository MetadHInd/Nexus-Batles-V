"use strict";
// ══════════════════════════════════════════════════════
// PAGES — Cada página es un componente React independiente
// El equipo de frontend implementa el contenido aquí.
// Usar los hooks de /hooks y los módulos de /api para datos.
// ══════════════════════════════════════════════════════
Object.defineProperty(exports, "__esModule", { value: true });
var Placeholder = function (_a) {
    var name = _a.name;
    return (<div style={{ padding: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--color-gold)' }}>
    <h1>{name}</h1>
    <p style={{ color: 'var(--color-parchment-dim)', fontFamily: 'var(--font-body)', marginTop: '0.5rem' }}>
      Pendiente de implementación por el equipo frontend.
    </p>
  </div>);
};
exports.default = Placeholder;
