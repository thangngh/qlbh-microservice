export class CreateMediaCommand {
  constructor(
    public readonly transactionId: string,
    public readonly productId: string,
    public readonly bucket: string,
    public readonly key: string,
    public readonly url: string,
    public readonly type?: string,
  ) { }
}

export class RollbackMediaCommand {
  constructor(
    public readonly transactionId: string,
    public readonly mediaId: string,
  ) { }
}
