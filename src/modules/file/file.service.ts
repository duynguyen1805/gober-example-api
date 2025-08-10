import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from '../../database/entities/file.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { QueryFileDto } from './dto/query-file.dto';
import { PagedFileResult } from './interfaces/file.interface';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>
  ) {}

  async create(driverId: number, input: CreateFileDto): Promise<FileEntity> {
    const entityFile = this.fileRepository.create({
      filename: input.filename,
      url: input.url,
      mimeType: input.mimeType,
      fileExtension: input.fileExtension,
      size: input.size,
      uploadedById: driverId
    });
    return this.fileRepository.save(entityFile);
  }

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

  async findFileById(fileId: number): Promise<FileEntity | null> {
    return this.fileRepository.findOne({
      where: { fileId }
    });
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
