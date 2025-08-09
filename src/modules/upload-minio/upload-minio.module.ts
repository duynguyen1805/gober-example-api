import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UploadMinioController } from './upload-minio.controller';
import { UploadMinioService } from './upload-minio.service';
import {
  SingleUploadInterceptor,
  MultiUploadInterceptor
} from '../../common/interceptors/upload.interceptor';
import { EAllowedFileType } from './enums/upload.enum';

@Module({
  imports: [],
  controllers: [UploadMinioController],
  providers: [
    UploadMinioService,
    SingleUploadInterceptor,
    MultiUploadInterceptor
    // {
    //   provide: 'ALLOWED_FILE_TYPES',
    //   useValue: [
    //     EAllowedFileType.IMAGE,
    //   ]
    // }
  ],
  exports: [UploadMinioService]
})
export class UploadMinIOModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(FileTypeFilterMiddleware)
  //     .forRoutes(
  //       { path: 'upload-minio/single', method: RequestMethod.POST },
  //       { path: 'upload-minio/multi', method: RequestMethod.POST }
  //     );
  // }
}
