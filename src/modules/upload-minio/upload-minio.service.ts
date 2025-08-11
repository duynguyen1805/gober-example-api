/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';
// common/enums/helpers
import { uploadFileToMinIO } from '../../common/helpers/minio-storage.helper';
import { EError } from '../../common/enums/error.enum';
import { mustExist } from '../../common/helpers/server-error.helper';
// interfaces
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
    mustExist(file, EError.NO_FILE_PROVIDED);

    // Upload to MinIO
    const uploadedFile = await uploadFileToMinIO(file);

    // Có thể triển khai thêm tạo luôn record File luôn (điều kiện: thêm UseGuard cho controller)

    return {
      originalName: file.originalname,
      filename: uploadedFile.filename,
      url: uploadedFile.url,
      path: uploadedFile.path,
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
    mustExist(files, EError.NO_FILE_PROVIDED);

    const uploadPromises = files.map(async (file) => {
      const uploadedFile = await uploadFileToMinIO(file);

      // Có thể triển khai thêm tạo luôn record File luôn (điều kiện: thêm UseGuard cho controller)

      return {
        originalName: file.originalname,
        filename: uploadedFile.filename,
        url: uploadedFile.url,
        path: uploadedFile.path,
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
