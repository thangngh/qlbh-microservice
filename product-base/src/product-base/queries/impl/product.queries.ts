export class GetProductQuery {
  constructor(public readonly productId: string) { }
}

export class GetAllProductsQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) { }
}
