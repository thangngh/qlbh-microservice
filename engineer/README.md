# Engineer Service - Media Management

Go-based gRPC microservice for handling media operations with MinIO.

## Purpose
Provides presigned URL generation for secure, direct client-to-storage uploads/downloads.

## API (gRPC)

### GetPresignedUploadUrl
Generates a presigned URL for uploading files directly to MinIO.

**Request**:
```protobuf
message GetPresignedUploadUrlRequest {
  string bucket_name = 1;
  string object_name = 2;
  int64 expiry_seconds = 3;
}
```

**Response**:
```protobuf
message GetPresignedUploadUrlResponse {
  string url = 1;
}
```

### GetPresignedDownloadUrl
Generates a presigned URL for downloading files.

### DeleteFile
Deletes a file from MinIO.

## Configuration

Environment variables:
- `MINIO_ENDPOINT`: MinIO server address (e.g., `minio:9000`)
- `MINIO_ACCESS_KEY`: Access key
- `MINIO_SECRET_KEY`: Secret key

## Running

### Local Development
```bash
cd engineer
export MINIO_ENDPOINT=localhost:9000
export MINIO_ACCESS_KEY=minioadmin
export MINIO_SECRET_KEY=minioadmin
go run main.go
```

### Docker
```bash
docker-compose up media-service
```

## Logging

Uses **zap** structured logger with JSON output for Loki integration.

Example log:
```json
{
  "level": "info",
  "msg": "Presigned upload URL generated successfully",
  "bucket": "products",
  "object": "uuid-image.jpg"
}
```

## Integration with BFF

BFF should call this service via gRPC to obtain presigned URLs:

```typescript
// BFF (NestJS)
@Injectable()
export class MediaService {
  constructor(
    @Inject('ENGINEER_CLIENT') private engineerClient: ClientGrpc,
  ) {}

  async getUploadUrl(bucket: string, filename: string): Promise<string> {
    const engineerService = this.engineerClient.getService('MediaService');
    const response = await firstValueFrom(
      engineerService.GetPresignedUploadUrl({
        bucket_name: bucket,
        object_name: `${uuidv4()}-${filename}`,
        expiry_seconds: 3600,
      })
    );
    return response.url;
  }
}
```
