"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIASocketService = void 0;
var socket_io_client_1 = require("socket.io-client");
var AIASocketService = /** @class */ (function () {
    function AIASocketService(baseUrl, authToken) {
        this.baseUrl = baseUrl;
        this.authToken = authToken;
        this.socket = null;
        this.managerId = null; // Changed to string to match backend
        this.sessionId = null; // Track session ID from backend
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }
    /**
     * Connect to AIA WebSocket server
     */
    AIASocketService.prototype.connect = function (managerId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.managerId = String(managerId); // Convert to string for backend compatibility
            console.log('🔌 Connecting to AIA WebSocket:', _this.baseUrl);
            _this.socket = (0, socket_io_client_1.io)(_this.baseUrl, {
                auth: {
                    token: _this.authToken
                },
                transports: ['websocket'],
                upgrade: false,
                rememberUpgrade: false,
                timeout: 10000,
                forceNew: true
            });
            _this.socket.on('connect', function () {
                console.log('🔌 Connected to AIA WebSocket');
                _this.reconnectAttempts = 0;
                // Don't resolve here - wait for session creation
            });
            // Handle session creation (automatic from backend)
            _this.socket.on('AIA_SESSION_CREATED', function (data) {
                var _a;
                console.log('🆔 Session created:', data);
                _this.sessionId = data.sessionId;
                (_a = _this.onSessionCreated) === null || _a === void 0 ? void 0 : _a.call(_this, data);
                resolve(); // Resolve here when session is ready
            });
            _this.socket.on('connect_error', function (error) {
                console.error('❌ Connection error:', error);
                reject(error);
            });
            _this.socket.on('disconnect', function (reason) {
                console.log('🔌 Disconnected:', reason);
                if (reason !== 'io client disconnect') {
                    _this.handleReconnection();
                }
            });
            // Set up event listeners
            _this.setupEventListeners();
        });
    };
    /**
     * Send query to AI assistant
     */
    AIASocketService.prototype.sendQuery = function (query) {
        var _a;
        if (!((_a = this.socket) === null || _a === void 0 ? void 0 : _a.connected)) {
            throw new Error('Socket not connected');
        }
        if (!this.sessionId || !this.managerId) {
            throw new Error('Session not established. Please wait for connection to complete.');
        }
        console.log('📤 Sending query to AIA:', { query: query, sessionId: this.sessionId });
        // Use correct payload structure expected by backend
        this.socket.emit('AIA_QUERY', {
            sessionId: this.sessionId,
            managerId: this.managerId,
            query: query,
            timestamp: new Date().toISOString(),
            userInfo: {} // Optional field
        });
    };
    /**
     * Set up event listeners for AI responses
     */
    AIASocketService.prototype.setupEventListeners = function () {
        var _this = this;
        if (!this.socket)
            return;
        // Session created (handled in connect method too)
        this.socket.on('AIA_SESSION_CREATED', function (data) {
            var _a;
            console.log('🆔 Session created:', data);
            _this.sessionId = data.sessionId;
            (_a = _this.onSessionCreated) === null || _a === void 0 ? void 0 : _a.call(_this, data);
        });
        // Typing indicator
        this.socket.on('AIA_TYPING', function (data) {
            var _a;
            console.log('⌨️ Typing status:', data);
            (_a = _this.onTyping) === null || _a === void 0 ? void 0 : _a.call(_this, data);
        });
        // Progress updates
        this.socket.on('AIA_PROGRESS', function (data) {
            var _a;
            console.log('📊 Progress update:', data);
            (_a = _this.onProgress) === null || _a === void 0 ? void 0 : _a.call(_this, data);
        });
        // Final response
        this.socket.on('AIA_RESPONSE', function (data) {
            var _a;
            console.log('✅ Response received:', data);
            (_a = _this.onResponse) === null || _a === void 0 ? void 0 : _a.call(_this, data);
        });
        // Error handling
        this.socket.on('AIA_ERROR', function (data) {
            var _a;
            console.error('❌ AIA Error:', data);
            (_a = _this.onError) === null || _a === void 0 ? void 0 : _a.call(_this, data);
        });
        // Tool execution events
        this.socket.on('AIA_TOOL_EXECUTING', function (data) {
            var _a;
            console.log('🔧 Tool executing:', data);
            (_a = _this.onToolExecuting) === null || _a === void 0 ? void 0 : _a.call(_this, data);
        });
        this.socket.on('AIA_TOOL_COMPLETED', function (data) {
            var _a;
            console.log('✅ Tool completed:', data);
            (_a = _this.onToolCompleted) === null || _a === void 0 ? void 0 : _a.call(_this, data);
        });
        // Processing complete
        this.socket.on('AIA_PROCESSING_COMPLETE', function (data) {
            var _a;
            console.log('🎉 Processing complete:', data);
            (_a = _this.onProcessingComplete) === null || _a === void 0 ? void 0 : _a.call(_this, data);
        });
    };
    /**
     * Handle automatic reconnection
     */
    AIASocketService.prototype.handleReconnection = function () {
        var _this = this;
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            var delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
            console.log("\uD83D\uDD04 Attempting reconnection ".concat(this.reconnectAttempts, "/").concat(this.maxReconnectAttempts, " in ").concat(delay, "ms"));
            setTimeout(function () {
                if (_this.managerId) {
                    _this.connect(parseInt(_this.managerId)).catch(console.error);
                }
            }, delay);
        }
        else {
            console.error('❌ Max reconnection attempts reached');
        }
    };
    /**
     * Check if socket is connected and session is ready
     */
    AIASocketService.prototype.isConnected = function () {
        var _a;
        return ((_a = this.socket) === null || _a === void 0 ? void 0 : _a.connected) && this.sessionId !== null || false;
    };
    /**
     * Get current session ID
     */
    AIASocketService.prototype.getSessionId = function () {
        return this.sessionId;
    };
    /**
     * Disconnect from server
     */
    AIASocketService.prototype.disconnect = function () {
        if (this.socket) {
            console.log('🔌 Disconnecting from AIA WebSocket');
            this.socket.disconnect();
            this.socket = null;
            this.sessionId = null;
        }
    };
    return AIASocketService;
}());
exports.AIASocketService = AIASocketService;
