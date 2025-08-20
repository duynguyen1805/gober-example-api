/* eslint-disable @typescript-eslint/no-empty-function */
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
// interfaces
import {
  IUploadedFileInfoOutput,
  IUploadResult
} from '@app/common/interfaces/upload.interface';

@Injectable()
export class UploadMinioProxyService implements OnModuleInit {
  constructor(@Inject('UPLOAD_MINIO_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    // Chờ connect xong trước khi dùng send()
    await this.client.connect();
    Logger.log(
      '[UploadMinioProxyService] Connected to UPLOAD_MINIO_SERVICE queue'
    );
  }

  /**
   * Uploads single file lên MinIO storage.
   * @param file file để upload
   * @returns Thông tin file đã upload, gồm original name, filename, URL, size, mime type, file extension, upload date.
   * @throws {EError} Nếu không tìm thấy file, thông tin file không hợp lệ hoặc lỗi trong quá trình upload.
   */
  async singleUploadMinio(
    file: Express.Multer.File
  ): Promise<IUploadedFileInfoOutput> {
    const result = await firstValueFrom(
      this.client.send({ cmd: 'singleUploadMinio' }, file)
    );
    return result;
  }

  /**
   * Uploads multiple file lên MinIO storage.
   * @param files files để upload
   * @returns Mảng thông tin file đã upload, gồm original name, filename, URL, size, mime type, file extension, upload date.
   * @throws {EError} Nếu không tìm thấy file, thông tin file không hợp lệ hoặc lỗi trong quá trình upload.
   */
  async multiUploadMinio(files: Express.Multer.File[]): Promise<IUploadResult> {
    const result = await firstValueFrom(
      this.client.send({ cmd: 'multiUploadMinio' }, files)
    );
    return result;
  }
}
