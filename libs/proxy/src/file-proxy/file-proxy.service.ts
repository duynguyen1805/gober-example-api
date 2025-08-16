import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
// dto
import { CreateFileDto } from '@app/common/dto/file/create-file.dto';
import { UpdateFileDto } from '@app/common/dto/file/update-file.dto';
import { QueryFileDto } from '@app/common/dto/file/query-file.dto';
// interface
import {
  IFileOutput,
  PagedFileResult
} from '@app/common/interfaces/file.interface';

@Injectable()
export class FileProxyService implements OnModuleInit {
  constructor(@Inject('FILE_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    // Chờ connect xong trước khi dùng send()
    await this.client.connect();
    Logger.log('[FileProxyService] Connected to FILE_SERVICE queue');
  }

  /**
   * Lưu thông tin file vào database sau khi upload Minio
   * @param driverId - id của driver cần tạo file
   * @param input - CreateFileDto chứa thông tin file cần tạo
   * @returns IFileOutput - thông tin file sau khi được tạo và url đầy đủ để truy cập file
   */
  async createFile(
    driverId: string,
    body: CreateFileDto
  ): Promise<IFileOutput> {
    return await firstValueFrom(
      this.client.send({ cmd: 'createFile' }, { driverId, body })
    );
  }

  /**
   * Lấy danh sách các file đã được upload
   * @param driverId - id của driver, nếu không có thì tìm kiếm tất cả file
   * @param query - QueryFileDto
   * @returns PagedFileResult - danh sách file đã được phân trang, tổng số file tìm thấy
   */
  async getListFiles(
    driverId: string,
    query: QueryFileDto
  ): Promise<PagedFileResult> {
    return await firstValueFrom(
      this.client.send({ cmd: 'getListFiles' }, { driverId, query })
    );
  }

  /**
   * Tìm kiếm file theo fileId
   * @param fileId - id của file
   * @returns IFileOutput thông tin file trên database và url đầy đủ để truy cập file
   */
  async findFileById(id: string) {
    const result = await firstValueFrom(
      this.client.send({ cmd: 'findFileById' }, { id })
    );
    return result;
  }

  /**
   * Tìm kiếm file theo fileId
   * @param driverId - id của driver
   * @param fileId - id của file
   * @returns IFileOutput thông tin file trên database và url đầy đủ để truy cập file
   */
  async findFileByIdAndUploadedById(driverId: string, id: string) {
    const result = await firstValueFrom(
      this.client.send({ cmd: 'findFileByIdAndUploadedById' }, { driverId, id })
    );
    return result;
  }
}
