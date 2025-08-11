import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// entity
import { FileEntity } from '../../database/entities/file.entity';
// controller
import { FileController } from './file.controller';
// service
import { FileService } from './file.service';
// repository
import { FileRepository } from './file.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [FileController],
  providers: [FileService, FileRepository],
  exports: [FileService]
})
export class FileModule {}
