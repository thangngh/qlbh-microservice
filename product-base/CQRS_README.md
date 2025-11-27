# CQRS Pattern Implementation

## Overview

This service implements the **CQRS (Command Query Responsibility Segregation)** pattern with **Event Sourcing** for the Product Base microservice.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Commands (Write)                      │
├─────────────────────────────────────────────────────────────┤
│  CreateProductCommand → CreateProductHandler                 │
│  RollbackProductCommand → RollbackProductHandler             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                          Events                              │
├─────────────────────────────────────────────────────────────┤
│  ProductCreatedEvent → ProductCreatedHandler → Kafka         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Queries (Read)                          │
├─────────────────────────────────────────────────────────────┤
│  GetProductQuery → GetProductHandler                         │
│  GetProductAggregateQuery → GetProductAggregateHandler       │
│  GetAllProductAggregatesQuery → GetAllProductAggregatesHandler│
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. Commands (Write Side)

**Location**: `src/product-base/commands/`

- **CreateProductCommand**: Creates a new product
  ```typescript
  new CreateProductCommand(transactionId, name, price, description)
  ```

- **RollbackProductCommand**: Soft deletes a product (sets status to 'DELETED')
  ```typescript
  new RollbackProductCommand(transactionId, productId)
  ```

### 2. Events

**Location**: `src/product-base/events/`

- **ProductCreatedEvent**: Published when a product is created
  - Automatically emitted to Kafka for Saga orchestration
  - Contains: `transactionId`, `productId`, `name`, `price`

### 3. Queries (Read Side)

**Location**: `src/product-base/queries/`

- **GetProductQuery**: Fetch a single product by ID
- **GetProductAggregateQuery**: Fetch product with all related data (attributes, media, inventory)
- **GetAllProductAggregatesQuery**: Fetch paginated list of products with aggregated data

### 4. Materialized View

**Location**: `src/product-base/views/product-aggregate.view.ts`

A PostgreSQL view that aggregates data from multiple tables:

```sql
SELECT 
  pb.*,
  COUNT(DISTINCT pba.id) as attributeCount,
  COUNT(DISTINCT pbm.id) as mediaCount,
  COUNT(DISTINCT pi.id) as inventoryCount,
  SUM(pi.quantity) as totalQuantity,
  JSON_AGG(attributes) as attributes,
  JSON_AGG(media) as media,
  JSON_AGG(inventory) as inventory
FROM product_base pb
LEFT JOIN product_base_attribute pba ON pba.product_id = pb.id
LEFT JOIN product_base_media pbm ON pbm.product_id = pb.id
LEFT JOIN product_inventory pi ON pi.product_id = pb.id
GROUP BY pb.id
```

## REST API Endpoints

### Query Endpoints (Read)

```http
GET /products
Query Params:
  - page: number (default: 1)
  - limit: number (default: 10)

Response:
{
  "data": [
    {
      "id": "uuid",
      "name": "Product Name",
      "price": 100.00,
      "description": "...",
      "status": "ACTIVE",
      "attributeCount": 5,
      "mediaCount": 3,
      "inventoryCount": 2,
      "totalQuantity": 150,
      "attributes": [...],
      "media": [...],
      "inventory": [...]
    }
  ],
  "total": 100
}
```

```http
GET /products/:id

Response:
{
  "id": "uuid",
  "name": "Product Name",
  "price": 100.00,
  "attributes": [
    { "id": "...", "key": "color", "value": "red" }
  ],
  "media": [
    { "id": "...", "bucket": "products", "key": "image.jpg", "url": "..." }
  ],
  "inventory": [
    { "id": "...", "sku": "SKU-001", "quantity": 100 }
  ]
}
```

### Command Endpoints (Write)

Commands are handled via **Kafka** messages, not REST:

```typescript
// Kafka Topic: TOPIC_CREATE_PRODUCT_COMMAND
{
  "transactionId": "uuid",
  "name": "Product Name",
  "price": 100.00,
  "description": "..."
}
```

## Benefits of CQRS

1. **Separation of Concerns**: Write and read models are independent
2. **Scalability**: Read and write databases can be scaled separately
3. **Performance**: Materialized views optimize complex queries
4. **Event Sourcing**: All changes are tracked via events
5. **Saga Integration**: Events automatically trigger Saga workflows

## Database Schema

### Write Model (Normalized)
- `product_base` - Core product data
- `product_base_attribute` - Product attributes
- `product_base_media` - Media files
- `product_inventory` - Stock levels

### Read Model (Denormalized)
- `product_aggregate_view` - Materialized view with all data

## Testing

```bash
# Unit tests for handlers
npm run test

# E2E tests
npm run test:e2e
```

## Next Steps

1. Implement similar CQRS pattern for:
   - `product-inventory`
   - `product-base-media`
   - `product-inventory-media`

2. Create database migrations for materialized view

3. Add caching layer (Redis) for read queries

4. Implement CQRS event store for audit trail
