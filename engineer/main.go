package main

import (
	"context"
	"fmt"
	"net"
	"os"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	pb "media-service/proto"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

type server struct {
	pb.UnimplementedMediaServiceServer
	minioClient *minio.Client
	logger      *zap.Logger
}

func (s *server) GetPresignedUploadUrl(ctx context.Context, req *pb.GetPresignedUploadUrlRequest) (*pb.GetPresignedUploadUrlResponse, error) {
	s.logger.Info("GetPresignedUploadUrl called",
		zap.String("bucket", req.BucketName),
		zap.String("object", req.ObjectName),
	)

	expiry := time.Duration(req.ExpirySeconds) * time.Second
	if expiry == 0 {
		expiry = time.Hour
	}

	// Ensure bucket exists
	err := s.minioClient.MakeBucket(ctx, req.BucketName, minio.MakeBucketOptions{})
	if err != nil {
		exists, errBucketExists := s.minioClient.BucketExists(ctx, req.BucketName)
		if errBucketExists == nil && exists {
			s.logger.Debug("Bucket already exists", zap.String("bucket", req.BucketName))
		} else {
			s.logger.Error("Failed to create bucket", 
				zap.String("bucket", req.BucketName),
				zap.Error(err),
			)
			return nil, err
		}
	}

	presignedURL, err := s.minioClient.PresignedPutObject(ctx, req.BucketName, req.ObjectName, expiry)
	if err != nil {
		s.logger.Error("Failed to generate presigned upload URL",
			zap.String("bucket", req.BucketName),
			zap.String("object", req.ObjectName),
			zap.Error(err),
		)
		return nil, err
	}

	s.logger.Info("Presigned upload URL generated successfully",
		zap.String("bucket", req.BucketName),
		zap.String("object", req.ObjectName),
	)

	return &pb.GetPresignedUploadUrlResponse{Url: presignedURL.String()}, nil
}

func (s *server) GetPresignedDownloadUrl(ctx context.Context, req *pb.GetPresignedDownloadUrlRequest) (*pb.GetPresignedDownloadUrlResponse, error) {
	s.logger.Info("GetPresignedDownloadUrl called",
		zap.String("bucket", req.BucketName),
		zap.String("object", req.ObjectName),
	)

	expiry := time.Duration(req.ExpirySeconds) * time.Second
	if expiry == 0 {
		expiry = time.Hour
	}

	presignedURL, err := s.minioClient.PresignedGetObject(ctx, req.BucketName, req.ObjectName, expiry, nil)
	if err != nil {
		s.logger.Error("Failed to generate presigned download URL",
			zap.String("bucket", req.BucketName),
			zap.String("object", req.ObjectName),
			zap.Error(err),
		)
		return nil, err
	}

	s.logger.Info("Presigned download URL generated successfully",
		zap.String("bucket", req.BucketName),
		zap.String("object", req.ObjectName),
	)

	return &pb.GetPresignedDownloadUrlResponse{Url: presignedURL.String()}, nil
}

func (s *server) DeleteFile(ctx context.Context, req *pb.DeleteFileRequest) (*pb.DeleteFileResponse, error) {
	s.logger.Info("DeleteFile called",
		zap.String("bucket", req.BucketName),
		zap.String("object", req.ObjectName),
	)

	err := s.minioClient.RemoveObject(ctx, req.BucketName, req.ObjectName, minio.RemoveObjectOptions{})
	if err != nil {
		s.logger.Error("Failed to delete file",
			zap.String("bucket", req.BucketName),
			zap.String("object", req.ObjectName),
			zap.Error(err),
		)
		return &pb.DeleteFileResponse{Success: false, Message: err.Error()}, nil
	}

	s.logger.Info("File deleted successfully",
		zap.String("bucket", req.BucketName),
		zap.String("object", req.ObjectName),
	)

	return &pb.DeleteFileResponse{Success: true, Message: "File deleted successfully"}, nil
}

func main() {
	// Initialize logger
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	endpoint := os.Getenv("MINIO_ENDPOINT")
	accessKeyID := os.Getenv("MINIO_ACCESS_KEY")
	secretAccessKey := os.Getenv("MINIO_SECRET_KEY")
	useSSL := false

	logger.Info("Starting media service",
		zap.String("endpoint", endpoint),
		zap.Bool("ssl", useSSL),
	)

	// Initialize MinIO client object
	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		logger.Fatal("Failed to initialize MinIO client", zap.Error(err))
	}

	logger.Info("MinIO client initialized successfully")

	lis, err := net.Listen("tcp", ":50055")
	if err != nil {
		logger.Fatal("Failed to listen", zap.Error(err))
	}

	s := grpc.NewServer()
	pb.RegisterMediaServiceServer(s, &server{
		minioClient: minioClient,
		logger:      logger,
	})
	reflection.Register(s)

	logger.Info("Server listening", zap.String("address", lis.Addr().String()))
	
	if err := s.Serve(lis); err != nil {
		logger.Fatal("Failed to serve", zap.Error(err))
	}
}
