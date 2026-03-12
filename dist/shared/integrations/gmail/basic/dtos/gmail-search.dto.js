"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailSearchDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class GmailSearchDto {
    query;
    maxResults = 10;
    pageToken;
    includeSpamTrash = false;
    labelIds;
}
exports.GmailSearchDto = GmailSearchDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Gmail search query (same format as Gmail search)',
        example: 'from:example@gmail.com is:unread'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GmailSearchDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum number of messages to return',
        minimum: 1,
        maximum: 500,
        default: 10
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(500),
    __metadata("design:type", Number)
], GmailSearchDto.prototype, "maxResults", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page token for pagination'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GmailSearchDto.prototype, "pageToken", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include spam and trash',
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GmailSearchDto.prototype, "includeSpamTrash", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Label IDs to filter by',
        type: [String]
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], GmailSearchDto.prototype, "labelIds", void 0);
//# sourceMappingURL=gmail-search.dto.js.map