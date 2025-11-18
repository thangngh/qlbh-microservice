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
exports.ApiGatewayService = void 0;
const common_1 = require("@nestjs/common");
let ApiGatewayService = class ApiGatewayService {
    client;
    bffService;
    constructor(client) {
        this.client = client;
    }
    create(createApiGatewayDto) {
        return 'This action adds a new apiGateway';
    }
    findAll() {
        return `This action returns all apiGateway`;
    }
    findOne(id) {
        return `This action returns a #${id} apiGateway`;
    }
    update(id, updateApiGatewayDto) {
        return `This action updates a #${id} apiGateway`;
    }
    remove(id) {
        return `This action removes a #${id} apiGateway`;
    }
    createProduct(productData) {
    }
};
exports.ApiGatewayService = ApiGatewayService;
exports.ApiGatewayService = ApiGatewayService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('BFF_SERVICE')),
    __metadata("design:paramtypes", [Object])
], ApiGatewayService);
//# sourceMappingURL=api-gateway.service.js.map