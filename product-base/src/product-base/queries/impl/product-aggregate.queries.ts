export class GetProductAggregateQuery {
  constructor(public readonly productId: string) { }
}

export class GetAllProductAggregatesQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) { }
}
