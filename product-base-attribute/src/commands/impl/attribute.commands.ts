export class CreateAttributeCommand {
  constructor(
    public readonly transactionId: string,
    public readonly productId: string,
    public readonly key: string,
    public readonly value: string,
  ) { }
}

export class RollbackAttributeCommand {
  constructor(
    public readonly transactionId: string,
    public readonly attributeId: string,
  ) { }
}
