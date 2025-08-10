import * as Minio from 'minio';
import { configService } from '../../../config/config.service';
import { EAllowedFileType } from '../../enums/upload-minio/upload.enum';
import { EError } from '../../enums/error.enum';
import { Settings } from '../../../constants';
import { makeSure } from '../system/server-error.helper';
import { IUploadedFileToMinIOOutput } from '../../../modules/upload-minio/interfaces/upload.interface';

const configMinIO = configService.getMinIOConfig();

// Init minio client
const minioClient = new Minio.Client({
  endPoint: configMinIO.STORAGE_LOCAL_ENDPOINT,
  port: +configMinIO.MINIO_UPLOAD_LOCAL_PORT,
  useSSL: configMinIO.USE_SSL === 'true' ? true : false,
  accessKey: configMinIO.MINIO_UPLOAD_ACCESS_KEY,
  secretKey: configMinIO.MINIO_UPLOAD_SECRET_KEY
});

const defaultBucketName = configMinIO.MINIO_UPLOAD_BUCKET_NAME;

// Mapping file type
const FILE_TYPE_MAPPING: Record<string, EAllowedFileType> = {
  'image/jpeg': EAllowedFileType.IMAGE,
  'image/jpg': EAllowedFileType.IMAGE,
  'image/png': EAllowedFileType.IMAGE
};

// File extensions cho phép
const ALLOWED_EXTENSIONS: Record<EAllowedFileType, string[]> = {
  [EAllowedFileType.IMAGE]: ['jpg', 'jpeg', 'png']
};

/**
 * Validate file trước khi upload.
 * @param file File để validate
 * @throws {EError} Nếu file size lớn hơn cho phép.
 * @throws {EError} Nếu file type không hợp lệ.
 * @throws {EError} Nếu file extension không hợp lệ.
 */
export function validateFile(file: Express.Multer.File): void {
  // Check file size
  const maxFileSize = Settings.UPLOADING_FILE_SIZE;
  if (file.size > maxFileSize) {
    makeSure(
      false,
      EError.INVALID_FILE_SIZE,
      `File size ${file.size} bytes exceeds maximum allowed size ${maxFileSize} bytes`
    );
  }

  // Check file type
  const fileType = FILE_TYPE_MAPPING[file.mimetype];
  if (!Object.values(EAllowedFileType).includes(fileType)) {
    makeSure(
      false,
      EError.INVALID_FILE_TYPE,
      `File type ${fileType} is not allowed. Allowed types: ${Object.values(
        EAllowedFileType
      ).join(', ')}`
    );
  }

  // Check file extension
  const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
  if (
    fileExtension &&
    ALLOWED_EXTENSIONS[fileType] &&
    !ALLOWED_EXTENSIONS[fileType].includes(fileExtension)
  ) {
    makeSure(
      false,
      EError.INVALID_FILE_EXTENSION,
      `File extension .${fileExtension} is not commonly used for ${fileType} files`
    );
  }
}

/**
 * Tạo tên file duy nhất - mục đích tránh ghi đè nếu tên file trùng nhau (CHƯA SỬ DỤNG)
 * @param originalName - original name của file
 * @returns file name duy nhất
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();

  const nameWithoutExt = originalName.substring(
    0,
    originalName.lastIndexOf('.')
  );
  return `${randomString}_${nameWithoutExt}_${timestamp}.${extension}`;
}

/**
 * Upload single file lên MinIO
 * @param file - file để upload
 * @returns Thông tin file đã upload, gồm original name, filename, URL, size, mime type, file extension, upload date
 */
export async function uploadFileToMinIO(
  file: Express.Multer.File
): Promise<IUploadedFileToMinIOOutput> {
  // Validate file
  validateFile(file);

  try {
    const metadata = {
      'Content-Type': file.mimetype,
      'original-name': file.originalname,
      'file-size': file.size.toString(),
      'uploaded-at': new Date().toISOString()
    };

    // Tải file lên MinIO
    await minioClient.putObject(
      defaultBucketName,
      file.originalname,
      file.buffer,
      null,
      metadata
    );

    // Tạo URL truy cập file
    const url = `https://${configMinIO.STORAGE_LOCAL_ENDPOINT}:${configMinIO.MINIO_UPLOAD_PORT}/${defaultBucketName}/${file.originalname}`;
    const path = `/${defaultBucketName}/${file.originalname}`;

    // Xác định file type và extension
    const fileType = FILE_TYPE_MAPPING[file.mimetype];
    const fileExtension =
      file.originalname.split('.').pop()?.toLowerCase() || '';

    return {
      originalName: file.originalname,
      filename: file.originalname,
      url: url,
      path: path,
      size: file.size,
      mimeType: file.mimetype,
      fileExtension,
      fileType,
      uploadedAt: new Date(),
      bucketName: defaultBucketName
    };
  } catch (error) {
    makeSure(false, EError.UPLOAD_FAILED, `Upload failed: ${error.message}`);
  }
}

/**
 * Upload multiple files lên MinIO
 * @param files - files để upload
 * @returns Mảng thống tin file đã upload, gồm original name, filename, URL, size, mime type, file extension, upload date
 */
export async function uploadMultipleFilesToMinIO(
  files: Express.Multer.File[]
): Promise<IUploadedFileToMinIOOutput[]> {
  const uploadPromises = files.map((file) => uploadFileToMinIO(file));
  return Promise.all(uploadPromises);
}

/**
 * Xoá file trên MinIO (CHƯA SỬ DỤNG)
 * @param filename - filename cần xoá
 * @param bucketName - bucketName chưa file cần xoá
 * @returns true nếu thành công.
 */
export async function deleteFileFromMinIO(
  filename: string,
  bucketName: string = defaultBucketName
): Promise<boolean> {
  try {
    await minioClient.removeObject(bucketName, filename);
    return true;
  } catch (error) {
    makeSure(false, EError.DELETE_FAILED, `Delete failed: ${error.message}`);
  }
}
