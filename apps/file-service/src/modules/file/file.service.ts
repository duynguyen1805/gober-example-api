import { Injectable } from '@nestjs/common';
// dto
import { CreateFileDto } from '@app/common/dto/file/create-file.dto';
import { UpdateFileDto } from '@app/common/dto/file/update-file.dto';
import { QueryFileDto } from '@app/common/dto/file/query-file.dto';
// interface
import {
  IFileOutput,
  PagedFileResult
} from '../../../../../libs/common/src/interfaces/file.interface';
// model.repository
import { FileModelRepository } from './file.model.repository';

@Injectable()
export class FileService {
  constructor(private readonly fileModelRepository: FileModelRepository) {}

  /**
   * Lưu thông tin file vào database sau khi upload Minio
   * @param driverId - id của driver cần tạo file
   * @param input - CreateFileDto chứa thông tin file cần tạo
   * @returns IFileOutput - thông tin file sau khi được tạo và url đầy đủ để truy cập file
   */
  async createFile(input: {
    driverId: string;
    body: CreateFileDto;
  }): Promise<IFileOutput> {
    const dataFileDocument = await this.fileModelRepository.createFile({
      filename: input.body.filename,
      path: input.body.path,
      mimeType: input.body.mimeType,
      fileExtension: input.body.fileExtension,
      size: input.body.size,
      uploadedById: input.driverId
    });
    const savedFile = await this.fileModelRepository.saveFile(dataFileDocument);
    const url = `${process.env.STORAGE_ENDPOINT}${input.body.path}`;

    return {
      ...savedFile.toObject(),
      url
    };
  }

  /**
   * Lấy danh sách các file đã được upload
   * @param driverId - id của driver, nếu không có thì tìm kiếm tất cả file
   * @param query - QueryFileDto
   * @returns PagedFileResult - danh sách file đã được phân trang, tổng số file tìm thấy
   */
  async getListFiles(input: {
    driverId: string;
    query: QueryFileDto;
  }): Promise<PagedFileResult> {
    return await this.fileModelRepository.getListFiles(
      input.driverId,
      input.query
    );
  }

  /**
   * Tìm kiếm file theo fileId
   * @param fileId - id của file
   * @returns IFileOutput thông tin file trên database và url đầy đủ để truy cập file
   */
  async findFileById(fileId: string): Promise<IFileOutput | null> {
    const dataFileDocument = await this.fileModelRepository.findFileById(
      fileId
    );
    // Gắn domain từ env với path file
    const url = `${process.env.STORAGE_ENDPOINT}${dataFileDocument.path}`;
    return { ...dataFileDocument.toObject(), url };
  }
}
