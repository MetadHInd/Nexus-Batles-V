"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("vite");
var plugin_react_1 = require("@vitejs/plugin-react");
var path_1 = require("path");
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)()],
    resolve: {
        alias: {
            '@': path_1.default.resolve(__dirname, './src'),
            '@api': path_1.default.resolve(__dirname, './src/api'),
            '@components': path_1.default.resolve(__dirname, './src/components'),
            '@hooks': path_1.default.resolve(__dirname, './src/hooks'),
            '@pages': path_1.default.resolve(__dirname, './src/pages'),
            '@store': path_1.default.resolve(__dirname, './src/store'),
            '@types': path_1.default.resolve(__dirname, './src/types'),
            '@utils': path_1.default.resolve(__dirname, './src/utils'),
        },
    },
    server: {
        port: 5173,
        proxy: {
            // Proxy API calls to backend during development
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
        },
    },
});
