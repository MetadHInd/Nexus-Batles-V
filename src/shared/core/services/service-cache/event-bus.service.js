"use strict";
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
exports.eventBus = exports.EventBusService = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-argument */
var events_1 = require("events");
var EventBusService = /** @class */ (function () {
    function EventBusService() {
        this.emitter = new events_1.EventEmitter();
        this.emitter.setMaxListeners(50);
    }
    EventBusService.getInstance = function () {
        if (!EventBusService.instance) {
            EventBusService.instance = new EventBusService();
        }
        return EventBusService.instance;
    };
    EventBusService.prototype.getEventKey = function (event) {
        if (typeof event === 'string') {
            return event;
        }
        if (Array.isArray(event) && event.length === 2) {
            var cls = event[0], evt = event[1];
            return "".concat(cls.name, ":").concat(evt);
        }
        // Use the class constructor's name as the key
        return event.name || event.toString();
    };
    EventBusService.prototype.emit = function (event) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (_a = this.emitter).emit.apply(_a, __spreadArray([this.getEventKey(event)], args, false));
    };
    EventBusService.prototype.on = function (event, handler) {
        this.emitter.on(this.getEventKey(event), handler);
    };
    EventBusService.prototype.off = function (event, handler) {
        this.emitter.off(this.getEventKey(event), handler);
    };
    return EventBusService;
}());
exports.EventBusService = EventBusService;
exports.eventBus = EventBusService.getInstance();
