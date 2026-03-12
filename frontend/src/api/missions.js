"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.missionsApi = void 0;
var client_1 = require("./client");
exports.missionsApi = {
    getActive: function () {
        return client_1.apiClient.get('/missions/active');
    },
    getHistory: function (params) {
        return client_1.apiClient.get('/missions/history', { params: params });
    },
    generate: function (difficulty) {
        if (difficulty === void 0) { difficulty = 'MEDIUM'; }
        return client_1.apiClient.post('/missions/generate', { difficulty: difficulty });
    },
    complete: function (missionId) {
        return client_1.apiClient.post("/missions/".concat(missionId, "/complete"));
    },
};
