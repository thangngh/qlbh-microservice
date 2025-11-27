export class CreateInventoryMediaCommand {
  constructor(
    public readonly transactionId: string,
    public readonly inventoryId: string,
    public readonly bucket: string,
    public readonly key: string,
    public readonly url: string,
    public readonly type?: string,
  ) { }
}

export class RollbackInventoryMediaCommand {
  constructor(
    public readonly transactionId: string,
    public readonly mediaId: string,
  ) { }
}
