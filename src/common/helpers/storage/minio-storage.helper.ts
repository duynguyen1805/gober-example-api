import * as Minio from 'minio';
import { Readable, pipeline } from 'stream';
import { promisify } from 'util';
import { configService } from '../../../config/config.service';
import {
  EAllowedFileType,
  EUploadError
} from '../../../modules/upload-minio/enums/upload.enum';
import { Settings } from '../../../constants';
import { makeSure } from '../server-error.helper';
import { IUploadedFileToMinIOOutput } from '../../../modules/upload-minio/interfaces/upload.interface';

const pipelineAsync = promisify(pipeline);

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

// File type mapping
const FILE_TYPE_MAPPING: Record<string, EAllowedFileType> = {
  'image/jpeg': EAllowedFileType.IMAGE,
  'image/jpg': EAllowedFileType.IMAGE,
  'image/png': EAllowedFileType.IMAGE
};

// Allowed file extensions
const ALLOWED_EXTENSIONS: Record<EAllowedFileType, string[]> = {
  [EAllowedFileType.IMAGE]: ['jpg', 'jpeg', 'png']
};

/**
 * Validate file before upload
 */
export function validateFile(file: Express.Multer.File): void {
  // Check file size
  const maxFileSize = Settings.UPLOADING_FILE_SIZE;
  if (file.size > maxFileSize) {
    makeSure(
      false,
      EUploadError.INVALID_FILE_SIZE,
      `File size ${file.size} bytes exceeds maximum allowed size ${maxFileSize} bytes`
    );
  }

  // Check file type
  const fileType = FILE_TYPE_MAPPING[file.mimetype];
  if (!Object.values(EAllowedFileType).includes(fileType)) {
    makeSure(
      false,
      EUploadError.INVALID_FILE_TYPE,
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
      EUploadError.INVALID_FILE_EXTENSION,
      `File extension .${fileExtension} is not commonly used for ${fileType} files`
    );
  }
}

/**
 * Generate unique filename
 * @param originalName - The original name of the file
 * @returns The unique filename
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
 * Upload single file to MinIO
 * @param file - The file to upload
 * @returns The uploaded file
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

    await minioClient.putObject(
      defaultBucketName,
      file.originalname,
      file.buffer,
      null,
      metadata
    );

    // Generate URL
    const url = `https://${configMinIO.STORAGE_LOCAL_ENDPOINT}:${configMinIO.MINIO_UPLOAD_PORT}/${defaultBucketName}/${file.originalname}`;

    // Determine file type
    const fileType = FILE_TYPE_MAPPING[file.mimetype];
    const fileExtension =
      file.originalname.split('.').pop()?.toLowerCase() || '';

    return {
      originalName: file.originalname,
      filename: file.originalname,
      url,
      size: file.size,
      mimeType: file.mimetype,
      fileExtension,
      fileType,
      uploadedAt: new Date(),
      bucketName: defaultBucketName
    };
  } catch (error) {
    makeSure(
      false,
      EUploadError.UPLOAD_FAILED,
      `Upload failed: ${error.message}`
    );
  }
}

/**
 * Upload multiple files to MinIO
 * @param files - The files to upload
 * @returns The uploaded files
 */
export async function uploadMultipleFilesToMinIO(
  files: Express.Multer.File[]
): Promise<IUploadedFileToMinIOOutput[]> {
  const uploadPromises = files.map((file) => uploadFileToMinIO(file));
  return Promise.all(uploadPromises);
}

/**
 * Delete file from MinIO
 * @param filename - The filename of the file to delete
 * @param bucketName - The bucket name of the file to delete
 * @returns The result of the deletion
 */
export async function deleteFileFromMinIO(
  filename: string,
  bucketName: string = defaultBucketName
): Promise<boolean> {
  try {
    await minioClient.removeObject(bucketName, filename);

    return true;
  } catch (error) {
    makeSure(
      false,
      EUploadError.DELETE_FAILED,
      `Delete failed: ${error.message}`
    );
  }
}
