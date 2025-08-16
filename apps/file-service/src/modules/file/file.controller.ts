import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
// decorators
import { User } from '@app/common/decorators/user.decorator';
// guards
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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

  @MessagePattern({ cmd: 'findFileByIdById' })
  async findFileByIdById({ id }: { id: string }): Promise<IFileOutput | null> {
    return this.fileService.findFileById(id);
  }
}
