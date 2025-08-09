/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';
import { uploadFileToMinIO } from '../../common/helpers/storage/minio-storage.helper';
import { EUploadError } from './enums/upload.enum';
import { mustExist } from '../../common/helpers/server-error.helper';
import {
  IUploadedFileInfoOutput,
  IUploadResult
} from './interfaces/upload.interface';

@Injectable()
export class UploadMinioService {
  constructor() {}

  /**
   * Uploads a single file to MinIO storage.
   * @param file The file to be uploaded.
   * @returns The information of the uploaded file, including original name, filename, URL, size, mime type, file extension, and upload date.
   * @throws {EUploadError.NO_FILE_PROVIDED} If no file is provided for upload.
   */
  async singleUploadMinio(
    file: Express.Multer.File
  ): Promise<IUploadedFileInfoOutput> {
    console.log('singleUploadMinio: ', file);
    mustExist(file, EUploadError.NO_FILE_PROVIDED, 'No file provided');

    // Upload to MinIO
    const uploadedFile = await uploadFileToMinIO(file);

    return {
      originalName: file.originalname,
      filename: uploadedFile.filename,
      url: uploadedFile.url,
      size: file.size,
      mimeType: file.mimetype,
      fileExtension: file.originalname.split('.').pop()?.toLowerCase() || '',
      uploadedAt: new Date()
    };
  }

  /**
   * Uploads multiple files to MinIO
   * @param files The files to upload
   * @returns The uploaded files information
   * @throws {BadRequestException} If no files are provided
   * @throws {EUploadError.UPLOAD_FAILED} If the upload process fails.
   */
  async multiUploadMinio(files: Express.Multer.File[]): Promise<IUploadResult> {
    mustExist(files, EUploadError.NO_FILE_PROVIDED, 'No files provided');

    const uploadPromises = files.map(async (file) => {
      const uploadedFile = await uploadFileToMinIO(file);

      return {
        originalName: file.originalname,
        filename: uploadedFile.filename,
        url: uploadedFile.url,
        size: file.size,
        mimeType: file.mimetype,
        fileExtension: file.originalname.split('.').pop()?.toLowerCase() || '',
        uploadedAt: new Date()
      };
    });

    const results = await Promise.all(uploadPromises);
    const totalSize = results.reduce((sum, file) => sum + file.size, 0);

    return {
      success: true,
      files: results,
      totalFiles: results.length,
      totalSize
    };
  }
}
