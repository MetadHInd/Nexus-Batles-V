"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCloudStorageModule = void 0;
const common_1 = require("@nestjs/common");
const google_cloud_storage_service_1 = require("./google-cloud-storage.service");
let GoogleCloudStorageModule = class GoogleCloudStorageModule {
};
exports.GoogleCloudStorageModule = GoogleCloudStorageModule;
exports.GoogleCloudStorageModule = GoogleCloudStorageModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [google_cloud_storage_service_1.GoogleCloudStorageService],
        exports: [google_cloud_storage_service_1.GoogleCloudStorageService],
    })
], GoogleCloudStorageModule);
//# sourceMappingURL=google-cloud-storage.module.js.map