import * as Minio from 'minio';
import path from 'path';
import { configService } from '../../config/config.service';
import { EFileType, FileTypeConfig } from '../enums/file.enum';
import { EError } from '../enums/error.enum';
import { Settings } from '../../common/constants/constants';
import { makeSure } from './server-error.helper';
import { IUploadedFileToMinIOOutput } from '../../modules/upload-minio/interfaces/upload.interface';

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

/**
 * Xác định loại file theo MIME type
 */
function getFileTypeByMimeType(mimeType: string): EFileType | undefined {
  return Object.entries(FileTypeConfig).find(([_, config]) =>
    config.mimeTypes.includes(mimeType)
  )?.[0] as EFileType | undefined;
}

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
  const extension = path
    .extname(file.originalname)
    .toLowerCase()
    .replace('.', '');

  if (file.size > maxFileSize) {
    makeSure(false, EError.INVALID_FILE_SIZE);
  }

  // Check file extension
  // Kiểm tra extension có hợp lệ với loại file
  // TẠM SET CỨNG IMAGE (extension của image) => TÌM SOLUTION HANDLE CHECK THEO MINE TYPE
  if (!FileTypeConfig[EFileType.IMAGE].extensions.includes(extension)) {
    makeSure(false, EError.INVALID_FILE_EXTENSION);
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

    // Xác định file extension
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
    makeSure(false, EError.DELETE_FAILED);
  }
}
