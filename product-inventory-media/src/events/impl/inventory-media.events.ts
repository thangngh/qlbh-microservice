export class InventoryMediaCreatedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly mediaId: string,
    public readonly inventoryId: string,
  ) { }
}
