import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
// schema
import { File, FileDocument } from '../../database/mongo-db/file.schema';
// dto
import { QueryFileDto } from './dto/query-file.dto';
import { CreateFileDto } from './dto/create-file.dto';
// interface
import { PagedFileResult } from './interfaces/file.interface';

@Injectable()
export class FileModelRepository {
  constructor(
    @InjectModel(File.name)
    private readonly fileModelRepository: Model<FileDocument>
  ) {}

  /**
   * Tạo mới file document
   * @param input - Partial<FileEntity> hoặc CreateFileDto
   * @returns file document được tạo (chưa được lưu vào database)
   */
  async createFile(
    input: Partial<FileDocument> | CreateFileDto
  ): Promise<FileDocument> {
    return new this.fileModelRepository(input);
  }

  /**
   * Lưu file document
   * @param input - FileDocument
   * @returns file document đã được lưu
   */
  async saveFile(fileDocument: FileDocument): Promise<FileDocument> {
    return await fileDocument.save();
  }

  /**
   * Tìm file theo fileId (_id trong Mongo)
   * @param fileId - ObjectId dạng string
   * @returns FileDocument hoặc null
   */
  async findFileById(fileId: string): Promise<FileDocument | null> {
    return this.fileModelRepository.findById(fileId).exec();
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
    const { page = 1, pageSize = 20, keyword, mimeType } = query;
    // Tạo điều kiện filter, sử dụng FilterQuery
    const filter: FilterQuery<FileDocument> = {};
    if (keyword) {
      filter.filename = { $regex: keyword, $options: 'i' }; // ILIKE
    }
    if (mimeType) {
      filter.mimeType = mimeType;
    }
    if (driverId) {
      filter.uploadedById = driverId;
    }

    const [items, total] = await Promise.all([
      this.fileModelRepository
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.fileModelRepository.countDocuments(filter).exec()
    ]);

    return { items, total, page, pageSize };
  }
}
