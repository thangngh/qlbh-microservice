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
exports.ProductBaseEntity = void 0;
const typeorm_1 = require("typeorm");
let ProductBaseEntity = class ProductBaseEntity {
    id;
    constructor(partial) {
        Object.assign(this, partial);
    }
    code;
    name;
    description;
    descriptionThumbnail;
    manufacturer;
};
exports.ProductBaseEntity = ProductBaseEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductBaseEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], ProductBaseEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], ProductBaseEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], ProductBaseEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'description_thumbnail',
        length: 255,
        type: 'varchar',
        nullable: false,
    }),
    __metadata("design:type", String)
], ProductBaseEntity.prototype, "descriptionThumbnail", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], ProductBaseEntity.prototype, "manufacturer", void 0);
exports.ProductBaseEntity = ProductBaseEntity = __decorate([
    (0, typeorm_1.Entity)('product_base'),
    __metadata("design:paramtypes", [Object])
], ProductBaseEntity);
//# sourceMappingURL=product-base.entity.js.map