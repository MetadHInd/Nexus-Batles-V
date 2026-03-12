"use strict";
/**
 * RegisterPage.tsx — Registro de nuevo aventurero
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
exports.default = RegisterPage;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var authStore_1 = require("@/store/authStore");
function RegisterPage() {
    var _a = (0, react_1.useState)(''), username = _a[0], setUsername = _a[1];
    var _b = (0, react_1.useState)(''), email = _b[0], setEmail = _b[1];
    var _c = (0, react_1.useState)(''), password = _c[0], setPassword = _c[1];
    var _d = (0, react_1.useState)(''), confirm = _d[0], setConfirm = _d[1];
    var _e = (0, react_1.useState)(''), localErr = _e[0], setLocalErr = _e[1];
    var _f = (0, authStore_1.useAuthStore)(), register = _f.register, isLoading = _f.isLoading, error = _f.error, clearError = _f.clearError;
    var navigate = (0, react_router_dom_1.useNavigate)();
    function handleSubmit(e) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        e.preventDefault();
                        clearError();
                        setLocalErr('');
                        if (password !== confirm) {
                            setLocalErr('Las contraseñas no coinciden');
                            return [2 /*return*/];
                        }
                        if (password.length < 6) {
                            setLocalErr('La contraseña debe tener al menos 6 caracteres');
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, register(username.trim(), email.trim(), password)];
                    case 2:
                        _b.sent();
                        navigate('/login');
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    var displayError = localErr || error;
    return (<div className="auth-page">
      <div className="rune-bg" aria-hidden="true">
        <span>⚔</span><span>⚜</span><span>🔮</span>
        <span>⚡</span><span>✦</span><span>◈</span>
      </div>

      <div className="auth-card fade-in">
        <div className="auth-card__crest">⚔</div>
        <h1 className="auth-card__title">Forja tu Leyenda</h1>
        <p className="auth-card__subtitle">Únete al campo de batalla del Nexus</p>

        <div className="nbv-divider"><span className="nbv-divider-icon" style={{ fontSize: '0.7rem' }}>⚜</span></div>

        <form onSubmit={handleSubmit}>
          <label className="auth-label">Nombre del Guerrero</label>
          <input className="nbv-input" type="text" value={username} onChange={function (e) { return setUsername(e.target.value); }} placeholder="tu_nombre_épico" required minLength={3} maxLength={20} pattern="^[a-zA-Z0-9_]+$" title="Solo letras, números y guión bajo" autoComplete="username"/>

          <label className="auth-label">Correo del Reino</label>
          <input className="nbv-input" type="email" value={email} onChange={function (e) { return setEmail(e.target.value); }} placeholder="tu@nexus.com" required autoComplete="email"/>

          <label className="auth-label">Contraseña Secreta</label>
          <input className="nbv-input" type="password" value={password} onChange={function (e) { return setPassword(e.target.value); }} placeholder="Mínimo 6 caracteres" required minLength={6} autoComplete="new-password"/>

          <label className="auth-label">Confirmar Contraseña</label>
          <input className={"nbv-input".concat(displayError ? ' error' : '')} type="password" value={confirm} onChange={function (e) { return setConfirm(e.target.value); }} placeholder="Repite la contraseña" required autoComplete="new-password"/>

          {displayError && (<div className="nbv-notif nbv-notif-error" style={{ marginBottom: '1rem' }}>
              <span className="nbv-notif-icon">⚠</span>
              <div>
                <div className="nbv-notif-title">Error de Registro</div>
                <div className="nbv-notif-msg">{displayError}</div>
              </div>
            </div>)}

          <button type="submit" className="nbv-btn nbv-btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem', clipPath: 'none' }} disabled={isLoading}>
            {isLoading ? '⚜ Creando leyenda...' : '✦ Unirme al Nexus'}
          </button>
        </form>

        <div className="auth-card__footer">
          ¿Ya tienes cuenta?{' '}
          <react_router_dom_1.Link to="/login">Entra al campo de batalla</react_router_dom_1.Link>
        </div>
      </div>

      <style>{"\n        .auth-page {\n          min-height: 100vh;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(74,21,128,0.06) 0%, transparent 70%), var(--abyss);\n          padding: 1rem;\n          position: relative;\n        }\n        .auth-card {\n          width: 100%;\n          max-width: 420px;\n          background: linear-gradient(145deg, var(--stone), var(--stone-dark));\n          border: 1px solid rgba(200,134,10,0.3);\n          padding: 2.5rem 2rem;\n          position: relative;\n          z-index: 1;\n          box-shadow: 0 0 60px rgba(0,0,0,0.8);\n        }\n        .auth-card::after {\n          content: '';\n          position: absolute;\n          bottom: 0; right: 0;\n          width: 30px; height: 30px;\n          border-right: 1px solid var(--gold-dark);\n          border-bottom: 1px solid var(--gold-dark);\n        }\n        .auth-card__crest {\n          text-align: center; font-size: 2.5rem; color: var(--gold);\n          filter: drop-shadow(0 0 16px rgba(200,134,10,0.6)); margin-bottom: 0.5rem;\n        }\n        .auth-card__title {\n          font-family: var(--font-title); font-size: 1.6rem; text-align: center;\n          color: var(--gold); filter: drop-shadow(0 0 12px rgba(200,134,10,0.4)); margin-bottom: 0.3rem;\n        }\n        .auth-card__subtitle {\n          text-align: center; font-style: italic; font-size: 0.9rem;\n          color: var(--parchment-dim); margin-bottom: 0;\n        }\n        .auth-label {\n          display: block; font-family: var(--font-heading); font-size: 0.68rem;\n          letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.35rem;\n        }\n        .auth-card__footer {\n          text-align: center; margin-top: 1.2rem;\n          font-size: 0.85rem; color: var(--rune-gray); font-style: italic;\n        }\n        .auth-card__footer a { color: var(--gold); }\n        .auth-card__footer a:hover { color: var(--gold-light); }\n      "}</style>
    </div>);
}
