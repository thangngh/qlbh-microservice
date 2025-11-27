export class CreateProductAggregateDto {
  productBase: {
    name: string;
    price: number;
    description: string;
  };
  attributes: Array<{
    key: string;
    value: string;
  }>;
  media: Array<{
    url: string;
    type: string;
  }>;
  inventory: Array<{
    sku: string;
    quantity: number;
    attributes: Array<{
      key: string;
      value: string;
    }>;
    media: Array<{
      url: string;
      type: string;
    }>;
  }>;
}
