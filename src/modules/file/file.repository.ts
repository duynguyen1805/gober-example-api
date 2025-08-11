import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// entity
import { FileEntity } from '../../database/entities/file.entity';
// dto
import { QueryFileDto } from './dto/query-file.dto';
import { CreateFileDto } from './dto/create-file.dto';
// interface
import { PagedFileResult } from './interfaces/file.interface';

@Injectable()
export class FileRepository {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>
  ) {}

  /**
   * Tạo mới FileEntity
   * @param input - Partial<FileEntity> hoặc CreateFileDto
   * @returns FileEntity
   */
  async createFile(
    input: Partial<FileEntity> | CreateFileDto
  ): Promise<FileEntity> {
    return this.fileRepository.create(input);
  }

  /**
   * Lưu FileEntity
   * @param input - FileEntity
   * @returns FileEntity đã được lưu
   */
  async saveFile(input: FileEntity): Promise<FileEntity> {
    return await this.fileRepository.save(input);
  }

  /**
   * Tìm kiếm FileEntity theo fileId
   * @param fileId - id của file
   * @returns FileEntity tìm thấy hoặc null
   */
  async findFileById(fileId: number): Promise<FileEntity | null> {
    return this.fileRepository.findOne({ where: { fileId } });
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
    const { page = 1, pageSize = 20, keyword, mimeType } = query;
    const queryDB = this.fileRepository.createQueryBuilder('f');

    if (keyword) {
      queryDB.andWhere('f.filename ILIKE :keyword', {
        keyword: `%${keyword}%`
      });
    }
    if (mimeType) {
      queryDB.andWhere('f.mime_type = :mimeType', { mimeType });
    }
    if (driverId) {
      queryDB.andWhere('f.uploaded_by_id = :uploadedById', { driverId });
    }

    queryDB
      .orderBy('f.created_at', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [items, total] = await queryDB.getManyAndCount();
    return { items, total, page, pageSize };
  }
}
