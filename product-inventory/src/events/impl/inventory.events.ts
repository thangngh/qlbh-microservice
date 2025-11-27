export class InventoryCreatedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly inventoryId: string,
    public readonly productId: string,
    public readonly sku: string,
    public readonly quantity: number,
  ) { }
}
