import { Module } from '@nestjs/common';
import { FileService } from './modules/file/file.service';
import { FileController } from './modules/file/file.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { configService } from '@app/common/config';
import { FileModule } from './modules/file/file.module';

@Module({
  imports: [
    MongooseModule.forRoot(configService.getMongoConfig().uri),
    FileModule
  ]
})
export class FileAppModule {}
