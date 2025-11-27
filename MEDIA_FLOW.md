# Media Upload Flow

## Architecture

```
Client → BFF (REST) → Engineer (gRPC) → MinIO → Client (Direct Upload) → Media Service (Save Metadata)
```

## Flow Steps

### 1. Client Requests Presigned URL
```http
POST /api/media/presign-upload
{
  "bucket": "products",
  "filename": "image.jpg",
  "expiry": 3600
}
```

### 2. BFF Calls Engineer Service (gRPC)
```typescript
// BFF calls engineer via gRPC
const response = await this.engineerClient.GetPresignedUploadUrl({
  bucket_name: 'products',
  object_name: generateKey(filename),
  expiry_seconds: 3600
});
```

### 3. Engineer Generates Presigned URL from MinIO
```go
// Engineer service (Go)
presignedURL, err := s.minioClient.PresignedPutObject(
  ctx,
  req.BucketName,
  req.ObjectName,
  expiry
)
```

### 4. BFF Returns to Client
```json
{
  "uploadUrl": "http://minio:9000/products/uuid-image.jpg?X-Amz-...",
  "key": "uuid-image.jpg",
  "bucket": "products"
}
```

### 5. Client Uploads Directly to MinIO
```javascript
// Client-side
await fetch(uploadUrl, {
  method: 'PUT',
  body: fileBlob,
  headers: { 'Content-Type': file.type }
});
```

### 6. Client Sends Product Data (Big Body) with Media Keys
```http
POST /api/products
{
  "productBase": { "name": "..." },
  "media": [
    { "key": "uuid-image.jpg", "bucket": "products" }
  ],
  "inventory": [...]
}
```

### 7. Media Service Saves Metadata
When Saga processes media, it stores the key/bucket in the database:
```typescript
// product-base-media or product-inventory-media
await mediaRepository.save({
  productId: event.productId,
  bucket: 'products',
  key: 'uuid-image.jpg',
  url: `http://minio:9000/products/uuid-image.jpg`
});
```

## Benefits

1. **No File Proxy**: Files don't pass through backend services
2. **Lower Latency**: Direct upload to object storage
3. **Scalability**: Backend doesn't handle file I/O
4. **Security**: Presigned URLs expire automatically