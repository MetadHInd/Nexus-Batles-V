"use strict";
/**
 * ProductsController.ts + productRoutes.ts (archivo combinado)
 *
 * PROBLEMA DETECTADO EN FASE 1:
 *   paymentsApi.getShopProducts() llama a GET /products?shop=true
 *   pero esta ruta NO EXISTÍA en server.ts → 404 en producción.
 *   ShopPage usaba MOCK_PRODUCTS como fallback silencioso.
 *
 * SOLUCIÓN:
 *   Este archivo crea el Controller + Route del catálogo de productos.
 *   Agregar en server.ts:
 *     import productRoutes from '@infrastructure/http/routes/productRoutes';
 *     app.use('/api/v1/products', productRoutes);
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
exports.productsController = void 0;
var connection_1 = require("../database/connection");
var ProductsController = /** @class */ (function () {
    function ProductsController() {
    }
    // GET /api/v1/products?shop=true → todos los productos activos con stock
    ProductsController.prototype.getProducts = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var shopOnly, query, rows, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        shopOnly = req.query.shop === 'true';
                        query = shopOnly
                            ? "SELECT id as product_id, name, description, ROUND(price * 100) as price_cents,\n                  'USD' as currency, stock as available_stock, 1 as is_active,\n                  JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.rarity')) as rarity,\n                  JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.type'))   as type,\n                  JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.emoji'))  as emoji\n           FROM products\n           WHERE stock > 0\n           ORDER BY FIELD(JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.rarity')),\n                          'LEGENDARY','EPIC','RARE','COMMON')"
                            : "SELECT id as product_id, name, description, ROUND(price * 100) as price_cents,\n                  'USD' as currency, stock as available_stock, 1 as is_active\n           FROM products\n           ORDER BY id DESC";
                        return [4 /*yield*/, connection_1.pool.execute(query)];
                    case 1:
                        rows = (_a.sent())[0];
                        res.json({ success: true, data: rows });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        next(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/v1/products/:id
    ProductsController.prototype.getById = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var rows, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, connection_1.pool.execute("SELECT id as product_id, name, description, ROUND(price * 100) as price_cents,\n                'USD' as currency, stock as available_stock\n         FROM products WHERE id = ? LIMIT 1", [req.params.id])];
                    case 1:
                        rows = (_a.sent())[0];
                        if (!rows.length) {
                            res.status(404).json({ success: false, error: 'PRODUCT_NOT_FOUND' });
                            return [2 /*return*/];
                        }
                        res.json({ success: true, data: rows[0] });
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        next(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ProductsController;
}());
exports.productsController = new ProductsController();
