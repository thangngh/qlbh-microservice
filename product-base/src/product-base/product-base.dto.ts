export class CreateProductDto {
  transactionId: string;
  name: string;
  price: number;
  description: string;
}

export class RollbackProductDto {
  transactionId: string;
  reason: string;
}

export class ProductCreatedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly productId: number,
  ) { }
}
