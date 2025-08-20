import { Module } from '@nestjs/common';
import { FileService } from './modules/file/file.service';
import { FileController } from './modules/file/file.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { configService } from '@app/common/config';
import { FileModule } from './modules/file/file.module';
import { UploadMinIOModule } from './modules/upload-minio/upload-minio.module';

@Module({
  imports: [
    MongooseModule.forRoot(configService.getMongoConfig().uri),
    FileModule,
    UploadMinIOModule
  ]
})
export class UploadAppModule {}
