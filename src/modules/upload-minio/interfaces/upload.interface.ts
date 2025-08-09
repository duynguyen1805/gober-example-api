import { EAllowedFileType } from '../../../common/enums/upload-minio/upload.enum';

export interface IUploadedFileToMinIOOutput {
  originalName: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  fileExtension: string;
  fileType: EAllowedFileType;
  uploadedAt: Date;
  bucketName: string;
}

export interface IUploadedFileInfoOutput {
  originalName: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  fileExtension: string;
  uploadedAt: Date;
}

export interface IUploadResult {
  success: boolean;
  files: IUploadedFileInfoOutput[];
  totalFiles: number;
  totalSize: number;
}
