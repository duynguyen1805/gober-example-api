import { EAllowedFileType } from '../../../common/enums/file.enum';

export interface IUploadedFileToMinIOOutput {
  originalName: string;
  filename: string;
  url: string;
  path: string;
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
  path: string;
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
