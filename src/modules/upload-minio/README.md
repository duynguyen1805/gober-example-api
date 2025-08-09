# Upload MinIO Module

Module này cung cấp các chức năng upload file lên MinIO storage với đầy đủ validation, error handling và API documentation.

## 🏗️ Cấu trúc Module

```
src/modules/upload-minio/
├── dto/
│   ├── upload-file.dto.ts          # DTO cho upload file
│   ├── delete-file.dto.ts          # DTO cho delete file
│   └── list-files.dto.ts           # DTO cho list files
├── enums/
│   └── upload.enum.ts              # Enums cho upload module
├── interfaces/
│   └── upload.interface.ts         # Interfaces cho upload module
├── upload-minio.controller.ts       # Controller với REST API
├── upload-minio.service.ts          # Service với business logic
├── upload-minio.module.ts           # Module configuration
└── README.md                        # Documentation này
```

## 🚀 Tính năng

### ✅ Upload Files
- **Single File Upload**: Upload một file với validation
- **Multiple Files Upload**: Upload nhiều file cùng lúc
- **File Validation**: Kiểm tra kích thước, loại file, extension
- **Custom Options**: Folder, unique naming, compression, etc.

### ✅ File Management
- **List Files**: Liệt kê files với pagination
- **Get Metadata**: Lấy thông tin chi tiết của file
- **Delete Files**: Xóa file từ MinIO
- **Statistics**: Thống kê upload

### ✅ Error Handling
- **Validation Errors**: File size, type, extension
- **MinIO Errors**: Connection, bucket, upload failures
- **Proper HTTP Status**: 400, 500, 404 responses

### ✅ API Documentation
- **Swagger/OpenAPI**: Đầy đủ documentation
- **Request/Response Examples**: Ví dụ cụ thể
- **Error Responses**: Mô tả lỗi chi tiết

## 📋 API Endpoints

### 1. Upload Single File
```http
POST /upload-minio/single
Content-Type: multipart/form-data

Body:
- file: File to upload
- folder: Folder path (optional)
- allowedTypes: Array of allowed types (optional)
- maxFileSize: Maximum file size in bytes (optional)
- generateUniqueName: Generate unique filename (optional)
- preserveOriginalName: Preserve original name (optional)
- addTimestamp: Add timestamp to filename (optional)
- compress: Compress file (optional)
- quality: Compression quality 1-100 (optional)
```

### 2. Upload Multiple Files
```http
POST /upload-minio/multiple
Content-Type: multipart/form-data

Body:
- files: Array of files to upload
- folder: Folder path (optional)
- allowedTypes: Array of allowed types (optional)
- maxFileSize: Maximum file size in bytes (optional)
- generateUniqueName: Generate unique filename (optional)
- preserveOriginalName: Preserve original name (optional)
- addTimestamp: Add timestamp to filename (optional)
- compress: Compress files (optional)
- quality: Compression quality 1-100 (optional)
```

### 3. List Files
```http
GET /upload-minio/files?prefix=images/&maxKeys=50&continuationToken=token
```

### 4. Get File Metadata
```http
GET /upload-minio/files/{filename}/metadata
```

### 5. Delete File
```http
DELETE /upload-minio/files/{filename}
```

### 6. Get Upload Statistics
```http
GET /upload-minio/statistics
```

## 🔧 Configuration

### MinIO Configuration
```typescript
// src/config/config.service.ts
getMinIOConfig() {
  return {
    STORAGE_LOCAL_ENDPOINT: process.env.MINIO_ENDPOINT || 'localhost',
    MINIO_UPLOAD_LOCAL_PORT: process.env.MINIO_PORT || 9000,
    USE_SSL: process.env.MINIO_USE_SSL || 'false',
    MINIO_UPLOAD_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
    MINIO_UPLOAD_SECRET_KEY: process.env.MINIO_SECRET_KEY,
    MINIO_UPLOAD_BUCKET_NAME: process.env.MINIO_BUCKET_NAME || 'uploads',
    STORAGE_ENDPOINT: process.env.MINIO_STORAGE_ENDPOINT || 'localhost:9000'
  };
}
```

### Environment Variables
```bash
# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET_NAME=uploads
MINIO_STORAGE_ENDPOINT=localhost:9000

# Upload Settings
UPLOADING_FILE_SIZE=524288000  # 500MB
```

## 📊 File Types & Extensions

### Supported File Types
- **Images**: jpg, jpeg, png, gif, webp, svg
- **Documents**: pdf, doc, docx, xls, xlsx, ppt, pptx, txt
- **Videos**: mp4, avi, mov, wmv, flv
- **Audio**: mp3, wav, aac, ogg
- **Archives**: zip, rar, tar, gz

### File Type Mapping
```typescript
const FILE_TYPE_MAPPING = {
  'image/jpeg': EAllowedFileType.IMAGE,
  'image/png': EAllowedFileType.IMAGE,
  'application/pdf': EAllowedFileType.DOCUMENT,
  'video/mp4': EAllowedFileType.VIDEO,
  'audio/mpeg': EAllowedFileType.AUDIO,
  'application/zip': EAllowedFileType.ARCHIVE
};
```

## 🛡️ Validation

### File Size Validation
```typescript
// Default: 500MB
const maxFileSize = options.maxFileSize || Settings.UPLOADING_FILE_SIZE;
if (file.size > maxFileSize) {
  errors.push(`File size ${file.size} bytes exceeds maximum allowed size ${maxFileSize} bytes`);
}
```

### File Type Validation
```typescript
const fileType = FILE_TYPE_MAPPING[file.mimetype] || EAllowedFileType.OTHER;
if (options.allowedTypes && !options.allowedTypes.includes(fileType)) {
  errors.push(`File type ${fileType} is not allowed`);
}
```

### File Extension Validation
```typescript
const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
if (fileExtension && ALLOWED_EXTENSIONS[fileType] && !ALLOWED_EXTENSIONS[fileType].includes(fileExtension)) {
  warnings.push(`File extension .${fileExtension} is not commonly used for ${fileType} files`);
}
```

## 📝 Response Examples

### Successful Upload Response
```json
{
  "originalName": "avatar.jpg",
  "filename": "images/avatars/1234567890_abc123.jpg",
  "url": "https://storage.example.com/bucket/images/avatars/1234567890_abc123.jpg",
  "size": 1024000,
  "mimeType": "image/jpeg",
  "fileExtension": "jpg",
  "fileType": "image",
  "uploadedAt": "2024-01-15T10:30:00.000Z",
  "status": "COMPLETED",
  "bucketName": "my-bucket",
  "etag": "abc123def456"
}
```

### Multiple Files Upload Response
```json
{
  "success": true,
  "files": [
    {
      "originalName": "document.pdf",
      "filename": "documents/1234567890_document.pdf",
      "url": "https://storage.example.com/bucket/documents/1234567890_document.pdf",
      "size": 2048000,
      "mimeType": "application/pdf",
      "fileExtension": "pdf",
      "fileType": "document",
      "uploadedAt": "2024-01-15T10:30:00.000Z",
      "status": "COMPLETED",
      "bucketName": "my-bucket",
      "etag": "def456ghi789"
    }
  ],
  "totalFiles": 1,
  "totalSize": 2048000,
  "uploadTime": 1500
}
```

### Error Response
```json
{
  "message": "File validation failed",
  "errors": [
    "File size 1048576000 bytes exceeds maximum allowed size 524288000 bytes",
    "File type video is not allowed. Allowed types: image, document"
  ],
  "warnings": [
    "File extension .mov is not commonly used for video files"
  ]
}
```

## 🔄 Usage Examples

### Basic Upload
```typescript
// Upload single file
const result = await uploadService.uploadSingleFile(file);

// Upload multiple files
const result = await uploadService.uploadMultipleFiles(files);
```

### Upload with Options
```typescript
const options = {
  folder: 'images/avatars',
  allowedTypes: [EAllowedFileType.IMAGE],
  maxFileSize: 5242880, // 5MB
  generateUniqueName: true,
  addTimestamp: true,
  compress: true,
  quality: 80
};

const result = await uploadService.uploadSingleFile(file, options);
```

### File Management
```typescript
// List files
const files = await uploadService.listFiles({ prefix: 'images/', maxKeys: 50 });

// Get metadata
const metadata = await uploadService.getFileMetadata('images/avatar.jpg');

// Delete file
await uploadService.deleteFile({ filename: 'images/avatar.jpg' });

// Get statistics
const stats = await uploadService.getUploadStatistics();
```

## 🧪 Testing

### Manual Testing
```bash
# Upload single file
curl -X POST http://localhost:3000/upload-minio/single \
  -F "file=@avatar.jpg" \
  -F "folder=images/avatars" \
  -F "generateUniqueName=true"

# Upload multiple files
curl -X POST http://localhost:3000/upload-minio/multiple \
  -F "files=@document1.pdf" \
  -F "files=@document2.pdf" \
  -F "folder=documents"

# List files
curl -X GET "http://localhost:3000/upload-minio/files?prefix=images/&maxKeys=10"

# Get metadata
curl -X GET http://localhost:3000/upload-minio/files/images/avatar.jpg/metadata

# Delete file
curl -X DELETE http://localhost:3000/upload-minio/files/images/avatar.jpg

# Get statistics
curl -X GET http://localhost:3000/upload-minio/statistics
```

## 🔧 Dependencies

### Required Packages
```json
{
  "minio": "^8.0.5",
  "multer": "^1.4.5",
  "@types/multer": "^1.4.7",
  "class-validator": "^0.13.2",
  "@nestjs/swagger": "^5.2.1"
}
```

### Module Dependencies
```typescript
// src/modules/upload-minio/upload-minio.module.ts
@Module({
  imports: [],
  controllers: [UploadMinioController],
  providers: [
    UploadMinioService,
    SingleUploadInterceptor,
    MultiUploadInterceptor
  ],
  exports: [
    UploadMinioService,
    SingleUploadInterceptor,
    MultiUploadInterceptor
  ]
})
export class UploadMinIOModule {}
```

## 🚨 Error Handling

### Common Errors
1. **FILE_TOO_LARGE**: File size exceeds limit
2. **INVALID_FILE_TYPE**: File type not allowed
3. **UPLOAD_FAILED**: MinIO upload error
4. **MINIO_CONNECTION_ERROR**: MinIO connection failed
5. **BUCKET_NOT_FOUND**: Bucket doesn't exist
6. **FILE_NOT_FOUND**: File doesn't exist
7. **DELETE_FAILED**: File deletion failed

### Error Response Format
```json
{
  "message": "Upload failed",
  "error": "MinIO connection error"
}
```

## 📈 Performance

### Optimization Features
- **Parallel Uploads**: Multiple files uploaded simultaneously
- **Stream Processing**: Efficient memory usage
- **Caching**: Metadata caching for better performance
- **Compression**: Optional image compression
- **Batch Operations**: Bulk file operations

### Monitoring
- **Upload Statistics**: Track upload performance
- **File Type Distribution**: Monitor file types
- **Size Analytics**: Track storage usage
- **Error Tracking**: Monitor upload failures

## 🔐 Security

### Security Features
- **File Type Validation**: Prevent malicious file uploads
- **Size Limits**: Prevent large file attacks
- **Extension Validation**: Validate file extensions
- **Content-Type Verification**: Verify MIME types
- **Access Control**: MinIO access key authentication

### Best Practices
1. **Validate all inputs**: File size, type, extension
2. **Use HTTPS**: Secure file transfer
3. **Implement rate limiting**: Prevent abuse
4. **Monitor uploads**: Track suspicious activity
5. **Regular backups**: Backup important files

## 📚 Additional Resources

- [MinIO Documentation](https://docs.min.io/)
- [NestJS File Upload](https://docs.nestjs.com/techniques/file-upload)
- [Multer Documentation](https://github.com/expressjs/multer)
- [Class Validator](https://github.com/typestack/class-validator)

