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
import { IFileOutput } from './interfaces/file.interface';
// service
import { FileService } from './file.service';
import { MessagePattern } from '@nestjs/microservices';

export class FileController {
  constructor(private readonly fileService: FileService) {}

  async createFile(
    body: CreateFileDto,
    @User('driverId') driverId: string
  ): Promise<IFileOutput> {
    return this.fileService.createFile(driverId, body);
  }

  async getListFiles(query: QueryFileDto, @User('driverId') driverId: string) {
    return this.fileService.getListFiles(driverId, query);
  }

  @MessagePattern({ cmd: 'get_file_by_id' })
  async getfindFileByIdById({
    id
  }: {
    id: string;
  }): Promise<IFileOutput | null> {
    return this.fileService.findFileById(id);
  }
}
