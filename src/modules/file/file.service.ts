import { Injectable } from '@nestjs/common';
import { FileEntity } from '../../database/entities/file.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { QueryFileDto } from './dto/query-file.dto';
import { IFileOutput, PagedFileResult } from './interfaces/file.interface';
import { FileRepository } from './file.repository';

@Injectable()
export class FileService {
  constructor(private readonly fileRepository: FileRepository) {}

  /**
   * Lưu thông tin file vào database sau khi upload Minio
   * @param driverId - id của driver cần tạo file
   * @param input - CreateFileDto chứa thông tin file cần tạo
   * @returns IFileOutput - thông tin file sau khi được tạo và url đầy đủ để truy cập file
   */
  async create(driverId: number, input: CreateFileDto): Promise<IFileOutput> {
    const dataCreateFile = await this.fileRepository.createFile({
      filename: input.filename,
      path: input.path,
      mimeType: input.mimeType,
      fileExtension: input.fileExtension,
      size: input.size,
      uploadedById: driverId
    });
    const entityFileResponse = await this.fileRepository.saveFile(
      dataCreateFile
    );
    const copyEntityFile = entityFileResponse;
    const url = `${process.env.STORAGE_ENDPOINT}${input.path}`;
    return {
      ...copyEntityFile,
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
    driverId: number,
    query: QueryFileDto
  ): Promise<PagedFileResult> {
    return await this.fileRepository.getListFiles(driverId, query);
  }

  /**
   * Tìm kiếm FileEntity theo fileId
   * @param fileId - id của file
   * @returns IFileOutput thông tin file trên database và url đầy đủ để truy cập file
   */
  async findFileById(fileId: number): Promise<IFileOutput | null> {
    const entityFile = await this.fileRepository.findFileById(fileId);
    // Gắn domain từ env với path file
    const url = `${process.env.STORAGE_ENDPOINT}${entityFile.path}`;
    return { ...entityFile, url };
  }

  // async updateFile(fileId: number, input: UpdateFileDto): Promise<FileEntity> {
  //   const entity = await this.findFileById(fileId);
  //   if (!entity) {
  //     mustExist(entity, EErrorFile.FILE_NOT_FOUND, EErrorFile.FILE_NOT_FOUND);
  //   }
  //   Object.assign(entity, input);
  //   return this.fileRepository.save(entity);
  // }

  // async removeFile(fileId: number): Promise<void> {
  //   const result = await this.fileRepository.delete({ fileId });
  //   if (result.affected === 0) {
  //     makeSure(false, EErrorFile.FILE_NOT_FOUND, EErrorFile.FILE_NOT_FOUND);
  //   }
  // }
}
