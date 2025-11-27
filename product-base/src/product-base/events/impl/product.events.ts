export class ProductCreatedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly productId: string,
    public readonly name: string,
    public readonly price: number,
  ) { }
}
