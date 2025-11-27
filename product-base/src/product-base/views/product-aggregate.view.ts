import { ViewEntity, ViewColumn, Connection } from 'typeorm';

@ViewEntity({
  name: 'product_aggregate_view',
  expression: (connection: Connection) => connection
    .createQueryBuilder()
    .select('pb.id', 'id')
    .addSelect('pb.name', 'name')
    .addSelect('pb.price', 'price')
    .addSelect('pb.description', 'description')
    .addSelect('pb.status', 'status')
    .addSelect('pb.created_at', 'createdAt')
    .addSelect('pb.updated_at', 'updatedAt')
    .addSelect('COUNT(DISTINCT pba.id)', 'attributeCount')
    .addSelect('COUNT(DISTINCT pbm.id)', 'mediaCount')
    .addSelect('COUNT(DISTINCT pi.id)', 'inventoryCount')
    .addSelect('COALESCE(SUM(pi.quantity), 0)', 'totalQuantity')
    .addSelect(
      `JSON_AGG(DISTINCT jsonb_build_object(
        'id', pba.id,
        'key', pba.key,
        'value', pba.value
      )) FILTER (WHERE pba.id IS NOT NULL)`,
      'attributes'
    )
    .addSelect(
      `JSON_AGG(DISTINCT jsonb_build_object(
        'id', pbm.id,
        'bucket', pbm.bucket,
        'key', pbm.key,
        'url', pbm.url
      )) FILTER (WHERE pbm.id IS NOT NULL)`,
      'media'
    )
    .addSelect(
      `JSON_AGG(DISTINCT jsonb_build_object(
        'id', pi.id,
        'sku', pi.sku,
        'quantity', pi.quantity
      )) FILTER (WHERE pi.id IS NOT NULL)`,
      'inventory'
    )
    .from('product_base', 'pb')
    .leftJoin('product_base_attribute', 'pba', 'pba.product_id = pb.id')
    .leftJoin('product_base_media', 'pbm', 'pbm.product_id = pb.id')
    .leftJoin('product_inventory', 'pi', 'pi.product_id = pb.id')
    .where('pb.status = :status', { status: 'ACTIVE' })
    .groupBy('pb.id')
})
export class ProductAggregateView {
  @ViewColumn()
  id: string;

  @ViewColumn()
  name: string;

  @ViewColumn()
  price: number;

  @ViewColumn()
  description: string;

  @ViewColumn()
  status: string;

  @ViewColumn()
  createdAt: Date;

  @ViewColumn()
  updatedAt: Date;

  @ViewColumn()
  attributeCount: number;

  @ViewColumn()
  mediaCount: number;

  @ViewColumn()
  inventoryCount: number;

  @ViewColumn()
  totalQuantity: number;

  @ViewColumn()
  attributes: Array<{
    id: string;
    key: string;
    value: string;
  }>;

  @ViewColumn()
  media: Array<{
    id: string;
    bucket: string;
    key: string;
    url: string;
  }>;

  @ViewColumn()
  inventory: Array<{
    id: string;
    sku: string;
    quantity: number;
  }>;
}
