"use strict";
/**
 * ProfilePage.tsx — Perfil del jugador con edición de username
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
exports.default = ProfilePage;
var react_1 = require("react");
var playerStore_1 = require("@/store/playerStore");
var authStore_1 = require("@/store/authStore");
var players_1 = require("@/api/players");
function ProfilePage() {
    var _a, _b, _c, _d, _e, _f, _g;
    var _h = (0, playerStore_1.usePlayerStore)(), profile = _h.profile, refresh = _h.refresh;
    var player = (0, authStore_1.useAuthStore)().player;
    var _j = (0, react_1.useState)(false), editing = _j[0], setEditing = _j[1];
    var _k = (0, react_1.useState)((_b = (_a = profile === null || profile === void 0 ? void 0 : profile.username) !== null && _a !== void 0 ? _a : player === null || player === void 0 ? void 0 : player.username) !== null && _b !== void 0 ? _b : ''), username = _k[0], setUsername = _k[1];
    var _l = (0, react_1.useState)(false), saving = _l[0], setSaving = _l[1];
    var _m = (0, react_1.useState)(null), feedback = _m[0], setFeedback = _m[1];
    var displayName = (_d = (_c = profile === null || profile === void 0 ? void 0 : profile.username) !== null && _c !== void 0 ? _c : player === null || player === void 0 ? void 0 : player.username) !== null && _d !== void 0 ? _d : '…';
    var initial = displayName.charAt(0).toUpperCase();
    function handleSave() {
        return __awaiter(this, void 0, void 0, function () {
            var err_1, msg;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!username.trim() || username === displayName) {
                            setEditing(false);
                            return [2 /*return*/];
                        }
                        setSaving(true);
                        setFeedback(null);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, players_1.playersApi.updateMe({ username: username.trim() })];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, refresh()];
                    case 3:
                        _d.sent();
                        setFeedback({ type: 'success', msg: 'Nombre actualizado exitosamente' });
                        setEditing(false);
                        return [3 /*break*/, 6];
                    case 4:
                        err_1 = _d.sent();
                        msg = (_c = (_b = (_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) !== null && _c !== void 0 ? _c : 'Error al actualizar el nombre';
                        setFeedback({ type: 'error', msg: msg });
                        return [3 /*break*/, 6];
                    case 5:
                        setSaving(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    return (<div className="page-content fade-in">
      <div className="page-header">
        <h1 className="page-title">📜 Mi Pergamino</h1>
        <p className="page-subtitle">Tu historia en el Nexus</p>
      </div>

      <div className="nbv-divider"><span className="nbv-divider-icon">⚜</span></div>

      <div style={{ maxWidth: 600 }}>
        {/* Tarjeta de perfil */}
        <div className="nbv-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--arcane), var(--crimson))',
            border: '3px solid var(--gold-dark)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-title)', fontSize: '1.8rem', color: 'var(--gold-light)',
            boxShadow: '0 0 20px rgba(74,21,128,0.4)',
            flexShrink: 0,
        }}>{initial}</div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--parchment)', letterSpacing: '0.05em' }}>
                {displayName}
              </div>
              <div style={{ marginTop: '0.2rem' }}>
                <span className={"nbv-badge ".concat((player === null || player === void 0 ? void 0 : player.role) === 'ADMIN' ? 'nbv-badge-gold' : (player === null || player === void 0 ? void 0 : player.role) === 'MODERATOR' ? 'nbv-badge-arcane' : 'nbv-badge-gray')}>
                  {(_e = player === null || player === void 0 ? void 0 : player.role) !== null && _e !== void 0 ? _e : 'PLAYER'}
                </span>
              </div>
            </div>
          </div>

          {/* Edición de username */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: '0.68rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>
              Nombre del Guerrero
            </label>
            {editing ? (<div style={{ display: 'flex', gap: '0.5rem' }}>
                <input className="nbv-input" style={{ margin: 0, flex: 1 }} value={username} onChange={function (e) { return setUsername(e.target.value); }} maxLength={20} pattern="^[a-zA-Z0-9_]+$"/>
                <button className="nbv-btn nbv-btn-primary" onClick={handleSave} disabled={saving} style={{ clipPath: 'none' }}>
                  {saving ? '…' : '✓'}
                </button>
                <button className="nbv-btn nbv-btn-ghost" onClick={function () { setEditing(false); setUsername(displayName); }} style={{ clipPath: 'none' }}>
                  ✕
                </button>
              </div>) : (<div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--parchment)' }}>{displayName}</span>
                <button className="nbv-btn nbv-btn-ghost" onClick={function () { return setEditing(true); }} style={{ fontSize: '0.65rem', padding: '0.25rem 0.7rem', clipPath: 'none' }}>
                  Editar
                </button>
              </div>)}
          </div>

          {feedback && (<div className={"nbv-notif ".concat(feedback.type === 'success' ? 'nbv-notif-success' : 'nbv-notif-error')}>
              <span className="nbv-notif-icon">{feedback.type === 'success' ? '✓' : '✗'}</span>
              <div><div className="nbv-notif-msg">{feedback.msg}</div></div>
            </div>)}
        </div>

        {/* Stats */}
        <div className="nbv-card">
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.68rem', letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem', opacity: 0.8 }}>
            Estadísticas del Guerrero
          </div>
          {[
            { label: 'Rango Global', value: (profile === null || profile === void 0 ? void 0 : profile.rank) ? "#".concat(profile.rank) : 'Sin clasificar' },
            { label: 'Monedas de Oro', value: "\u2726 ".concat(((_f = profile === null || profile === void 0 ? void 0 : profile.gold) !== null && _f !== void 0 ? _f : 0).toLocaleString()) },
            { label: 'Puntos de XP', value: ((_g = profile === null || profile === void 0 ? void 0 : profile.xp) !== null && _g !== void 0 ? _g : 0).toLocaleString() },
        ].map(function (_a) {
            var label = _a.label, value = _a.value;
            return (<div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(200,134,10,0.08)', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--parchment-dim)' }}>{label}</span>
              <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', fontSize: '0.82rem' }}>{value}</span>
            </div>);
        })}
        </div>
      </div>
    </div>);
}
