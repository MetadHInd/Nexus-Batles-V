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
exports.SchedulerManagerService = void 0;
var common_1 = require("@nestjs/common");
var cron_1 = require("cron");
/**
 * 🚀 Generic Scheduler Manager
 *
 * Allows dynamic registration of scheduled tasks with:
 * - Custom cron expressions
 * - Limited or infinite executions
 * - Enable/disable on the fly
 * - Execution tracking and status
 * - Error handling
 *
 * @example
 * // Register a task that runs every hour, 10 times max
 * schedulerManager.registerTask({
 *   name: 'hourly-cleanup',
 *   cronExpression: '0 * * * *', // Every hour at minute 0
 *   callback: async () => { await cleanupOldData(); },
 *   maxExecutions: 10,
 *   enabled: true
 * });
 *
 * // Register infinite task
 * schedulerManager.registerTask({
 *   name: 'check-orders',
 *   cronExpression: '0 * * * *',
 *   callback: async () => { await checkOrders(); }
 * });
 */
var SchedulerManagerService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SchedulerManagerService = _classThis = /** @class */ (function () {
        function SchedulerManagerService_1(schedulerRegistry) {
            this.schedulerRegistry = schedulerRegistry;
            this.logger = new common_1.Logger(SchedulerManagerService.name);
            this.tasks = new Map();
            this.callbacks = new Map();
            this.notifications = new Map();
            this.notificationTimeouts = new Map();
        }
        SchedulerManagerService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log('✅ SchedulerManager initialized');
                    return [2 /*return*/];
                });
            });
        };
        /**
         * Register a new scheduled task
         */
        SchedulerManagerService_1.prototype.registerTask = function (task) {
            var _this = this;
            if (this.tasks.has(task.name)) {
                this.logger.warn("\u26A0\uFE0F Task ".concat(task.name, " already exists, updating..."));
                this.unregisterTask(task.name);
            }
            // Store callback
            this.callbacks.set(task.name, task.callback);
            // Create task status
            var status = {
                name: task.name,
                cronExpression: task.cronExpression,
                isRunning: false,
                executionCount: 0,
                maxExecutions: task.maxExecutions,
                errors: 0,
                enabled: task.enabled !== false,
            };
            this.tasks.set(task.name, status);
            // Create cron job
            var job = new cron_1.CronJob(task.cronExpression, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.executeTask(task.name)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            // Register with NestJS scheduler registry
            this.schedulerRegistry.addCronJob(task.name, job);
            // Start if enabled
            if (status.enabled) {
                job.start();
                this.logger.log("\u2705 Task registered and started: ".concat(task.name, " (").concat(task.cronExpression, ")"));
            }
            else {
                this.logger.log("\uD83D\uDCCB Task registered (disabled): ".concat(task.name, " (").concat(task.cronExpression, ")"));
            }
            // Execute immediately if requested
            if (task.executeImmediately && status.enabled) {
                this.logger.log("\uD83D\uDE80 Executing task immediately: ".concat(task.name));
                setImmediate(function () { return _this.executeTask(task.name); });
            }
        };
        /**
         * Execute a task (internal)
         */
        SchedulerManagerService_1.prototype.executeTask = function (name) {
            return __awaiter(this, void 0, void 0, function () {
                var status, callback, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            status = this.tasks.get(name);
                            callback = this.callbacks.get(name);
                            if (!status || !callback) {
                                this.logger.error("\u274C Task ".concat(name, " not found"));
                                return [2 /*return*/];
                            }
                            // Check if enabled
                            if (!status.enabled) {
                                this.logger.debug("\u23ED\uFE0F Task ".concat(name, " is disabled, skipping"));
                                return [2 /*return*/];
                            }
                            // Check max executions
                            if (status.maxExecutions && status.executionCount >= status.maxExecutions) {
                                this.logger.log("\uD83C\uDFC1 Task ".concat(name, " reached max executions (").concat(status.maxExecutions, "), stopping"));
                                this.disableTask(name);
                                return [2 /*return*/];
                            }
                            // Mark as running
                            status.isRunning = true;
                            status.lastExecution = new Date();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            this.logger.log("\uD83C\uDFC3 Executing task: ".concat(name, " (execution #").concat(status.executionCount + 1, ")"));
                            return [4 /*yield*/, callback()];
                        case 2:
                            _a.sent();
                            status.executionCount++;
                            this.logger.log("\u2705 Task ".concat(name, " completed successfully (total: ").concat(status.executionCount, ")"));
                            return [3 /*break*/, 5];
                        case 3:
                            error_1 = _a.sent();
                            status.errors++;
                            status.lastError = error_1.message;
                            this.logger.error("\u274C Task ".concat(name, " failed: ").concat(error_1.message), error_1.stack);
                            return [3 /*break*/, 5];
                        case 4:
                            status.isRunning = false;
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Manually trigger a task execution (ignores max executions check)
         */
        SchedulerManagerService_1.prototype.triggerTask = function (name) {
            return __awaiter(this, void 0, void 0, function () {
                var callback;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            callback = this.callbacks.get(name);
                            if (!callback) {
                                throw new Error("Task ".concat(name, " not found"));
                            }
                            this.logger.log("\uD83D\uDD27 Manual trigger: ".concat(name));
                            return [4 /*yield*/, callback()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Enable a task
         */
        SchedulerManagerService_1.prototype.enableTask = function (name) {
            var status = this.tasks.get(name);
            if (!status) {
                throw new Error("Task ".concat(name, " not found"));
            }
            status.enabled = true;
            var job = this.schedulerRegistry.getCronJob(name);
            job.start();
            this.logger.log("\u25B6\uFE0F Task enabled: ".concat(name));
        };
        /**
         * Disable a task
         */
        SchedulerManagerService_1.prototype.disableTask = function (name) {
            var status = this.tasks.get(name);
            if (!status) {
                throw new Error("Task ".concat(name, " not found"));
            }
            status.enabled = false;
            var job = this.schedulerRegistry.getCronJob(name);
            job.stop();
            this.logger.log("\u23F8\uFE0F Task disabled: ".concat(name));
        };
        /**
         * Unregister a task completely
         */
        SchedulerManagerService_1.prototype.unregisterTask = function (name) {
            if (!this.tasks.has(name)) {
                throw new Error("Task ".concat(name, " not found"));
            }
            this.schedulerRegistry.deleteCronJob(name);
            this.tasks.delete(name);
            this.callbacks.delete(name);
            this.logger.log("\uD83D\uDDD1\uFE0F Task unregistered: ".concat(name));
        };
        /**
         * Get status of a specific task
         */
        SchedulerManagerService_1.prototype.getTaskStatus = function (name) {
            var _a;
            var status = this.tasks.get(name);
            if (!status)
                return undefined;
            try {
                var job = this.schedulerRegistry.getCronJob(name);
                return __assign(__assign({}, status), { nextExecution: (_a = job.nextDate()) === null || _a === void 0 ? void 0 : _a.toJSDate() });
            }
            catch (_b) {
                return status;
            }
        };
        /**
         * Get status of all tasks
         */
        SchedulerManagerService_1.prototype.getAllTasksStatus = function () {
            var allStatus = [];
            for (var _i = 0, _a = this.tasks; _i < _a.length; _i++) {
                var name_1 = _a[_i][0];
                var status_1 = this.getTaskStatus(name_1);
                if (status_1) {
                    allStatus.push(status_1);
                }
            }
            return allStatus;
        };
        /**
         * Reset execution count for a task
         */
        SchedulerManagerService_1.prototype.resetTaskCount = function (name) {
            var status = this.tasks.get(name);
            if (!status) {
                throw new Error("Task ".concat(name, " not found"));
            }
            status.executionCount = 0;
            status.errors = 0;
            status.lastError = undefined;
            this.logger.log("\uD83D\uDD04 Task count reset: ".concat(name));
        };
        /**
         * Update max executions for a task
         */
        SchedulerManagerService_1.prototype.updateMaxExecutions = function (name, maxExecutions) {
            var status = this.tasks.get(name);
            if (!status) {
                throw new Error("Task ".concat(name, " not found"));
            }
            status.maxExecutions = maxExecutions;
            this.logger.log("\uD83D\uDD27 Task ".concat(name, " max executions updated: ").concat(maxExecutions || 'infinite'));
        };
        // ========================================
        // 📬 NOTIFICATION QUEUE METHODS
        // ========================================
        /**
         * Schedule a notification to be executed at a specific time
         */
        SchedulerManagerService_1.prototype.scheduleNotification = function (notification) {
            var _this = this;
            var now = new Date();
            var scheduledTime = new Date(notification.scheduledTime);
            var delay = scheduledTime.getTime() - now.getTime();
            if (delay < 0) {
                this.logger.warn("\u26A0\uFE0F Notification ".concat(notification.id, " scheduled in the past, executing immediately"));
                setImmediate(function () { return _this.executeNotification(notification.id); });
                return;
            }
            // Store notification
            this.notifications.set(notification.id, notification);
            // Schedule timeout
            var timeout = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.executeNotification(notification.id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }, delay);
            this.notificationTimeouts.set(notification.id, timeout);
            this.logger.log("\uD83D\uDCEC Notification scheduled: ".concat(notification.id, " (").concat(notification.type, ") ") +
                "at ".concat(scheduledTime.toISOString(), " (").concat(notification.timezone, ")"));
        };
        /**
         * Execute a scheduled notification
         */
        SchedulerManagerService_1.prototype.executeNotification = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var notification, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            notification = this.notifications.get(id);
                            if (!notification) {
                                this.logger.warn("\u26A0\uFE0F Notification ".concat(id, " not found"));
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            this.logger.log("\uD83D\uDCE4 Executing notification: ".concat(id, " (").concat(notification.type, ")"));
                            return [4 /*yield*/, notification.callback()];
                        case 2:
                            _a.sent();
                            this.logger.log("\u2705 Notification ".concat(id, " executed successfully"));
                            return [3 /*break*/, 5];
                        case 3:
                            error_2 = _a.sent();
                            this.logger.error("\u274C Notification ".concat(id, " failed: ").concat(error_2.message), error_2.stack);
                            throw error_2;
                        case 4:
                            // Cleanup
                            this.notifications.delete(id);
                            this.notificationTimeouts.delete(id);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Cancel a scheduled notification
         */
        SchedulerManagerService_1.prototype.cancelNotification = function (id) {
            var timeout = this.notificationTimeouts.get(id);
            if (timeout) {
                clearTimeout(timeout);
                this.notificationTimeouts.delete(id);
                this.notifications.delete(id);
                this.logger.log("\uD83D\uDDD1\uFE0F Notification cancelled: ".concat(id));
            }
        };
        /**
         * Get notification queue status
         */
        SchedulerManagerService_1.prototype.getNotificationQueueStatus = function () {
            var byType = {};
            var upcoming = [];
            for (var _i = 0, _a = this.notifications; _i < _a.length; _i++) {
                var _b = _a[_i], notification = _b[1];
                byType[notification.type] = (byType[notification.type] || 0) + 1;
                upcoming.push(notification);
            }
            // Sort by scheduled time
            upcoming.sort(function (a, b) { return a.scheduledTime.getTime() - b.scheduledTime.getTime(); });
            return {
                totalScheduled: this.notifications.size,
                byType: byType,
                upcoming: upcoming.slice(0, 50), // First 50
            };
        };
        /**
         * Get notifications by type
         */
        SchedulerManagerService_1.prototype.getNotificationsByType = function (type) {
            var notifications = [];
            for (var _i = 0, _a = this.notifications; _i < _a.length; _i++) {
                var _b = _a[_i], notification = _b[1];
                if (notification.type === type) {
                    notifications.push(notification);
                }
            }
            return notifications.sort(function (a, b) { return a.scheduledTime.getTime() - b.scheduledTime.getTime(); });
        };
        /**
         * Clear all scheduled notifications
         */
        SchedulerManagerService_1.prototype.clearAllNotifications = function () {
            for (var _i = 0, _a = this.notifications; _i < _a.length; _i++) {
                var id = _a[_i][0];
                this.cancelNotification(id);
            }
            this.logger.log("\uD83E\uDDF9 All notifications cleared");
        };
        /**
         * Clear notifications by type
         */
        SchedulerManagerService_1.prototype.clearNotificationsByType = function (type) {
            var _this = this;
            var toCancel = [];
            for (var _i = 0, _a = this.notifications; _i < _a.length; _i++) {
                var _b = _a[_i], id = _b[0], notification = _b[1];
                if (notification.type === type) {
                    toCancel.push(id);
                }
            }
            toCancel.forEach(function (id) { return _this.cancelNotification(id); });
            this.logger.log("\uD83E\uDDF9 Cleared ".concat(toCancel.length, " notifications of type: ").concat(type));
        };
        return SchedulerManagerService_1;
    }());
    __setFunctionName(_classThis, "SchedulerManagerService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SchedulerManagerService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SchedulerManagerService = _classThis;
}();
exports.SchedulerManagerService = SchedulerManagerService;
