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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailSearchDto = void 0;
// gmail-search.dto.ts
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var swagger_1 = require("@nestjs/swagger");
var GmailSearchDto = function () {
    var _a;
    var _query_decorators;
    var _query_initializers = [];
    var _query_extraInitializers = [];
    var _maxResults_decorators;
    var _maxResults_initializers = [];
    var _maxResults_extraInitializers = [];
    var _pageToken_decorators;
    var _pageToken_initializers = [];
    var _pageToken_extraInitializers = [];
    var _includeSpamTrash_decorators;
    var _includeSpamTrash_initializers = [];
    var _includeSpamTrash_extraInitializers = [];
    var _labelIds_decorators;
    var _labelIds_initializers = [];
    var _labelIds_extraInitializers = [];
    return _a = /** @class */ (function () {
            function GmailSearchDto() {
                this.query = __runInitializers(this, _query_initializers, void 0);
                this.maxResults = (__runInitializers(this, _query_extraInitializers), __runInitializers(this, _maxResults_initializers, 10));
                this.pageToken = (__runInitializers(this, _maxResults_extraInitializers), __runInitializers(this, _pageToken_initializers, void 0));
                this.includeSpamTrash = (__runInitializers(this, _pageToken_extraInitializers), __runInitializers(this, _includeSpamTrash_initializers, false));
                this.labelIds = (__runInitializers(this, _includeSpamTrash_extraInitializers), __runInitializers(this, _labelIds_initializers, void 0));
                __runInitializers(this, _labelIds_extraInitializers);
            }
            return GmailSearchDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _query_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Gmail search query (same format as Gmail search)',
                    example: 'from:example@gmail.com is:unread'
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _maxResults_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Maximum number of messages to return',
                    minimum: 1,
                    maximum: 500,
                    default: 10
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(500)];
            _pageToken_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Page token for pagination'
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _includeSpamTrash_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Include spam and trash',
                    default: false
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Boolean; }), (0, class_validator_1.IsBoolean)()];
            _labelIds_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Label IDs to filter by',
                    type: [String]
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _query_decorators, { kind: "field", name: "query", static: false, private: false, access: { has: function (obj) { return "query" in obj; }, get: function (obj) { return obj.query; }, set: function (obj, value) { obj.query = value; } }, metadata: _metadata }, _query_initializers, _query_extraInitializers);
            __esDecorate(null, null, _maxResults_decorators, { kind: "field", name: "maxResults", static: false, private: false, access: { has: function (obj) { return "maxResults" in obj; }, get: function (obj) { return obj.maxResults; }, set: function (obj, value) { obj.maxResults = value; } }, metadata: _metadata }, _maxResults_initializers, _maxResults_extraInitializers);
            __esDecorate(null, null, _pageToken_decorators, { kind: "field", name: "pageToken", static: false, private: false, access: { has: function (obj) { return "pageToken" in obj; }, get: function (obj) { return obj.pageToken; }, set: function (obj, value) { obj.pageToken = value; } }, metadata: _metadata }, _pageToken_initializers, _pageToken_extraInitializers);
            __esDecorate(null, null, _includeSpamTrash_decorators, { kind: "field", name: "includeSpamTrash", static: false, private: false, access: { has: function (obj) { return "includeSpamTrash" in obj; }, get: function (obj) { return obj.includeSpamTrash; }, set: function (obj, value) { obj.includeSpamTrash = value; } }, metadata: _metadata }, _includeSpamTrash_initializers, _includeSpamTrash_extraInitializers);
            __esDecorate(null, null, _labelIds_decorators, { kind: "field", name: "labelIds", static: false, private: false, access: { has: function (obj) { return "labelIds" in obj; }, get: function (obj) { return obj.labelIds; }, set: function (obj, value) { obj.labelIds = value; } }, metadata: _metadata }, _labelIds_initializers, _labelIds_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.GmailSearchDto = GmailSearchDto;
