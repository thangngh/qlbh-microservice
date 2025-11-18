import { CreateApiGatewayDto } from './dto/create-api-gateway.dto';
import { UpdateApiGatewayDto } from './dto/update-api-gateway.dto';
import type { ClientGrpc } from '@nestjs/microservices';
export declare class ApiGatewayService {
    private readonly client;
    private bffService;
    constructor(client: ClientGrpc);
    create(createApiGatewayDto: CreateApiGatewayDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateApiGatewayDto: UpdateApiGatewayDto): string;
    remove(id: number): string;
    createProduct(productData: any): void;
}
