export class MediaCreatedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly mediaId: string,
    public readonly productId: string,
  ) { }
}
