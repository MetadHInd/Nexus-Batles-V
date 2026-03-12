"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePayment = usePayment;
var react_1 = require("react");
var uuid_1 = require("../utils/uuid");
var payments_1 = require("../api/payments");
var playerStore_1 = require("../store/playerStore");
var initial = {
    step: 'IDLE',
    product: null,
    order: null,
    result: null,
    error: null,
};
function usePayment() {
    var _this = this;
    var _a = (0, react_1.useState)(initial), state = _a[0], setState = _a[1];
    // Conexión con playerStore — actualiza monedas/inventario post-pago
    var refreshPlayer = (0, playerStore_1.usePlayerStore)(function (s) { return s.refresh; });
    var selectProduct = (0, react_1.useCallback)(function (product) {
        setState(__assign(__assign({}, initial), { step: 'IDLE', product: product }));
    }, []);
    var startCheckout = (0, react_1.useCallback)(function (product_1, buyerInfo_1, countryCode_1, promoCode_1) {
        var args_1 = [];
        for (var _i = 4; _i < arguments.length; _i++) {
            args_1[_i - 4] = arguments[_i];
        }
        return __awaiter(_this, __spreadArray([product_1, buyerInfo_1, countryCode_1, promoCode_1], args_1, true), void 0, function (product, buyerInfo, countryCode, promoCode, gateway) {
            var idempotencyKey, orderRes, order_1, payRes, result_1, err_1, msg_1;
            var _a, _b, _c, _d, _e, _f;
            if (gateway === void 0) { gateway = 'mock'; }
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        setState(function (s) { return (__assign(__assign({}, s), { step: 'CREATING_ORDER', error: null })); });
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 4, , 5]);
                        idempotencyKey = (0, uuid_1.randomUUID)();
                        return [4 /*yield*/, payments_1.paymentsApi.createOrder({
                                productId: product.product_id,
                                currency: product.currency,
                                countryCode: countryCode,
                                idempotencyKey: idempotencyKey,
                                buyerInfo: buyerInfo,
                                promoCode: promoCode,
                            })];
                    case 2:
                        orderRes = (_g.sent()).data;
                        order_1 = orderRes.data;
                        setState(function (s) { return (__assign(__assign({}, s), { step: 'PROCESSING_PAYMENT', order: order_1 })); });
                        return [4 /*yield*/, payments_1.paymentsApi.processPayment(order_1.orderId, {
                                gateway: gateway,
                                buyerInfo: buyerInfo,
                            })];
                    case 3:
                        payRes = (_g.sent()).data;
                        result_1 = payRes.data;
                        // 3a. Si hay redirect (MercadoPago) → redirigir en 1.5s
                        if (result_1.redirectUrl) {
                            setState(function (s) { return (__assign(__assign({}, s), { step: 'REDIRECTING', result: result_1 })); });
                            // El inventario se actualizará cuando el webhook llegue al backend
                            // y el usuario regrese de MercadoPago
                            setTimeout(function () {
                                window.location.href = result_1.redirectUrl;
                            }, 1500);
                            return [2 /*return*/];
                        }
                        // 3b. Pago completado en el mismo flujo (mock/stripe con clientSecret)
                        setState(function (s) { return (__assign(__assign({}, s), { step: 'SUCCESS', result: result_1 })); });
                        // ✅ INTEGRACIÓN CLAVE: actualiza playerStore → Navbar ve nuevas monedas
                        // Se ejecuta en background — no bloquea la UI
                        refreshPlayer().catch(function () {
                            // No fatal si falla el refresh — el usuario puede recargar
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _g.sent();
                        msg_1 = (_f = (_c = (_b = (_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) !== null && _c !== void 0 ? _c : (_e = (_d = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.message) !== null && _f !== void 0 ? _f : 'Error al procesar el pago. Inténtalo de nuevo.';
                        setState(function (s) { return (__assign(__assign({}, s), { step: 'ERROR', error: msg_1 })); });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }, [refreshPlayer]);
    var reset = (0, react_1.useCallback)(function () { return setState(initial); }, []);
    return { state: state, selectProduct: selectProduct, startCheckout: startCheckout, reset: reset };
}
