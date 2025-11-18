import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { CreateApiGatewayDto } from './dto/create-api-gateway.dto';
import { UpdateApiGatewayDto } from './dto/update-api-gateway.dto';
import type { Request } from 'express';

@Controller('api-gateway')
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Post()
  create(@Body() createApiGatewayDto: CreateApiGatewayDto) {
    return this.apiGatewayService.create(createApiGatewayDto);
  }

  @Get()
  findAll() {
    return this.apiGatewayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apiGatewayService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApiGatewayDto: UpdateApiGatewayDto,
  ) {
    return this.apiGatewayService.update(+id, updateApiGatewayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiGatewayService.remove(+id);
  }

  @Post('/create-product')
  createProduct(@Body() productData: any, @Req() request: Request) {
    console.log(
      'Request Headers:',
      request.headers,
      request.headers['user-agent'],
    );
    // Logic to forward the product creation request to the appropriate microservice
    return this.apiGatewayService.createProduct(productData);
  }
}
