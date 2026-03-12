"use strict";
/**
 * ShopPage.tsx — The Nexus Battles shop / premium store
 * Full medieval D&D aesthetic. Integrates ProductCard, CheckoutModal,
 * and the usePayment hook for the complete checkout flow.
 */
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
exports.default = ShopPage;
var react_1 = require("react");
var usePayment_1 = require("../hooks/usePayment");
var payments_1 = require("../api/payments");
var ProductCard_1 = require("../components/payments/ProductCard");
var CheckoutModal_1 = require("../components/payments/CheckoutModal");
var OrderStatusBadge_1 = require("../components/payments/OrderStatusBadge");
// ── Mock products for development (replace with API call when products endpoint is ready) ──
var MOCK_PRODUCTS = [
    {
        product_id: '11111111-1111-1111-1111-111111111111',
        name: 'Espada del Abismo',
        description: 'Forjada en las entrañas del volcán eterno. +50 ATK, +20% crítico.',
        price_cents: 4999,
        currency: 'USD',
        rarity: 'LEGENDARY',
        type: 'WEAPON',
        emoji: '⚔️',
        available_stock: 3,
        is_active: true,
    },
    {
        product_id: '22222222-2222-2222-2222-222222222222',
        name: 'Manto Arcano',
        description: 'Tejido con hilos de magia pura. +35 MAG, resistencia hechizos.',
        price_cents: 2999,
        currency: 'USD',
        rarity: 'EPIC',
        type: 'ARMOR',
        emoji: '🌌',
        available_stock: 7,
        is_active: true,
    },
    {
        product_id: '33333333-3333-3333-3333-333333333333',
        name: 'Escudo de Escarcha',
        description: 'Talla dracónica en hielo antiguo. +40 DEF, inmunidad a frío.',
        price_cents: 1999,
        currency: 'USD',
        rarity: 'RARE',
        type: 'ARMOR',
        emoji: '🛡️',
        available_stock: 12,
        is_active: true,
    },
    {
        product_id: '44444444-4444-4444-4444-444444444444',
        name: 'Poción de Vigor',
        description: 'Restaura 500 HP al instante. Sabor a manzana encantada.',
        price_cents: 299,
        currency: 'USD',
        rarity: 'COMMON',
        type: 'POTION',
        emoji: '🧪',
        available_stock: 50,
        is_active: true,
    },
    {
        product_id: '55555555-5555-5555-5555-555555555555',
        name: 'Amuleto del Dragón',
        description: 'La gema carmesí palpita con vida. +30 a todos los stats.',
        price_cents: 3499,
        currency: 'USD',
        rarity: 'EPIC',
        type: 'ARTIFACT',
        emoji: '🐉',
        available_stock: 5,
        is_active: true,
    },
    {
        product_id: '66666666-6666-6666-6666-666666666666',
        name: 'Tomo de Hechizos',
        description: 'Contiene 12 encantamientos de nivel máximo. Uso ilimitado.',
        price_cents: 1499,
        currency: 'USD',
        rarity: 'RARE',
        type: 'SPELL',
        emoji: '📜',
        available_stock: 0, // Out of stock demo
        is_active: true,
    },
];
function ShopPage() {
    var _a = (0, react_1.useState)(MOCK_PRODUCTS), products = _a[0], setProducts = _a[1];
    var _b = (0, react_1.useState)('ALL'), filter = _b[0], setFilter = _b[1];
    var _c = (0, react_1.useState)(false), loadingProducts = _c[0], setLoadingProducts = _c[1];
    var _d = (0, react_1.useState)(null), selectedProduct = _d[0], setSelectedProduct = _d[1];
    var _e = (0, usePayment_1.usePayment)(), paymentState = _e.state, startCheckout = _e.startCheckout, reset = _e.reset;
    // Try to load real products from the API; fall back to mock
    (0, react_1.useEffect)(function () {
        setLoadingProducts(true);
        payments_1.paymentsApi.getShopProducts()
            .then(function (res) { var _a, _b; if ((_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.length)
            setProducts(res.data.data); })
            .catch(function () { })
            .finally(function () { return setLoadingProducts(false); });
    }, []);
    var filtered = filter === 'ALL'
        ? products
        : products.filter(function (p) { return p.rarity === filter; });
    function handleSelectProduct(p) {
        reset();
        setSelectedProduct(p);
    }
    function handleConfirm(buyerInfo, countryCode, promoCode) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!selectedProduct)
                            return [2 /*return*/];
                        return [4 /*yield*/, startCheckout(selectedProduct, buyerInfo, countryCode, promoCode, 'mock')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function handleCloseModal() {
        if (paymentState.step === 'CREATING_ORDER' || paymentState.step === 'PROCESSING_PAYMENT')
            return;
        setSelectedProduct(null);
        reset();
    }
    var FILTERS = [
        { key: 'ALL', label: 'Todos' },
        { key: 'LEGENDARY', label: 'Legendario', color: '#F5C842' },
        { key: 'EPIC', label: 'Épico', color: '#B06EFF' },
        { key: 'RARE', label: 'Raro', color: '#30B8E8' },
        { key: 'COMMON', label: 'Común', color: '#9E9E9E' },
    ];
    return (<div style={{
            minHeight: '100vh',
            background: 'var(--color-abyss)',
            color: 'var(--color-parchment)',
            fontFamily: 'var(--font-body)',
            position: 'relative',
            overflow: 'hidden',
        }}>

      {/* ── Floating rune background ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {['⚔', '🐉', '✦', '⚜', '🗡', '🛡'].map(function (rune, i) { return (<span key={i} style={{
                position: 'absolute',
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-gold)',
                opacity: 0.04,
                fontSize: "".concat(2 + (i % 3), "rem"),
                left: "".concat(10 + i * 16, "%"),
                top: "".concat(10 + (i * 17) % 80, "%"),
                animation: "float-rune ".concat(20 + i * 3, "s infinite linear"),
                animationDelay: "-".concat(i * 4, "s"),
            }}>{rune}</span>); })}
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1300px', margin: '0 auto', padding: '0 2rem 4rem' }}>

        {/* ── Header ── */}
        <div style={{
            textAlign: 'center',
            padding: '4rem 0 2.5rem',
            borderBottom: '1px solid rgba(200,134,10,0.2)',
            marginBottom: '2rem',
            position: 'relative',
        }}>
          {/* Torch left */}
          <div style={{ position: 'absolute', left: '5%', top: '50%', transform: 'translateY(-50%)' }}>
            <TorchDecor />
          </div>
          {/* Torch right */}
          <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)' }}>
            <TorchDecor />
          </div>

          <div style={{
            fontFamily: 'var(--font-heading)', fontSize: '0.8rem',
            letterSpacing: '0.5em', color: 'var(--color-gold)',
            textTransform: 'uppercase', marginBottom: '0.8rem', opacity: 0.8,
        }}>
            ✦ El Emporio del Nexus ✦
          </div>

          <h1 style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            background: 'linear-gradient(180deg, var(--color-gold-light) 0%, var(--color-gold) 40%, var(--color-gold-dark) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 25px rgba(200,134,10,0.5))',
            marginBottom: '0.4rem',
        }}>
            Armería Legendaria
          </h1>

          <p style={{
            fontFamily: 'var(--font-heading)', fontSize: '0.9rem',
            color: 'var(--color-parchment-dim)', letterSpacing: '0.1em',
            fontStyle: 'italic',
        }}>
            Armas, reliquias y artefactos para el guerrero que se atreve a dominar el Nexus
          </p>
        </div>

        {/* ── Filter row ── */}
        <div style={{
            display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
            justifyContent: 'center', marginBottom: '2.5rem',
        }}>
          {FILTERS.map(function (f) {
            var _a, _b;
            return (<button key={f.key} onClick={function () { return setFilter(f.key); }} style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    padding: '0.35rem 0.9rem',
                    border: filter === f.key
                        ? "1px solid ".concat((_a = f.color) !== null && _a !== void 0 ? _a : 'var(--color-gold)')
                        : '1px solid rgba(200,134,10,0.2)',
                    color: filter === f.key
                        ? ((_b = f.color) !== null && _b !== void 0 ? _b : 'var(--color-gold)')
                        : 'var(--color-parchment-dim)',
                    background: filter === f.key
                        ? "rgba(".concat(f.color ? hexToRgb(f.color) : '200,134,10', ",0.1)")
                        : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                }}>
              {f.label}
            </button>);
        })}
        </div>

        {/* ── Product grid ── */}
        {loadingProducts ? (<div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-gold)', fontFamily: 'var(--font-heading)', letterSpacing: '0.3em' }}>
            ⚜ Cargando el armario del herrero...
          </div>) : filtered.length === 0 ? (<div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-parchment-dim)', fontStyle: 'italic' }}>
            No hay ítems en esta categoría por ahora
          </div>) : (<div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1.2rem',
            }}>
            {filtered.map(function (p) { return (<ProductCard_1.ProductCard key={p.product_id} product={p} onSelect={handleSelectProduct} disabled={!!selectedProduct && selectedProduct.product_id !== p.product_id}/>); })}
          </div>)}

        {/* ── Recent orders section (placeholder) ── */}
        <div style={{ marginTop: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(200,134,10,0.3),transparent)' }}/>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.7rem', letterSpacing: '0.4em', color: 'var(--color-gold)', textTransform: 'uppercase', opacity: 0.8 }}>
              Historial de Órdenes
            </span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(200,134,10,0.3),transparent)' }}/>
          </div>
          <div style={{
            padding: '1.5rem', background: 'rgba(0,0,0,0.2)',
            border: '1px solid rgba(200,134,10,0.1)',
            textAlign: 'center', color: 'var(--color-rune-gray)',
            fontStyle: 'italic', fontSize: '0.9rem',
        }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <OrderStatusBadge_1.OrderStatusBadge status="PAID" size="sm"/>
              <OrderStatusBadge_1.OrderStatusBadge status="PENDING" size="sm"/>
              <OrderStatusBadge_1.OrderStatusBadge status="REFUNDED" size="sm"/>
            </span>
            <div style={{ marginTop: '0.8rem' }}>
              Las órdenes completadas aparecerán aquí
            </div>
          </div>
        </div>
      </div>

      {/* ── Checkout Modal ── */}
      {selectedProduct && (<CheckoutModal_1.CheckoutModal product={selectedProduct} paymentState={paymentState} onConfirm={handleConfirm} onClose={handleCloseModal}/>)}

      <style>{"\n        @keyframes float-rune {\n          0%   { transform: translateY(0)    rotate(0deg);  opacity: 0.04; }\n          50%  { opacity: 0.07; }\n          100% { transform: translateY(-30px) rotate(5deg); opacity: 0.04; }\n        }\n      "}</style>
    </div>);
}
// ── Torch decoration ──────────────────────────────────────────────────────────
function TorchDecor() {
    return (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
      <div style={{
            width: '16px', height: '32px',
            background: 'radial-gradient(ellipse at 50% 80%, #F5C842 0%, #C8860A 40%, #A81020 70%, transparent 100%)',
            borderRadius: '50% 50% 30% 30%',
            animation: 'flicker 0.15s infinite alternate',
            filter: 'blur(1px)',
            boxShadow: '0 0 20px 8px rgba(200,134,10,0.45)',
        }}/>
      <div style={{ width: '5px', height: '32px', background: 'linear-gradient(180deg,#4A2800,#2A1500)', borderRadius: '1px' }}/>
      <div style={{ width: '10px', height: '4px', background: '#3A2010', borderRadius: '1px' }}/>
      <style>{"\n        @keyframes flicker {\n          0%   { transform: scaleX(1)    scaleY(1)   rotate(-1deg); }\n          100% { transform: scaleX(0.85) scaleY(1.1) rotate(1deg); }\n        }\n      "}</style>
    </div>);
}
// ── Util ──────────────────────────────────────────────────────────────────────
function hexToRgb(hex) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return "".concat(r, ",").concat(g, ",").concat(b);
}
