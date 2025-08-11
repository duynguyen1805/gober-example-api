import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// schema
import { File, FileSchema } from '../../database/mongo-db/file.schema';
// controller
import { FileController } from './file.controller';
// service
import { FileService } from './file.service';
// model.repository
import { FileModelRepository } from './file.model.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }])
  ],
  controllers: [FileController],
  providers: [FileService, FileModelRepository],
  exports: [FileService]
})
export class FileModule {}
