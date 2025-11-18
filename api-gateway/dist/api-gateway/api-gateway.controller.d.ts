import { ApiGatewayService } from './api-gateway.service';
import { CreateApiGatewayDto } from './dto/create-api-gateway.dto';
import { UpdateApiGatewayDto } from './dto/update-api-gateway.dto';
import type { Request } from 'express';
export declare class ApiGatewayController {
    private readonly apiGatewayService;
    constructor(apiGatewayService: ApiGatewayService);
    create(createApiGatewayDto: CreateApiGatewayDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateApiGatewayDto: UpdateApiGatewayDto): string;
    remove(id: string): string;
    createProduct(productData: any, request: Request): void;
}
