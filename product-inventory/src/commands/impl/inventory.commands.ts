export class CreateInventoryCommand {
  constructor(
    public readonly transactionId: string,
    public readonly productId: string,
    public readonly sku: string,
    public readonly quantity: number,
  ) { }
}

export class RollbackInventoryCommand {
  constructor(
    public readonly transactionId: string,
    public readonly inventoryId: string,
  ) { }
}
