import { Inject, Injectable } from '@nestjs/common';
import { CreateApiGatewayDto } from './dto/create-api-gateway.dto';
import { UpdateApiGatewayDto } from './dto/update-api-gateway.dto';
import { Observable } from 'rxjs';
import type { ClientGrpc } from '@nestjs/microservices';

interface BffService {
  createProduct(productData: any): Observable<any>;
}
@Injectable()
export class ApiGatewayService {
  private bffService: BffService;

  constructor(@Inject('BFF_SERVICE') private readonly client: ClientGrpc) {}

  create(createApiGatewayDto: CreateApiGatewayDto) {
    return 'This action adds a new apiGateway';
  }

  findAll() {
    return `This action returns all apiGateway`;
  }

  findOne(id: number) {
    return `This action returns a #${id} apiGateway`;
  }

  update(id: number, updateApiGatewayDto: UpdateApiGatewayDto) {
    return `This action updates a #${id} apiGateway`;
  }

  remove(id: number) {
    return `This action removes a #${id} apiGateway`;
  }

  createProduct(productData: any) {
    
  }
}
