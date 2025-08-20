import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UseGuards
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
// interceptors
import {
  SingleUploadInterceptor,
  MultiUploadInterceptor
} from '@app/common/interceptors/upload.interceptor';
// interfaces
import {
  IUploadedFileInfoOutput,
  IUploadResult
} from '@app/common/interfaces/upload.interface';
// service
import { UploadMinioService } from './upload-minio.service';

@Controller()
export class UploadMinioController {
  constructor(private readonly uploadMinioService: UploadMinioService) {}

  @MessagePattern({ cmd: 'singleUploadMinio' })
  @UseInterceptors(SingleUploadInterceptor)
  async singleUploadMinio(
    @UploadedFile() file: Express.Multer.File
  ): Promise<IUploadedFileInfoOutput> {
    return this.uploadMinioService.singleUploadMinio(file);
  }

  @MessagePattern({ cmd: 'multiUploadMinio' })
  @UseInterceptors(MultiUploadInterceptor)
  async multiUploadMinio(
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<IUploadResult> {
    return this.uploadMinioService.multiUploadMinio(files);
  }
}
