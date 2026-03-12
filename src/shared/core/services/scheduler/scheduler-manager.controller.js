"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
exports.SchedulerManagerController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var SchedulerManagerController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Scheduler Manager'), (0, common_1.Controller)('api/scheduler'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getAllTasks_decorators;
    var _getTaskStatus_decorators;
    var _triggerTask_decorators;
    var _enableTask_decorators;
    var _disableTask_decorators;
    var _resetTask_decorators;
    var _updateMaxExecutions_decorators;
    var SchedulerManagerController = _classThis = /** @class */ (function () {
        function SchedulerManagerController_1(schedulerManager) {
            this.schedulerManager = (__runInitializers(this, _instanceExtraInitializers), schedulerManager);
        }
        /**
         * Get all registered tasks and their status
         */
        SchedulerManagerController_1.prototype.getAllTasks = function () {
            return {
                tasks: this.schedulerManager.getAllTasksStatus(),
                total: this.schedulerManager.getAllTasksStatus().length,
            };
        };
        /**
         * Get specific task status
         */
        SchedulerManagerController_1.prototype.getTaskStatus = function (name) {
            var status = this.schedulerManager.getTaskStatus(name);
            if (!status) {
                return { error: 'Task not found', name: name };
            }
            return status;
        };
        /**
         * Manually trigger a task
         */
        SchedulerManagerController_1.prototype.triggerTask = function (name) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.schedulerManager.triggerTask(name)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, {
                                    message: "Task ".concat(name, " triggered successfully"),
                                    triggeredAt: new Date(),
                                }];
                    }
                });
            });
        };
        /**
         * Enable a task
         */
        SchedulerManagerController_1.prototype.enableTask = function (name) {
            this.schedulerManager.enableTask(name);
            return {
                message: "Task ".concat(name, " enabled"),
                status: this.schedulerManager.getTaskStatus(name),
            };
        };
        /**
         * Disable a task
         */
        SchedulerManagerController_1.prototype.disableTask = function (name) {
            this.schedulerManager.disableTask(name);
            return {
                message: "Task ".concat(name, " disabled"),
                status: this.schedulerManager.getTaskStatus(name),
            };
        };
        /**
         * Reset task execution count
         */
        SchedulerManagerController_1.prototype.resetTask = function (name) {
            this.schedulerManager.resetTaskCount(name);
            return {
                message: "Task ".concat(name, " count reset"),
                status: this.schedulerManager.getTaskStatus(name),
            };
        };
        /**
         * Update max executions
         */
        SchedulerManagerController_1.prototype.updateMaxExecutions = function (name, body) {
            this.schedulerManager.updateMaxExecutions(name, body.maxExecutions);
            return {
                message: "Task ".concat(name, " max executions updated"),
                maxExecutions: body.maxExecutions || 'infinite',
                status: this.schedulerManager.getTaskStatus(name),
            };
        };
        return SchedulerManagerController_1;
    }());
    __setFunctionName(_classThis, "SchedulerManagerController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getAllTasks_decorators = [(0, common_1.Get)('tasks'), (0, swagger_1.ApiOperation)({ summary: 'Get all registered scheduled tasks' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all tasks with status' })];
        _getTaskStatus_decorators = [(0, common_1.Get)('tasks/:name'), (0, swagger_1.ApiOperation)({ summary: 'Get status of a specific task' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Task status' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' })];
        _triggerTask_decorators = [(0, common_1.Post)('tasks/:name/trigger'), (0, swagger_1.ApiOperation)({ summary: 'Manually trigger a task execution' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Task triggered successfully' })];
        _enableTask_decorators = [(0, common_1.Post)('tasks/:name/enable'), (0, swagger_1.ApiOperation)({ summary: 'Enable a task' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Task enabled' })];
        _disableTask_decorators = [(0, common_1.Post)('tasks/:name/disable'), (0, swagger_1.ApiOperation)({ summary: 'Disable a task' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Task disabled' })];
        _resetTask_decorators = [(0, common_1.Post)('tasks/:name/reset'), (0, swagger_1.ApiOperation)({ summary: 'Reset task execution count' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Task count reset' })];
        _updateMaxExecutions_decorators = [(0, common_1.Post)('tasks/:name/max-executions'), (0, swagger_1.ApiOperation)({ summary: 'Update max executions for a task' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Max executions updated' })];
        __esDecorate(_classThis, null, _getAllTasks_decorators, { kind: "method", name: "getAllTasks", static: false, private: false, access: { has: function (obj) { return "getAllTasks" in obj; }, get: function (obj) { return obj.getAllTasks; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTaskStatus_decorators, { kind: "method", name: "getTaskStatus", static: false, private: false, access: { has: function (obj) { return "getTaskStatus" in obj; }, get: function (obj) { return obj.getTaskStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _triggerTask_decorators, { kind: "method", name: "triggerTask", static: false, private: false, access: { has: function (obj) { return "triggerTask" in obj; }, get: function (obj) { return obj.triggerTask; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _enableTask_decorators, { kind: "method", name: "enableTask", static: false, private: false, access: { has: function (obj) { return "enableTask" in obj; }, get: function (obj) { return obj.enableTask; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _disableTask_decorators, { kind: "method", name: "disableTask", static: false, private: false, access: { has: function (obj) { return "disableTask" in obj; }, get: function (obj) { return obj.disableTask; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resetTask_decorators, { kind: "method", name: "resetTask", static: false, private: false, access: { has: function (obj) { return "resetTask" in obj; }, get: function (obj) { return obj.resetTask; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateMaxExecutions_decorators, { kind: "method", name: "updateMaxExecutions", static: false, private: false, access: { has: function (obj) { return "updateMaxExecutions" in obj; }, get: function (obj) { return obj.updateMaxExecutions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SchedulerManagerController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SchedulerManagerController = _classThis;
}();
exports.SchedulerManagerController = SchedulerManagerController;
