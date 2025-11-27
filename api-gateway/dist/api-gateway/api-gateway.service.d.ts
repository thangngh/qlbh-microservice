import { OnModuleInit } from '@nestjs/common';
import { CreateApiGatewayDto } from './dto/create-api-gateway.dto';
import { UpdateApiGatewayDto } from './dto/update-api-gateway.dto';
import type { ClientGrpc } from '@nestjs/microservices';
export declare class ApiGatewayService implements OnModuleInit {
    private readonly client;
    private bffService;
    constructor(client: ClientGrpc);
    onModuleInit(): void;
    create(createApiGatewayDto: CreateApiGatewayDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateApiGatewayDto: UpdateApiGatewayDto): string;
    remove(id: number): string;
    createProduct(productData: any): Promise<any>;
}
