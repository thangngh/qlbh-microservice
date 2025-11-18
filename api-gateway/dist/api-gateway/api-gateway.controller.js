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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGatewayController = void 0;
const common_1 = require("@nestjs/common");
const api_gateway_service_1 = require("./api-gateway.service");
const create_api_gateway_dto_1 = require("./dto/create-api-gateway.dto");
const update_api_gateway_dto_1 = require("./dto/update-api-gateway.dto");
let ApiGatewayController = class ApiGatewayController {
    apiGatewayService;
    constructor(apiGatewayService) {
        this.apiGatewayService = apiGatewayService;
    }
    create(createApiGatewayDto) {
        return this.apiGatewayService.create(createApiGatewayDto);
    }
    findAll() {
        return this.apiGatewayService.findAll();
    }
    findOne(id) {
        return this.apiGatewayService.findOne(+id);
    }
    update(id, updateApiGatewayDto) {
        return this.apiGatewayService.update(+id, updateApiGatewayDto);
    }
    remove(id) {
        return this.apiGatewayService.remove(+id);
    }
    createProduct(productData, request) {
        console.log('Request Headers:', request.headers, request.headers['user-agent']);
        return this.apiGatewayService.createProduct(productData);
    }
};
exports.ApiGatewayController = ApiGatewayController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_api_gateway_dto_1.CreateApiGatewayDto]),
    __metadata("design:returntype", void 0)
], ApiGatewayController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiGatewayController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApiGatewayController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_api_gateway_dto_1.UpdateApiGatewayDto]),
    __metadata("design:returntype", void 0)
], ApiGatewayController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApiGatewayController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('/create-product'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ApiGatewayController.prototype, "createProduct", null);
exports.ApiGatewayController = ApiGatewayController = __decorate([
    (0, common_1.Controller)('api-gateway'),
    __metadata("design:paramtypes", [api_gateway_service_1.ApiGatewayService])
], ApiGatewayController);
//# sourceMappingURL=api-gateway.controller.js.map