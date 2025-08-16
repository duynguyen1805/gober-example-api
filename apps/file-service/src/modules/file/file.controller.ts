import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
// schema
import { File } from '@app/database/schemas/file.schema';
// dto
import { CreateFileDto } from '../../../../../libs/common/src/dto/file/create-file.dto';
import { UpdateFileDto } from '../../../../../libs/common/src/dto/file/update-file.dto';
import { QueryFileDto } from '../../../../../libs/common/src/dto/file/query-file.dto';
// interface
import { IFileOutput } from '../../../../../libs/common/src/interfaces/file.interface';
// service
import { FileService } from './file.service';

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @MessagePattern({ cmd: 'createFile' })
  async createFile(input: {
    driverId: string;
    body: CreateFileDto;
  }): Promise<IFileOutput> {
    return this.fileService.createFile(input);
  }

  @MessagePattern({ cmd: 'getListFiles' })
  async getListFiles(input: { driverId: string; query: QueryFileDto }) {
    return this.fileService.getListFiles(input);
  }

  @MessagePattern({ cmd: 'findFileById' })
  async findFileById({ id }: { id: string }): Promise<IFileOutput | null> {
    return this.fileService.findFileById(id);
  }

  @MessagePattern({ cmd: 'findFileByIdAndUploadedById' })
  async findFileByIdAndUploadedById(input: {
    driverId: string;
    id: string;
  }): Promise<IFileOutput | null> {
    return this.fileService.findFileByIdAndUploadedById(input);
  }
}
