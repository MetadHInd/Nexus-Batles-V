"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
var common_1 = require("@nestjs/common");
var htmlPdf = require("html-pdf-node");
var puppeteer = require("puppeteer");
var fs = require("fs");
var path = require("path");
var PdfService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PdfService = _classThis = /** @class */ (function () {
        function PdfService_1() {
            this.logger = new common_1.Logger(PdfService.name);
            this.debugMode = process.env.PDF_DEBUG_MODE === 'true';
            this.debugPath = path.join(process.cwd(), 'debug-pdfs');
            this.gmailPdfsPath = path.join(process.cwd(), 'gmail-pdfs');
            // Crear directorios de debug si no existen
            if (this.debugMode) {
                if (!fs.existsSync(this.debugPath)) {
                    fs.mkdirSync(this.debugPath, { recursive: true });
                }
                if (!fs.existsSync(this.gmailPdfsPath)) {
                    fs.mkdirSync(this.gmailPdfsPath, { recursive: true });
                }
            }
        }
        /**
         * Get Puppeteer launch options that work across all environments
         * - Local: Uses downloaded Chromium
         * - Docker/Production: Uses system Chromium via PUPPETEER_EXECUTABLE_PATH
         * - Dev server: Uses system Chromium if available
         */
        PdfService_1.prototype.getPuppeteerArgs = function () {
            return [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-software-rasterizer',
                '--disable-blink-features=AutomationControlled',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
            ];
        };
        /**
         * 🌐 Convierte una URL a PDF usando Puppeteer (específico para Gmail Receiver)
         * Evita detección de Cloudflare y otros anti-bot
         *
         * @param url URL de la orden a convertir
         * @param orderId ID de la orden (opcional)
         * @returns Buffer del PDF generado
         */
        PdfService_1.prototype.convertUrlToPdfForGmail = function (url, orderId) {
            return __awaiter(this, void 0, void 0, function () {
                var browser, page, pdfBuffer, buffer, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            browser = null;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 15, 16, 19]);
                            this.logger.log("\uD83C\uDF10 Iniciando conversi\u00F3n de URL a PDF: ".concat(url));
                            return [4 /*yield*/, puppeteer.launch({
                                    headless: true,
                                    args: this.getPuppeteerArgs(),
                                    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
                                })];
                        case 2:
                            // Configuración de Puppeteer
                            browser = _a.sent();
                            return [4 /*yield*/, browser.newPage()];
                        case 3:
                            page = _a.sent();
                            // Configurar User Agent realista
                            return [4 /*yield*/, page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')];
                        case 4:
                            // Configurar User Agent realista
                            _a.sent();
                            // Configurar headers adicionales
                            return [4 /*yield*/, page.setExtraHTTPHeaders({
                                    'Accept-Language': 'en-US,en;q=0.9',
                                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                                    'Accept-Encoding': 'gzip, deflate, br',
                                    'DNT': '1',
                                    'Connection': 'keep-alive',
                                    'Upgrade-Insecure-Requests': '1',
                                })];
                        case 5:
                            // Configurar headers adicionales
                            _a.sent();
                            // Configurar viewport AMPLIO para capturar todo el contenido
                            return [4 /*yield*/, page.setViewport({
                                    width: 1200, // Ancho similar a A4 (8.27 pulgadas * 96 DPI ≈ 794px, pero usamos 1200 para mejor calidad)
                                    height: 1600, // Altura inicial
                                    deviceScaleFactor: 1,
                                })];
                        case 6:
                            // Configurar viewport AMPLIO para capturar todo el contenido
                            _a.sent();
                            // Navegar a la URL
                            this.logger.log("\uD83D\uDCE1 Navegando a: ".concat(url));
                            return [4 /*yield*/, page.goto(url, {
                                    waitUntil: 'networkidle2',
                                    timeout: 60000,
                                })];
                        case 7:
                            _a.sent();
                            // Esperar a que se cargue el contenido real (no el challenge de Cloudflare)
                            return [4 /*yield*/, this.waitForRealContentGmail(page, url)];
                        case 8:
                            // Esperar a que se cargue el contenido real (no el challenge de Cloudflare)
                            _a.sent();
                            // Volver al inicio para la captura del PDF
                            return [4 /*yield*/, page.evaluate(function () {
                                    window.scrollTo(0, 0);
                                })];
                        case 9:
                            // Volver al inicio para la captura del PDF
                            _a.sent();
                            // Esperar estabilización
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                        case 10:
                            // Esperar estabilización
                            _a.sent();
                            // Inyectar CSS para forzar que todo el contenido sea visible en PDF
                            return [4 /*yield*/, page.evaluate(function () {
                                    var style = document.createElement('style');
                                    style.textContent = "\n          @media print {\n            * {\n              overflow: visible !important;\n              max-height: none !important;\n              height: auto !important;\n            }\n            body, html {\n              overflow: visible !important;\n              height: auto !important;\n            }\n            /* Forzar que contenedores fixed/absolute se comporten como static para PDF */\n            div[class*=\"fixed\"], div[class*=\"absolute\"] {\n              position: relative !important;\n            }\n          }\n        ";
                                    document.head.appendChild(style);
                                })];
                        case 11:
                            // Inyectar CSS para forzar que todo el contenido sea visible en PDF
                            _a.sent();
                            // Generar PDF capturando toda la página con paginación automática
                            this.logger.log('📄 Generando PDF con paginación automática...');
                            return [4 /*yield*/, page.pdf({
                                    format: 'Letter', // Formato US Letter (más común en USA que A4)
                                    printBackground: true,
                                    margin: {
                                        top: '0.5in',
                                        right: '0.5in',
                                        bottom: '0.5in',
                                        left: '0.5in',
                                    },
                                    scale: 1,
                                    preferCSSPageSize: false,
                                    pageRanges: '', // Todas las páginas
                                })];
                        case 12:
                            pdfBuffer = _a.sent();
                            this.logger.log("\u2705 PDF generado exitosamente (".concat(pdfBuffer.length, " bytes)"));
                            buffer = Buffer.from(pdfBuffer);
                            if (!(this.debugMode && orderId)) return [3 /*break*/, 14];
                            return [4 /*yield*/, this.savePdfForDebugGmail(buffer, orderId, url)];
                        case 13:
                            _a.sent();
                            _a.label = 14;
                        case 14: return [2 /*return*/, buffer];
                        case 15:
                            error_1 = _a.sent();
                            this.logger.error("\u274C Error convirtiendo URL a PDF: ".concat(error_1.message), error_1.stack);
                            throw error_1;
                        case 16:
                            if (!browser) return [3 /*break*/, 18];
                            return [4 /*yield*/, browser.close()];
                        case 17:
                            _a.sent();
                            _a.label = 18;
                        case 18: return [7 /*endfinally*/];
                        case 19: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Espera a que se cargue el contenido real de la página
         * Detecta y espera a que pase el challenge de Cloudflare
         */
        PdfService_1.prototype.waitForRealContentGmail = function (page, url) {
            return __awaiter(this, void 0, void 0, function () {
                var hasChallenge, maxWaitTime, startTime, stillHasChallenge, error_2, error_3;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 12, , 13]);
                            return [4 /*yield*/, page.evaluate(function () {
                                    var text = document.body.innerText.toLowerCase();
                                    return (text.includes('cloudflare') ||
                                        text.includes('verificar') ||
                                        text.includes('checking your browser') ||
                                        text.includes('verify you are human'));
                                })];
                        case 1:
                            hasChallenge = _a.sent();
                            if (!hasChallenge) return [3 /*break*/, 5];
                            this.logger.warn('⚠️ Cloudflare challenge detectado, esperando...');
                            maxWaitTime = 30000;
                            startTime = Date.now();
                            _a.label = 2;
                        case 2:
                            if (!(Date.now() - startTime < maxWaitTime)) return [3 /*break*/, 5];
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, page.evaluate(function () {
                                    var text = document.body.innerText.toLowerCase();
                                    return (text.includes('cloudflare') ||
                                        text.includes('verificar') ||
                                        text.includes('checking your browser'));
                                })];
                        case 4:
                            stillHasChallenge = _a.sent();
                            if (!stillHasChallenge) {
                                this.logger.log('✅ Challenge superado');
                                return [3 /*break*/, 5];
                            }
                            return [3 /*break*/, 2];
                        case 5:
                            if (!url.includes('ezcater.com')) return [3 /*break*/, 9];
                            this.logger.log('🍽️ Esperando contenido de ezcater...');
                            _a.label = 6;
                        case 6:
                            _a.trys.push([6, 8, , 9]);
                            // Esperar por cualquiera de estos selectores que indican contenido real
                            return [4 /*yield*/, Promise.race([
                                    page.waitForSelector('.order-details', { timeout: 15000 }),
                                    page.waitForSelector('[class*="Order"]', { timeout: 15000 }),
                                    page.waitForSelector('table', { timeout: 15000 }),
                                    page.waitForFunction(function () { return document.body.innerText.length > 500; }, { timeout: 15000 }),
                                ])];
                        case 7:
                            // Esperar por cualquiera de estos selectores que indican contenido real
                            _a.sent();
                            this.logger.log('✅ Contenido de orden detectado');
                            return [3 /*break*/, 9];
                        case 8:
                            error_2 = _a.sent();
                            this.logger.warn('⚠️ No se detectaron selectores específicos, continuando...');
                            return [3 /*break*/, 9];
                        case 9: 
                        // Esperar adicional para contenido dinámico
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                        case 10:
                            // Esperar adicional para contenido dinámico
                            _a.sent();
                            // Scroll progresivo para cargar todo el contenido lazy-load
                            this.logger.log('📜 Realizando scroll progresivo para cargar todo el contenido...');
                            return [4 /*yield*/, page.evaluate(function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: 
                                            // Función para hacer scroll suave y progresivo
                                            return [4 /*yield*/, new Promise(function (resolve) {
                                                    var totalHeight = 0;
                                                    var distance = 300; // Pixels a scrollear cada vez
                                                    var delay = 100; // Delay entre scrolls (ms)
                                                    var timer = setInterval(function () {
                                                        var scrollHeight = document.body.scrollHeight;
                                                        window.scrollBy(0, distance);
                                                        totalHeight += distance;
                                                        // Si llegamos al final, esperar un poco más y terminar
                                                        if (totalHeight >= scrollHeight) {
                                                            clearInterval(timer);
                                                            // Esperar a que cargue cualquier contenido adicional
                                                            setTimeout(resolve, 1000);
                                                        }
                                                    }, delay);
                                                })];
                                            case 1:
                                                // Función para hacer scroll suave y progresivo
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 11:
                            _a.sent();
                            this.logger.log('✅ Scroll completado - Todo el contenido cargado');
                            this.logger.log('✅ Página lista para generar PDF');
                            return [3 /*break*/, 13];
                        case 12:
                            error_3 = _a.sent();
                            this.logger.warn("\u26A0\uFE0F Advertencia esperando contenido: ".concat(error_3.message));
                            return [3 /*break*/, 13];
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Calcula las dimensiones reales del contenido de la página
         * IMPORTANTE: Esta función debe llamarse MIENTRAS la página está scrolleada
         * para poder calcular correctamente window.scrollY
         */
        PdfService_1.prototype.getPageDimensions = function (page) {
            return __awaiter(this, void 0, void 0, function () {
                var dimensions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, page.evaluate(function () {
                                var body = document.body;
                                var html = document.documentElement;
                                // PASO 1: Hacer scroll hasta el final para obtener scrollY máximo
                                window.scrollTo(0, document.body.scrollHeight);
                                // PASO 2: Calcular altura máxima de todos los elementos
                                var maxBottom = 0;
                                var allElements = document.querySelectorAll('*');
                                allElements.forEach(function (el) {
                                    var rect = el.getBoundingClientRect();
                                    var computedStyle = window.getComputedStyle(el);
                                    // Ignorar elementos ocultos o con display:none
                                    if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
                                        return;
                                    }
                                    // Calcular posición absoluta en el documento
                                    var absoluteBottom = rect.bottom + window.scrollY;
                                    if (absoluteBottom > maxBottom) {
                                        maxBottom = absoluteBottom;
                                    }
                                });
                                // También considerar el scrollHeight del body y html
                                var scrollBasedHeight = Math.max(html.scrollHeight, html.offsetHeight, html.clientHeight, body.scrollHeight, body.offsetHeight, body.clientHeight);
                                return {
                                    width: Math.max(html.scrollWidth, html.offsetWidth, html.clientWidth, body.scrollWidth, body.offsetWidth, body.clientWidth, 1920),
                                    // Usar el mayor valor entre scrollHeight y la posición del elemento más bajo
                                    // Agregar 200px extra de margen para asegurar que no se corte nada
                                    height: Math.max(maxBottom, scrollBasedHeight) + 200
                                };
                            })];
                        case 1:
                            dimensions = _a.sent();
                            this.logger.log("\uD83D\uDCD0 Dimensiones de la p\u00E1gina: ".concat(dimensions.width, "x").concat(dimensions.height, "px"));
                            return [2 /*return*/, dimensions];
                    }
                });
            });
        };
        /**
         * Guarda el PDF en disco para debugging (Gmail specific)
         */
        PdfService_1.prototype.savePdfForDebugGmail = function (pdfBuffer, orderId, url) {
            return __awaiter(this, void 0, void 0, function () {
                var filename, filepath;
                return __generator(this, function (_a) {
                    try {
                        filename = "order-debug-".concat(orderId, "-").concat(new Date().toISOString().split('T')[0], ".pdf");
                        filepath = path.join(this.debugPath, filename);
                        fs.writeFileSync(filepath, pdfBuffer);
                        this.logger.log("\uD83D\uDC1B PDF guardado para debug: ".concat(filepath));
                        this.logger.log("\uD83D\uDCC4 Tama\u00F1o: ".concat((pdfBuffer.length / 1024).toFixed(2), " KB"));
                        if (url) {
                            this.logger.log("\uD83D\uDD17 URL origen: ".concat(url));
                        }
                    }
                    catch (error) {
                        this.logger.error("\u274C Error guardando PDF para debug: ".concat(error.message));
                    }
                    return [2 /*return*/];
                });
            });
        };
        PdfService_1.prototype.generateOrderPdf = function (orderData) {
            return __awaiter(this, void 0, void 0, function () {
                var html, options, file, pdfBuffer, error_4, errorMessage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            console.log('=== PDF SERVICE DEBUG ===');
                            console.log('Order number:', orderData.orderNumber);
                            console.log('PUPPETEER_EXECUTABLE_PATH:', process.env.PUPPETEER_EXECUTABLE_PATH || 'not set (using bundled)');
                            console.log('========================');
                            html = this.generateOrderHtml(orderData);
                            options = {
                                format: 'A4',
                                printBackground: true,
                                margin: {
                                    top: '20px',
                                    bottom: '20px',
                                    left: '20px',
                                    right: '20px',
                                },
                                args: this.getPuppeteerArgs(),
                            };
                            file = { content: html };
                            return [4 /*yield*/, htmlPdf.generatePdf(file, options)];
                        case 1:
                            pdfBuffer = _a.sent();
                            this.logger.log("PDF generated successfully for order #".concat(orderData.orderNumber));
                            return [2 /*return*/, pdfBuffer];
                        case 2:
                            error_4 = _a.sent();
                            this.logger.error("Error generating PDF for order #".concat(orderData.orderNumber, ":"), error_4);
                            errorMessage = error_4 instanceof Error ? error_4.message : 'Unknown error';
                            throw new Error("Failed to generate PDF: ".concat(errorMessage));
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 🧾 Generate US-style customer invoice PDF
         */
        PdfService_1.prototype.generateCustomerInvoicePdf = function (invoiceData) {
            return __awaiter(this, void 0, void 0, function () {
                var html, options, file, pdfBuffer, error_5, errorMessage;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            this.logger.log("\uD83E\uDDFE Generating customer invoice PDF for order #".concat(invoiceData.orderNumber));
                            console.log('=== INVOICE PDF SERVICE DEBUG ===');
                            console.log('Invoice number:', invoiceData.invoiceNumber);
                            console.log('Invoice data keys:', Object.keys(invoiceData));
                            console.log('Item groups count:', ((_a = invoiceData.itemGroups) === null || _a === void 0 ? void 0 : _a.length) || 0);
                            console.log('Line items count:', ((_b = invoiceData.lineItems) === null || _b === void 0 ? void 0 : _b.length) || 0);
                            console.log('PUPPETEER_EXECUTABLE_PATH:', process.env.PUPPETEER_EXECUTABLE_PATH || 'not set (using bundled)');
                            console.log('=================================');
                            html = this.generateInvoiceHtml(invoiceData);
                            console.log('✅ Invoice HTML generated, length:', html.length);
                            options = {
                                format: 'A4',
                                printBackground: true,
                                margin: {
                                    top: '15px',
                                    bottom: '15px',
                                    left: '20px',
                                    right: '20px',
                                },
                                args: this.getPuppeteerArgs(),
                            };
                            console.log('📄 Calling html-pdf-node with options...');
                            file = { content: html };
                            return [4 /*yield*/, htmlPdf.generatePdf(file, options)];
                        case 1:
                            pdfBuffer = _c.sent();
                            this.logger.log("\uD83E\uDDFE Customer invoice PDF generated successfully for order #".concat(invoiceData.orderNumber));
                            return [2 /*return*/, pdfBuffer];
                        case 2:
                            error_5 = _c.sent();
                            this.logger.error("\u274C Error generating customer invoice PDF for order #".concat(invoiceData.orderNumber, ":"), error_5);
                            console.error('❌ Full error details:', {
                                name: error_5 instanceof Error ? error_5.name : 'Unknown',
                                message: error_5 instanceof Error ? error_5.message : String(error_5),
                                stack: error_5 instanceof Error ? error_5.stack : undefined,
                            });
                            errorMessage = error_5 instanceof Error ? error_5.message : 'Unknown error';
                            throw new Error("Failed to generate customer invoice PDF: ".concat(errorMessage));
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        PdfService_1.prototype.generateOrderHtml = function (data) {
            var formatCurrency = function (amount) { return "$".concat(amount.toFixed(2)); };
            var capitalizeFirst = function (str) {
                return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            };
            var safeDeliveryType = data.deliveryType || 'delivery';
            var formatPhone = function (phone) {
                // Remove all non-digit characters
                var cleaned = phone.replace(/\D/g, '');
                // Format as (xxx) xxx-xxxx
                if (cleaned.length === 10) {
                    return "(".concat(cleaned.slice(0, 3), ") ").concat(cleaned.slice(3, 6), "-").concat(cleaned.slice(6));
                }
                // Return original if not 10 digits
                return phone;
            };
            // Generar HTML para cada grupo con checkboxes
            var groupsHtml = data.groups
                .map(function (group) { return "\n          <div class=\"group-section\">\n            <div class=\"group-header\">\n              ".concat(group.quantity && group.quantity > 1
                ? "\n                <div class=\"group-title-only\">\n                  <label class=\"group-title\">\n                    ".concat(group.isGrouped ? '👥' : '🍽️', " ").concat(group.groupName, " (x").concat(group.quantity, ")\n                    ").concat(group.variation ? " - ".concat(group.variation.name) : '', "\n                  </label>\n                </div>\n                <div class=\"multiple-checkboxes\">\n                  ").concat(Array.from({ length: group.quantity }, function (_, i) { return "\n                    <div class=\"checkbox-item\">\n                      <input type=\"checkbox\" class=\"group-checkbox\" />\n                    </div>\n                  "; }).join(''), "\n                </div>\n              ")
                : "\n                <div class=\"checkbox-container\">\n                  <input type=\"checkbox\" class=\"group-checkbox\" />\n                  <label class=\"group-title\">\n                    ".concat(group.isGrouped ? '👥' : '🍽️', " ").concat(group.groupName, "\n                    ").concat(group.variation ? " - ".concat(group.variation.name) : '', "\n                  </label>\n                </div>\n              "), "\n              ").concat(group.variation
                ? "\n                <div class=\"variation-info\">\n                  <span class=\"variation-detail\">Serves: ".concat(group.variation.serves, " people</span>\n                  <span class=\"variation-price\">").concat(formatCurrency(group.variation.price), "</span>\n                </div>\n              ")
                : '', "\n            </div>\n            \n            <div class=\"group-items\">\n              ").concat(group.items
                .map(function (item) { return "\n                    <div class=\"group-item\">\n                      <div class=\"item-checkbox-container\">\n                        <input type=\"checkbox\" class=\"item-checkbox\" />\n                        <div class=\"item-info\">\n                          <div class=\"item-name\">".concat(item.name, "</div>\n                          ").concat(item.description ? "<div class=\"item-description\">".concat(item.description, "</div>") : '', "\n                          ").concat(item.selections && item.selections.length > 0
                ? "\n                            <div class=\"item-selections\">\n                              ".concat(item.selections.map(function (selection) { return "<span class=\"selection-tag\">".concat(selection, "</span>"); }).join(''), "\n                            </div>\n                          ")
                : '', "\n                          ").concat(item.customComment ? "<div class=\"item-description\" style=\"color: #26A69A; font-style: normal; font-weight: bold; margin-top: 4px;\">\uD83D\uDCDD ".concat(item.customComment, "</div>") : '', "\n                        </div>\n                      </div>\n                      <div class=\"item-quantity\">\u00D7").concat(item.quantity, "</div>\n                      <div class=\"item-price\">").concat(formatCurrency(item.unitPrice), "</div>\n                      <div class=\"item-total\">").concat(formatCurrency(item.totalValue), "</div>\n                    </div>\n                  "); })
                .join(''), "\n            </div>\n            \n            <div class=\"group-total\">\n              Group Total: ").concat(formatCurrency(group.groupTotal * (group.quantity || 1)), "\n            </div>\n          </div>\n        "); })
                .join('');
            return "\n<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>Order Checklist #".concat(data.orderNumber, "</title>\n    <style>\n      * {\n        margin: 0;\n        padding: 0;\n        box-sizing: border-box;\n      }\n      \n      body {\n        font-family: 'Arial', sans-serif;\n        font-size: 12px;\n        line-height: 1.4;\n        color: #333;\n        background: white;\n      }\n      \n      .container {\n        max-width: 100%;\n        margin: 0;\n        padding: 20px;\n      }\n      \n      .header {\n        margin-bottom: 30px;\n        border-bottom: 2px solid #26A69A;\n        padding-bottom: 20px;\n      }\n      \n      .header-logos {\n        display: flex;\n        align-items: center;\n        justify-content: space-between;\n        width: 100%;\n      }\n      \n      .logo-left, .logo-right {\n        flex: 0 0 120px;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n      }\n      \n      .header-content {\n        flex: 1;\n        text-align: center;\n        padding: 0 20px;\n      }\n      \n      .logo-img {\n        max-width: 100px;\n        max-height: 60px;\n        object-fit: contain;\n      }\n      \n      .logo-placeholder {\n        width: 100px;\n        height: 60px;\n        border: 2px dashed #ccc;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        font-size: 10px;\n        color: #999;\n        text-align: center;\n      }\n      \n      .header h1 {\n        color: #26A69A;\n        font-size: 24px;\n        margin-bottom: 10px;\n        font-weight: bold;\n      }\n      \n      .header h2 {\n        color: #666;\n        font-size: 16px;\n        font-weight: normal;\n      }\n      \n      .order-info-grid {\n        display: grid;\n        grid-template-columns: 1fr 1fr;\n        gap: 30px;\n        margin-bottom: 30px;\n      }\n      \n      .info-section {\n        background: #f8f9fa;\n        padding: 15px;\n        border-radius: 8px;\n        border: 1px solid #e9ecef;\n      }\n      \n      .info-section h3 {\n        color: #26A69A;\n        font-size: 14px;\n        margin-bottom: 10px;\n        font-weight: bold;\n        border-bottom: 1px solid #26A69A;\n        padding-bottom: 5px;\n      }\n      \n      .info-row {\n        display: flex;\n        justify-content: space-between;\n        margin-bottom: 5px;\n      }\n      \n      .info-row strong {\n        color: #26A69A;\n        font-weight: bold;\n      }\n      \n      .status-badge {\n        background: #28a745;\n        color: white;\n        padding: 4px 8px;\n        border-radius: 4px;\n        font-size: 10px;\n        font-weight: bold;\n        text-transform: uppercase;\n      }\n      \n      .section-title {\n        color: #26A69A;\n        font-size: 16px;\n        font-weight: bold;\n        margin: 25px 0 15px;\n        border-bottom: 2px solid #26A69A;\n        padding-bottom: 5px;\n      }\n      \n      .group-section {\n        background: white;\n        border: 1px solid #e9ecef;\n        border-radius: 8px;\n        margin-bottom: 20px;\n        overflow: hidden;\n        page-break-inside: avoid;\n      }\n      \n      .group-header {\n        background: #f8f9fa;\n        padding: 15px;\n        border-bottom: 1px solid #e9ecef;\n      }\n      \n      .checkbox-container {\n        display: flex;\n        align-items: center;\n        margin-bottom: 10px;\n      }\n      \n      .group-checkbox {\n        width: 16px;\n        height: 16px;\n        margin-right: 10px;\n        accent-color: #26A69A;\n      }\n      \n      .group-title {\n        font-size: 14px;\n        font-weight: bold;\n        color: #26A69A;\n        cursor: pointer;\n      }\n\n      .group-title-only {\n        margin-bottom: 10px;\n      }\n\n      .multiple-checkboxes {\n        display: flex;\n        flex-wrap: wrap;\n        gap: 10px;\n        margin-top: 8px;\n      }\n\n      .checkbox-item {\n        display: flex;\n        align-items: center;\n        background: #f8f9fa;\n        padding: 6px 10px;\n        border-radius: 4px;\n        border: 1px solid #e9ecef;\n      }\n\n      \n      .variation-info {\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        background: #e3f2fd;\n        padding: 8px 12px;\n        border-radius: 4px;\n        margin-top: 8px;\n      }\n      \n      .variation-detail {\n        font-size: 12px;\n        color: #666;\n      }\n      \n      .variation-price {\n        font-weight: bold;\n        color: #26A69A;\n      }\n      \n      .group-items {\n        padding: 0;\n      }\n      \n      .group-item {\n        display: flex;\n        align-items: center;\n        padding: 12px 15px;\n        border-bottom: 1px solid #f0f0f0;\n      }\n      \n      .group-item:last-child {\n        border-bottom: none;\n      }\n      \n      .item-checkbox-container {\n        display: flex;\n        align-items: flex-start;\n        flex: 1;\n      }\n      \n      .item-checkbox {\n        width: 14px;\n        height: 14px;\n        margin-right: 10px;\n        margin-top: 2px;\n        accent-color: #26A69A;\n      }\n      \n      .item-info {\n        flex: 1;\n      }\n      \n      .item-name {\n        font-weight: bold;\n        font-size: 12px;\n        margin-bottom: 4px;\n      }\n      \n      .item-description {\n        font-size: 10px;\n        color: #666;\n        font-style: italic;\n        margin-bottom: 4px;\n      }\n      \n      .item-selections {\n        margin-top: 4px;\n      }\n      \n      .selection-tag {\n        display: inline-block;\n        background: #e3f2fd;\n        color: #1976d2;\n        padding: 2px 6px;\n        border-radius: 3px;\n        font-size: 9px;\n        margin-right: 4px;\n        margin-bottom: 2px;\n      }\n      \n      .item-quantity {\n        width: 60px;\n        text-align: center;\n        font-weight: bold;\n        color: #26A69A;\n        background: #f0f8f7;\n        padding: 4px;\n        border-radius: 4px;\n        margin: 0 10px;\n      }\n      \n      .item-price {\n        width: 70px;\n        text-align: right;\n        color: #666;\n        font-size: 11px;\n      }\n      \n      .item-total {\n        width: 70px;\n        text-align: right;\n        font-weight: bold;\n        color: #26A69A;\n      }\n      \n      .group-total {\n        background: #f0f8f7;\n        padding: 12px 15px;\n        text-align: right;\n        border-top: 1px solid #26A69A;\n        color: #26A69A;\n        font-weight: bold;\n      }\n      \n      .totals-section {\n        background: #f0f8f7;\n        border: 2px solid #26A69A;\n        border-radius: 8px;\n        padding: 20px;\n        margin: 25px 0;\n      }\n      \n      .total-row {\n        display: flex;\n        justify-content: space-between;\n        margin-bottom: 8px;\n        font-size: 12px;\n      }\n      \n      .total-row.final {\n        border-top: 2px solid #26A69A;\n        margin-top: 15px;\n        padding-top: 15px;\n        font-size: 16px;\n        font-weight: bold;\n        color: #26A69A;\n      }\n      \n      .delivery-type-highlight {\n        background: linear-gradient(135deg, #26A69A, #4DB6AC);\n        color: white;\n        padding: 20px;\n        border-radius: 12px;\n        text-align: center;\n        margin-bottom: 25px;\n        box-shadow: 0 4px 8px rgba(38, 166, 154, 0.3);\n        position: relative;\n        overflow: hidden;\n      }\n      \n      .delivery-type-highlight::before {\n        content: '';\n        position: absolute;\n        top: -50%;\n        left: -50%;\n        width: 200%;\n        height: 200%;\n        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);\n        animation: shimmer 3s ease-in-out infinite;\n      }\n      \n      @keyframes shimmer {\n        0%, 100% { transform: rotate(0deg); }\n        50% { transform: rotate(180deg); }\n      }\n      \n      .delivery-type-highlight h2 {\n        font-size: 24px;\n        font-weight: bold;\n        margin-bottom: 10px;\n        text-shadow: 0 2px 4px rgba(0,0,0,0.3);\n        position: relative;\n        z-index: 1;\n      }\n      \n      .delivery-type-badge {\n        display: inline-block;\n        background: rgba(255,255,255,0.2);\n        border: 2px solid rgba(255,255,255,0.5);\n        padding: 8px 20px;\n        border-radius: 25px;\n        font-size: 16px;\n        font-weight: bold;\n        text-transform: uppercase;\n        letter-spacing: 1px;\n        backdrop-filter: blur(10px);\n        position: relative;\n        z-index: 1;\n      }\n\n      .footer {\n        margin-top: 30px;\n        padding-top: 20px;\n        border-top: 1px solid #e9ecef;\n        text-align: center;\n        font-size: 10px;\n        color: #666;\n      }\n      \n      .signature-section {\n        margin-top: 40px;\n        display: grid;\n        grid-template-columns: 1fr 1fr;\n        gap: 40px;\n      }\n      \n      .signature-box {\n        border: 1px solid #ccc;\n        padding: 20px;\n        text-align: center;\n        border-radius: 4px;\n      }\n      \n      .signature-box h4 {\n        margin-bottom: 30px;\n        color: #26A69A;\n      }\n      \n      .signature-line {\n        border-bottom: 1px solid #333;\n        margin-bottom: 10px;\n        height: 40px;\n      }\n      \n      @media print {\n        .container {\n          padding: 10px;\n        }\n        \n        .group-section {\n          page-break-inside: avoid;\n        }\n      }\n    </style>\n  </head>\n  <body>\n    <div class=\"container\">\n      <div class=\"header\">\n        <div class=\"header-logos\">\n          <div class=\"logo-left\">\n            <img src=\"https://galatealabs.ai/assets/galatea-logo.png\" alt=\"GALATEA Logo\" class=\"logo-img\" />\n          </div>\n          <div class=\"header-content\">\n            <h1>\uD83D\uDCCB ORDER CHECKLIST</h1>\n            <h2>Order #").concat(data.orderNumber, " - ").concat(data.restaurantName || 'GALATEA', " Catering</h2>\n          </div>\n          <div class=\"logo-right\">\n            ").concat(data.restaurantImageUrl
                ? "<img src=\"".concat(data.restaurantImageUrl, "\" alt=\"Restaurant Logo\" class=\"logo-img\" />")
                : '<div class="logo-placeholder">Restaurant Logo</div>', "\n          </div>\n        </div>\n      </div>\n      \n      <!-- Delivery Type Highlight Section -->\n      <div class=\"delivery-type-highlight\">\n        <h2>\uD83D\uDE80 ").concat(capitalizeFirst(safeDeliveryType), " Order</h2>\n        <div class=\"delivery-type-badge\">").concat(capitalizeFirst(safeDeliveryType), "</div>\n      </div>\n      \n      <div class=\"order-info-grid\">\n        <div class=\"info-section\">\n          <h3>\uD83D\uDCCB Order Information</h3>\n          <div class=\"info-row\">\n            <span><strong>Order Number:</strong></span>\n            <span>#").concat(data.orderNumber, "</span>\n          </div>\n          <div class=\"info-row\">\n            <span><strong>Order Date:</strong></span>\n            <span>").concat(data.orderDate, "</span>\n          </div>\n          <div class=\"info-row\">\n            <span><strong>Status:</strong></span>\n            <span class=\"status-badge\">").concat(data.orderStatus, "</span>\n          </div>\n          <div class=\"info-row\">\n            <span><strong>Guests:</strong></span>\n            <span>").concat(data.guestNumber, " people</span>\n          </div>\n          <div class=\"info-row\">\n            <span><strong>").concat(capitalizeFirst(safeDeliveryType), " Time:</strong></span>\n            <span>").concat(data.estimatedDeliveryTime, "</span>\n          </div>\n        </div>\n        \n        <div class=\"info-section\">\n          <h3>\uD83D\uDC64 Customer Information</h3>\n          <div class=\"info-row\">\n            <span><strong>Name:</strong></span>\n            <span>").concat(data.customerName, "</span>\n          </div>\n          <div class=\"info-row\">\n            <span><strong>Email:</strong></span>\n            <span>").concat(data.customerEmail, "</span>\n          </div>\n          ").concat(data.customerPhone
                ? "\n          <div class=\"info-row\">\n            <span><strong>Phone:</strong></span>\n            <span>".concat(formatPhone(data.customerPhone), "</span>\n          </div>\n          ")
                : '', "\n        </div>\n      </div>\n      \n      ").concat(data.deliveryType === 'delivery'
                ? "\n      <div class=\"info-section\">\n        <h3>\uD83D\uDE9A Delivery Information</h3>\n        <div class=\"info-row\">\n          <span><strong>Address:</strong></span>\n          <span>".concat(data.deliveryAddress, "</span>\n        </div>\n        <div class=\"info-row\">\n          <span><strong>City:</strong></span>\n          <span>").concat(data.cityName, ", ").concat(data.stateName, "</span>\n        </div>\n        <div class=\"info-row\">\n          <span><strong>Country:</strong></span>\n          <span>").concat(data.countryName, "</span>\n        </div>\n      </div>\n      ")
                : '', "\n      \n      ").concat((data.comment && data.comment.trim()) ||
                (data.dietaryRestrictions && data.dietaryRestrictions.length > 0)
                ? "\n      <div class=\"info-section\" style=\"margin-top: 25px;\">\n        <h3>\uD83D\uDCDD Special Instructions</h3>\n        ".concat(data.comment && data.comment.trim()
                    ? "\n        <div class=\"info-row\">\n          <span><strong>Comments:</strong></span>\n          <span><strong>".concat(data.comment, "</strong></span>\n        </div>\n        ")
                    : '', "\n        ").concat(data.dietaryRestrictions && data.dietaryRestrictions.length > 0
                    ? "\n        <div class=\"info-row\">\n          <span><strong>Dietary Restrictions:</strong></span>\n          <span><strong>".concat(data.dietaryRestrictions.join(', '), "</strong></span>\n        </div>\n        ")
                    : '', "\n      </div>\n      ")
                : '', "\n      \n      <h2 class=\"section-title\">\uD83D\uDCCB Order Items Checklist</h2>\n      ").concat(groupsHtml, "\n      \n      <div class=\"totals-section\">\n        <div class=\"total-row\">\n          <span>Subtotal:</span>\n          <span>").concat(formatCurrency(data.subtotal), "</span>\n        </div>\n        <div class=\"total-row\">\n          <span>Delivery Fee:</span>\n          <span>").concat(formatCurrency(data.deliveryPrice), "</span>\n        </div>\n        ").concat(!data.discountAppliedAfterTax && data.discount && data.discount > 0
                ? "\n        <div class=\"total-row\" style=\"color: #28a745; font-weight: bold;\">\n          <span>Discount (applied before tax):</span>\n          <span>-".concat(formatCurrency(data.discount), "</span>\n        </div>\n        ")
                : '', "\n        <div class=\"total-row\">\n          <span>Taxes:</span>\n          <span>").concat(formatCurrency(data.taxValue), "</span>\n        </div>\n        ").concat(data.discountAppliedAfterTax && data.discount && data.discount > 0
                ? "\n        <div class=\"total-row\" style=\"color: #28a745; font-weight: bold;\">\n          <span>Discount (applied after tax):</span>\n          <span>-".concat(formatCurrency(data.discount), "</span>\n        </div>\n        ")
                : '', "\n        ").concat(data.tipAmount && data.tipAmount > 0
                ? "\n        <div class=\"total-row\">\n          <span>Tip:</span>\n          <span>".concat(formatCurrency(data.tipAmount), "</span>\n        </div>\n        ")
                : '', "\n        <div class=\"total-row final\">\n          <span>Total Amount:</span>\n          <span>").concat(formatCurrency(data.total), "</span>\n        </div>\n      </div>\n      \n      <div class=\"signature-section\">\n        <div class=\"signature-box\">\n          <h4>Prepared By</h4>\n          <div class=\"signature-line\"></div>\n          <p>Signature & Date</p>\n        </div>\n        <div class=\"signature-box\">\n          <h4>Quality Check</h4>\n          <div class=\"signature-line\"></div>\n          <p>Signature & Date</p>\n        </div>\n      </div>\n      \n      <div class=\"footer\">\n        <p><strong>").concat(data.branchName, "</strong></p>\n        <p>\uD83D\uDCCD ").concat(data.branchAddress, " | \uD83D\uDCDE ").concat(data.branchPhone, "</p>\n        <p>Generated on ").concat(new Date().toLocaleDateString(), " at ").concat(new Date().toLocaleTimeString(), "</p>\n      </div>\n    </div>\n  </body>\n</html>\n    ");
        };
        /**
         * 🧾 Generate grouped items HTML for invoice
         */
        PdfService_1.prototype.generateGroupedItemsHtml = function (itemGroups, formatCurrency) {
            if (!itemGroups || itemGroups.length === 0) {
                return this.generateLineItemsHtml([], formatCurrency);
            }
            return "\n      <div class=\"grouped-items-container\">\n        ".concat(itemGroups
                .map(function (group) { return "\n          <div class=\"invoice-group-section\">\n            <div class=\"invoice-group-header\">\n              <h3 class=\"invoice-group-title\">\n                \uD83C\uDF7D\uFE0F ".concat(group.groupName, "\n                ").concat(group.quantity > 1 ? " (x".concat(group.quantity, ")") : '', "\n                ").concat(group.variation ? " - ".concat(group.variation.name) : '', "\n              </h3>\n              <div class=\"invoice-group-price\">").concat(formatCurrency(group.groupPrice), "</div>\n            </div>\n            \n            ").concat(group.categories
                .map(function (category) { return "\n              <div class=\"invoice-category-section\">\n                <table class=\"category-items-table\">\n                  <thead>\n                    <tr>\n                      <th class=\"description\">Item</th>\n                      <th class=\"quantity\">Qty</th>\n                      <th class=\"unit-price\">Price</th>\n                      <th class=\"line-total\">Total</th>\n                    </tr>\n                  </thead>\n                  <tbody>\n                    ".concat(category.items
                .map(function (item) { return "\n                      <tr class=\"line-item\">\n                        <td class=\"description\">\n                          ".concat(item.description, "\n                          ").concat(item.customComment ? "<br><small style=\"color: #666; font-style: italic;\">\uD83D\uDCDD ".concat(item.customComment, "</small>") : '', "\n                        </td>\n                        <td class=\"quantity\">").concat(item.quantity, "</td>\n                        <td class=\"unit-price\">").concat(formatCurrency(item.unitPrice), "</td>\n                        <td class=\"line-total\">").concat(formatCurrency(item.total), "</td>\n                      </tr>\n                    "); })
                .join(''), "\n                  </tbody>\n                </table>\n              </div>\n            "); })
                .join(''), "\n            \n            <div class=\"invoice-group-total\">\n              <strong>Group Total: ").concat(formatCurrency(group.groupPrice * group.quantity), "</strong>\n            </div>\n          </div>\n        "); })
                .join(''), "\n      </div>\n    ");
        };
        /**
         * 🧾 Generate fallback line items HTML for invoice
         */
        PdfService_1.prototype.generateLineItemsHtml = function (lineItems, formatCurrency) {
            var itemsHtml = lineItems
                .map(function (item) { return "\n        <tr class=\"line-item\">\n          <td class=\"description\">\n            ".concat(item.description, "\n            ").concat(item.customComment ? "<br><small style=\"color: #666; font-style: italic;\">\uD83D\uDCDD ".concat(item.customComment, "</small>") : '', "\n          </td>\n          <td class=\"quantity\">").concat(item.quantity, "</td>\n          <td class=\"unit-price\">").concat(formatCurrency(item.unitPrice), "</td>\n          <td class=\"line-total\">").concat(formatCurrency(item.total), "</td>\n        </tr>\n      "); })
                .join('');
            return "\n      <table class=\"line-items-table\">\n        <thead>\n          <tr>\n            <th class=\"description\">Description</th>\n            <th class=\"quantity\">Qty</th>\n            <th class=\"unit-price\">Unit Price</th>\n            <th class=\"line-total\">Total</th>\n          </tr>\n        </thead>\n        <tbody>\n          ".concat(itemsHtml, "\n        </tbody>\n      </table>\n    ");
        };
        /**
         * 🧾 Generate US-style invoice HTML
         */
        PdfService_1.prototype.generateInvoiceHtml = function (data) {
            var formatCurrency = function (amount) { return "$".concat(amount.toFixed(2)); };
            var formatPhone = function (phone) {
                // Remove all non-digit characters
                var cleaned = phone.replace(/\D/g, '');
                // Format as (xxx) xxx-xxxx
                if (cleaned.length === 10) {
                    return "(".concat(cleaned.slice(0, 3), ") ").concat(cleaned.slice(3, 6), "-").concat(cleaned.slice(6));
                }
                // Return original if not 10 digits
                return phone;
            };
            // Generate HTML for grouped items (preferred) or fallback to line items
            var itemsHtml = data.itemGroups && data.itemGroups.length > 0
                ? this.generateGroupedItemsHtml(data.itemGroups, formatCurrency)
                : this.generateLineItemsHtml(data.lineItems, formatCurrency);
            return "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Invoice ".concat(data.invoiceNumber, "</title>\n    <style>\n        * {\n            margin: 0;\n            padding: 0;\n            box-sizing: border-box;\n        }\n        \n        body {\n            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;\n            font-size: 12px;\n            line-height: 1.4;\n            color: #333;\n            background-color: #fff;\n        }\n        \n        .invoice-container {\n            max-width: 800px;\n            margin: 0 auto;\n            padding: 20px;\n        }\n        \n        .invoice-header {\n            display: flex;\n            justify-content: space-between;\n            align-items: flex-start;\n            margin-bottom: 30px;\n            border-bottom: 2px solid #2c3e50;\n            padding-bottom: 20px;\n        }\n        \n        .company-info {\n            flex: 1;\n        }\n        \n        .company-logo {\n            max-width: 120px;\n            height: auto;\n            margin-bottom: 10px;\n        }\n        \n        .company-name {\n            font-size: 24px;\n            font-weight: bold;\n            color: #2c3e50;\n            margin-bottom: 5px;\n        }\n        \n        .company-details {\n            font-size: 11px;\n            color: #666;\n            line-height: 1.3;\n        }\n        \n        .invoice-title {\n            text-align: right;\n            flex: 0 0 auto;\n        }\n        \n        .invoice-title h1 {\n            font-size: 36px;\n            font-weight: bold;\n            color: #2c3e50;\n            margin-bottom: 10px;\n        }\n        \n        .invoice-meta {\n            font-size: 11px;\n            color: #666;\n        }\n        \n        .invoice-details {\n            display: flex;\n            justify-content: space-between;\n            margin-bottom: 30px;\n        }\n        \n        .bill-to, .invoice-info {\n            flex: 1;\n        }\n        \n        .invoice-info {\n            text-align: right;\n            margin-left: 40px;\n        }\n        \n        .section-title {\n            font-size: 14px;\n            font-weight: bold;\n            color: #2c3e50;\n            margin-bottom: 10px;\n            text-transform: uppercase;\n        }\n        \n        .detail-row {\n            margin-bottom: 4px;\n            font-size: 11px;\n        }\n        \n        .detail-label {\n            font-weight: bold;\n            color: #555;\n        }\n        \n        .line-items-table {\n            width: 100%;\n            border-collapse: collapse;\n            margin-bottom: 20px;\n        }\n        \n        .line-items-table th {\n            background-color: #2c3e50;\n            color: white;\n            padding: 12px 8px;\n            text-align: left;\n            font-size: 11px;\n            font-weight: bold;\n            text-transform: uppercase;\n        }\n        \n        .line-items-table th.quantity,\n        .line-items-table th.unit-price,\n        .line-items-table th.line-total {\n            text-align: right;\n            width: 80px;\n        }\n        \n        .line-items-table td {\n            padding: 10px 8px;\n            border-bottom: 1px solid #ddd;\n            font-size: 11px;\n        }\n        \n        .line-items-table td.quantity,\n        .line-items-table td.unit-price,\n        .line-items-table td.line-total {\n            text-align: right;\n        }\n        \n        .line-item:nth-child(even) {\n            background-color: #f8f9fa;\n        }\n        \n        .totals-section {\n            display: flex;\n            justify-content: flex-end;\n            margin-bottom: 30px;\n        }\n        \n        .totals-table {\n            width: 300px;\n        }\n        \n        .total-row {\n            display: flex;\n            justify-content: space-between;\n            padding: 8px 0;\n            font-size: 12px;\n        }\n        \n        .total-row.subtotal {\n            border-top: 1px solid #ddd;\n        }\n        \n        .total-row.final {\n            border-top: 2px solid #2c3e50;\n            border-bottom: 3px double #2c3e50;\n            font-weight: bold;\n            font-size: 14px;\n            color: #2c3e50;\n            margin-top: 5px;\n            padding: 12px 0;\n        }\n        \n        .payment-info {\n            background-color: #f8f9fa;\n            padding: 15px;\n            border-radius: 5px;\n            margin-bottom: 20px;\n        }\n        \n        .payment-status {\n            display: inline-block;\n            padding: 4px 12px;\n            border-radius: 15px;\n            font-size: 10px;\n            font-weight: bold;\n            text-transform: uppercase;\n        }\n        \n        .payment-status.paid {\n            background-color: #d4edda;\n            color: #155724;\n        }\n        \n        .payment-status.pending {\n            background-color: #fff3cd;\n            color: #856404;\n        }\n        \n        .grouped-items-container {\n            margin-bottom: 20px;\n        }\n        \n        .invoice-group-section {\n            margin-bottom: 25px;\n            border: 1px solid #ddd;\n            border-radius: 8px;\n            overflow: hidden;\n        }\n        \n        .invoice-group-header {\n            background-color: #f8f9fa;\n            padding: 12px 15px;\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            border-bottom: 1px solid #ddd;\n        }\n        \n        .invoice-group-title {\n            font-size: 14px;\n            font-weight: bold;\n            color: #2c3e50;\n            margin: 0;\n        }\n        \n        .invoice-group-price {\n            font-size: 14px;\n            font-weight: bold;\n            color: #27ae60;\n        }\n        \n        .invoice-category-section {\n            padding: 10px 15px;\n            border-bottom: 1px solid #f0f0f0;\n        }\n        \n        .invoice-category-section:last-child {\n            border-bottom: none;\n        }\n        \n        .invoice-category-title {\n            font-size: 12px;\n            font-weight: bold;\n            color: #666;\n            margin: 0 0 8px 0;\n            text-transform: uppercase;\n            letter-spacing: 0.5px;\n        }\n        \n        .category-items-table {\n            width: 100%;\n            border-collapse: collapse;\n            font-size: 11px;\n        }\n        \n        .category-items-table th {\n            background-color: #f8f9fa;\n            padding: 6px 8px;\n            text-align: left;\n            font-size: 10px;\n            font-weight: bold;\n            color: #555;\n            border: 1px solid #dee2e6;\n        }\n        \n        .category-items-table th.quantity,\n        .category-items-table th.unit-price,\n        .category-items-table th.line-total {\n            text-align: right;\n            width: 60px;\n        }\n        \n        .category-items-table td {\n            padding: 6px 8px;\n            border: 1px solid #dee2e6;\n        }\n        \n        .category-items-table td.quantity,\n        .category-items-table td.unit-price,\n        .category-items-table td.line-total {\n            text-align: right;\n        }\n        \n        .invoice-group-total {\n            background-color: #e8f5e8;\n            padding: 10px 15px;\n            text-align: right;\n            color: #27ae60;\n            font-size: 12px;\n        }\n        \n        .notes-section {\n            margin-top: 30px;\n            padding-top: 20px;\n            border-top: 1px solid #ddd;\n        }\n        \n        .footer {\n            margin-top: 40px;\n            padding-top: 20px;\n            border-top: 1px solid #ddd;\n            font-size: 10px;\n            color: #666;\n            text-align: center;\n        }\n        \n        @media print {\n            body { margin: 0; }\n            .invoice-container { max-width: none; margin: 0; padding: 15px; }\n        }\n    </style>\n</head>\n<body>\n    <div class=\"invoice-container\">\n        <!-- Header -->\n        <div class=\"invoice-header\">\n            <div class=\"company-info\">\n                ").concat(data.companyLogo ? "<img src=\"".concat(data.companyLogo, "\" alt=\"").concat(data.companyName, " Logo\" class=\"company-logo\">") : '', "\n                <div class=\"company-name\">").concat(data.companyName, "</div>\n                <div class=\"company-details\">\n                    ").concat(data.companyAddress, "<br>\n                    Phone: ").concat(formatPhone(data.companyPhone), "<br>\n                    ").concat(data.companyEmail ? "Email: ".concat(data.companyEmail) : '', "\n                </div>\n            </div>\n            <div class=\"invoice-title\">\n                <div style=\"margin-top: 15px; text-align: center;\">\n                    <img src=\"https://galatealabs.ai/assets/galatea-logo.png\" alt=\"GALATEA Logo\" style=\"max-width: 80px; height: auto; margin-bottom: 5px;\" />\n                    <div style=\"font-size: 10px; color: #666;\">Invoice Generated by GALATEA Technology</div>\n                </div>\n            </div>\n        </div>\n        \n        <!-- Invoice Details -->\n        <div class=\"invoice-details\">\n            <div class=\"bill-to\">\n                <div class=\"section-title\">Bill To:</div>\n                <div class=\"detail-row\"><strong>").concat(data.customerName, "</strong></div>\n                <div class=\"detail-row\">").concat(data.billingAddress, "</div>\n                <div class=\"detail-row\">").concat(data.cityName, ", ").concat(data.stateName, " ").concat(data.zipCode || '', "</div>\n                <div class=\"detail-row\">").concat(data.countryName, "</div>\n                <div class=\"detail-row\">Email: ").concat(data.customerEmail, "</div>\n                ").concat(data.customerPhone ? "<div class=\"detail-row\">Phone: ".concat(formatPhone(data.customerPhone), "</div>") : '', "\n            </div>\n            <div class=\"invoice-info\">\n                <div class=\"section-title\">Order Information:</div>\n                <div class=\"detail-row\"><span class=\"detail-label\">Order #:</span> ").concat(data.orderNumber, "</div>\n                <div class=\"detail-row\"><span class=\"detail-label\">Order Date:</span> ").concat(data.orderDate, "</div>\n                <div class=\"detail-row\"><span class=\"detail-label\">Order Time:</span> ").concat(data.orderTime, "</div>\n                ").concat(data.deliveryType ? "<div class=\"detail-row\"><span class=\"detail-label\">Service Type:</span> ".concat(data.deliveryType, "</div>") : '', "\n            </div>\n        </div>\n        \n        <!-- Line Items -->\n        ").concat(itemsHtml, "\n        \n        <!-- Totals -->\n        <div class=\"totals-section\">\n            <div class=\"totals-table\">\n                <div class=\"total-row subtotal\">\n                    <span>Subtotal:</span>\n                    <span>").concat(formatCurrency(data.subtotal), "</span>\n                </div>\n                ").concat(data.deliveryFee && data.deliveryFee > 0
                ? "\n                <div class=\"total-row\">\n                    <span>Delivery Fee:</span>\n                    <span>".concat(formatCurrency(data.deliveryFee), "</span>\n                </div>\n                ")
                : '', "\n                ").concat(data.discount && data.discount > 0
                ? "\n                <div class=\"total-row\">\n                    <span>Discount".concat(data.discountAppliedAfterTax ? ' (Applied After Tax)' : ' (Applied Before Tax)', ":</span>\n                    <span>-").concat(formatCurrency(data.discount), "</span>\n                </div>\n                ")
                : '', "\n                ").concat(data.taxAmount > 0
                ? "\n                <div class=\"total-row\">\n                    <span>Tax".concat(data.taxRate ? " (".concat(data.taxRate, "%)") : '', ":</span>\n                    <span>").concat(formatCurrency(data.taxAmount), "</span>\n                </div>\n                ")
                : '', "\n                ").concat(data.tipAmount && data.tipAmount > 0
                ? "\n                <div class=\"total-row\">\n                    <span>Tip:</span>\n                    <span>".concat(formatCurrency(data.tipAmount), "</span>\n                </div>\n                ")
                : '', "\n                <div class=\"total-row final\">\n                    <span>Total Amount:</span>\n                    <span>").concat(formatCurrency(data.total), "</span>\n                </div>\n            </div>\n        </div>\n        \n        <!-- Payment Information -->\n        <div class=\"payment-info\">\n            <div class=\"section-title\">Payment Information:</div>\n            <div class=\"detail-row\">\n                <span class=\"detail-label\">Payment Method:</span> ").concat(data.paymentMethod, "\n            </div>\n            <div class=\"detail-row\">\n                <span class=\"detail-label\">Payment Status:</span> \n                <span class=\"payment-status ").concat(data.paymentStatus.toLowerCase(), "\">").concat(data.paymentStatus, "</span>\n            </div>\n            ").concat(data.transactionId
                ? "\n            <div class=\"detail-row\">\n                <span class=\"detail-label\">Transaction ID:</span> ".concat(data.transactionId, "\n            </div>\n            ")
                : '', "\n        </div>\n        \n        <!-- Notes -->\n        ").concat(data.notes
                ? "\n        <div class=\"notes-section\">\n            <div class=\"section-title\">Notes:</div>\n            <div style=\"font-size: 11px; line-height: 1.4;\">".concat(data.notes, "</div>\n        </div>\n        ")
                : '', "\n        \n        <!-- Footer -->\n        <div class=\"footer\">\n            <img src=\"https://galatealabs.ai/assets/galatea-logo.png\" alt=\"GALATEA Logo\" style=\"max-width: 40px; height: auto; margin-bottom: 5px;\" />\n            <p style=\"margin: 0; font-size: 9px; color: #888;\">Powered by GALATEA Technology - Invoice generated on ").concat(new Date().toLocaleDateString('en-US'), " at ").concat(new Date().toLocaleTimeString('en-US'), "</p>\n        </div>\n    </div>\n</body>\n</html>\n    ");
        };
        /**
         * 🧾 Transform v2 order details to invoice data structure
         */
        PdfService_1.prototype.transformOrderDetailsV2ToInvoiceData = function (orderDetails, invoiceNumber, transactionId, restaurantData) {
            var orderInfo = orderDetails.get_order_details.OrderInfo;
            var paymentInfo = orderDetails.get_order_details.PaymentInfo;
            var customerInfo = orderDetails.get_order_details.CustomerInfo;
            var deliveryInfo = orderDetails.get_order_details.DeliveryInfo;
            // Process groups into structured format
            var itemGroups = [];
            var fallbackLineItems = [];
            // Group items by category from the structured data
            var categoryMap = new Map();
            if (orderInfo.groups) {
                for (var _i = 0, _a = orderInfo.groups; _i < _a.length; _i++) {
                    var group = _a[_i];
                    // Create invoice group
                    var invoiceGroup = {
                        groupName: group.group_name,
                        groupPrice: group.price || 0,
                        quantity: group.quantity || 1,
                        variation: group.variation_name
                            ? {
                                name: group.variation_name,
                                serves: group.quantity || 1,
                            }
                            : undefined,
                        categories: [],
                    };
                    // Process items in this group
                    if (group.items) {
                        for (var _b = 0, _c = group.items; _b < _c.length; _b++) {
                            var item = _c[_b];
                            var lineItem = {
                                description: item.comment || 'Menu Item',
                                quantity: item.quantity || 1,
                                unitPrice: item.price || 0,
                                total: item.total_value || 0,
                                customComment: item.custom_item_comment || undefined, // 🆕 Custom comment del item
                            };
                            // Try to determine category (fallback to generic category)
                            var categoryKey = "Category ".concat(group.category_id || 'Unknown');
                            if (!categoryMap.has(categoryKey)) {
                                categoryMap.set(categoryKey, []);
                            }
                            categoryMap.get(categoryKey).push(lineItem);
                            // Also add to fallback
                            fallbackLineItems.push(lineItem);
                        }
                    }
                    // Convert category map to categories array
                    invoiceGroup.categories = Array.from(categoryMap.entries()).map(function (_a) {
                        var categoryName = _a[0], items = _a[1];
                        return ({
                            categoryName: categoryName,
                            items: items,
                        });
                    });
                    itemGroups.push(invoiceGroup);
                    categoryMap.clear(); // Reset for next group
                }
            }
            // Add delivery fee as line item if exists
            var deliveryFee = (deliveryInfo === null || deliveryInfo === void 0 ? void 0 : deliveryInfo.delivery_price) || 0;
            if (deliveryFee > 0) {
                fallbackLineItems.push({
                    description: 'Delivery Service',
                    quantity: 1,
                    unitPrice: deliveryFee,
                    total: deliveryFee,
                });
            }
            return {
                // Company Information
                companyName: (restaurantData === null || restaurantData === void 0 ? void 0 : restaurantData.restaurantName) || 'Restaurant',
                companyAddress: orderInfo.branch_name || 'Restaurant Address',
                companyPhone: (restaurantData === null || restaurantData === void 0 ? void 0 : restaurantData.phone) || 'No phone',
                companyEmail: (restaurantData === null || restaurantData === void 0 ? void 0 : restaurantData.email) || undefined,
                companyLogo: (restaurantData === null || restaurantData === void 0 ? void 0 : restaurantData.restaurantimageurl) ||
                    'https://galatealabs.ai/assets/galatea-logo.png',
                // Invoice Details
                invoiceNumber: invoiceNumber,
                invoiceDate: new Date().toLocaleDateString('en-US'),
                // Customer Information
                customerName: customerInfo.customer_name || 'Customer',
                customerEmail: customerInfo.customer_email || '',
                customerPhone: customerInfo.customer_phone,
                billingAddress: customerInfo.customer_address || 'No address',
                cityName: 'City', // Extract from customer_address if needed
                stateName: 'State', // Extract from customer_address if needed
                countryName: 'USA',
                // Order Information
                orderNumber: orderInfo.order_id_visible || orderInfo.order_id.toString(),
                orderDate: new Date(orderInfo.order_date).toLocaleDateString('en-US'),
                orderTime: orderInfo.order_time || '',
                // Structured items (preferred)
                itemGroups: itemGroups.length > 0 ? itemGroups : undefined,
                // Fallback line items
                lineItems: fallbackLineItems,
                // Totals (fix calculations)
                subtotal: paymentInfo.subtotal || 0,
                deliveryFee: deliveryFee > 0 ? deliveryFee : undefined,
                discount: paymentInfo.discount || undefined, // 🆕 Descuento
                discountAppliedAfterTax: paymentInfo.calculate_discount_after_taxes || false, // 🆕 Si el descuento es después de impuestos
                taxRate: paymentInfo.tax_percent,
                taxAmount: paymentInfo.tax_price || 0, // Fix: use tax_price instead of 0
                tipAmount: paymentInfo.tip || 0,
                total: paymentInfo.total || 0,
                // Payment Information
                paymentMethod: 'Credit Card (Stripe)',
                paymentStatus: paymentInfo.payment_status === 'Paid' ? 'PAID' : 'PENDING',
                transactionId: transactionId,
                // Additional Information
                notes: orderInfo.comment
                    ? "Order Notes: ".concat(orderInfo.comment)
                    : undefined,
                deliveryType: (deliveryInfo === null || deliveryInfo === void 0 ? void 0 : deliveryInfo.delivery_type) || 'delivery',
            };
        };
        return PdfService_1;
    }());
    __setFunctionName(_classThis, "PdfService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PdfService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PdfService = _classThis;
}();
exports.PdfService = PdfService;
