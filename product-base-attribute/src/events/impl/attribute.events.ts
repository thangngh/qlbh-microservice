export class AttributeCreatedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly attributeId: string,
    public readonly productId: string,
  ) { }
}
