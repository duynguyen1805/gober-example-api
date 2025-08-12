import { Injectable } from '@nestjs/common';
// dto
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { QueryFileDto } from './dto/query-file.dto';
// interface
import { IFileOutput, PagedFileResult } from './interfaces/file.interface';
// model.repository
import { FileModelRepository } from './file.model.repository';
import { makeSure } from '../../common/helpers/server-error.helper';

@Injectable()
export class FileService {
  constructor(private readonly fileModelRepository: FileModelRepository) {}

  /**
   * Lưu thông tin file vào database sau khi upload Minio
   * @param driverId - id của driver cần tạo file
   * @param input - CreateFileDto chứa thông tin file cần tạo
   * @returns IFileOutput - thông tin file sau khi được tạo và url đầy đủ để truy cập file
   */
  async create(driverId: string, input: CreateFileDto): Promise<IFileOutput> {
    const dataFileDocument = await this.fileModelRepository.createFile({
      filename: input.filename,
      path: input.path,
      mimeType: input.mimeType,
      fileExtension: input.fileExtension,
      size: input.size,
      uploadedById: driverId
    });
    const savedFile = await this.fileModelRepository.saveFile(dataFileDocument);
    const url = `${process.env.STORAGE_ENDPOINT}${input.path}`;

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
  async getListFiles(
    driverId: string,
    query: QueryFileDto
  ): Promise<PagedFileResult> {
    return await this.fileModelRepository.getListFiles(driverId, query);
  }

  /**
   * Tìm kiếm file theo fileId
   * @param fileId - id của file
   * @returns IFileOutput thông tin file trên database và url đầy đủ để truy cập file
   */
  async findFileById(fileId: string): Promise<IFileOutput | null> {
    const entityFile = await this.fileModelRepository.findFileById(fileId);
    // Gắn domain từ env với path file
    const url = `${process.env.STORAGE_ENDPOINT}${entityFile.path}`;
    return { ...entityFile.toObject(), url };
  }
}
