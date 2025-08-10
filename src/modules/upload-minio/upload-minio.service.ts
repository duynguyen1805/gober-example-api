/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';
import { uploadFileToMinIO } from '../../common/helpers/storage/minio-storage.helper';
import { EError } from '../../common/enums/error.enum';
import { mustExist } from '../../common/helpers/system/server-error.helper';
import {
  IUploadedFileInfoOutput,
  IUploadResult
} from './interfaces/upload.interface';

@Injectable()
export class UploadMinioService {
  constructor() {}

  /**
   * Uploads single file lên MinIO storage.
   * @param file file để upload
   * @returns Thông tin file đã upload, gồm original name, filename, URL, size, mime type, file extension, upload date.
   * @throws {EError} Nếu không tìm thấy file, thông tin file không hợp lệ hoặc lỗi trong quá trình upload.
   */
  async singleUploadMinio(
    file: Express.Multer.File
  ): Promise<IUploadedFileInfoOutput> {
    mustExist(file, EError.NO_FILE_PROVIDED, 'No file provided');

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
   * Uploads multiple file lên MinIO storage.
   * @param files files để upload
   * @returns Mảng thông tin file đã upload, gồm original name, filename, URL, size, mime type, file extension, upload date.
   * @throws {EError} Nếu không tìm thấy file, thông tin file không hợp lệ hoặc lỗi trong quá trình upload.
   */
  async multiUploadMinio(files: Express.Multer.File[]): Promise<IUploadResult> {
    mustExist(files, EError.NO_FILE_PROVIDED, 'No files provided');

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
