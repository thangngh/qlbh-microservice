export class CreateProductCommand {
  constructor(
    public readonly transactionId: string,
    public readonly name: string,
    public readonly price: number,
    public readonly description: string,
  ) { }
}

export class ProductCreatedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly productId: number,
  ) { }
}

export class RollbackProductCommand {
  constructor(
    public readonly transactionId: string,
    public readonly reason: string,
  ) { }
}

// Inventory
export class CreateInventoryCommand {
  constructor(
    public readonly transactionId: string,
    public readonly productId: number,
    public readonly quantity: number,
  ) { }
}

export class InventoryCreatedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly inventoryId: number,
  ) { }
}

// Media
export class UploadMediaCommand {
  constructor(
    public readonly transactionId: string,
    public readonly productId: number,
    public readonly mediaUrls: string[],
  ) { }
}

export class MediaUploadedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly mediaId: number,
  ) { }
}
