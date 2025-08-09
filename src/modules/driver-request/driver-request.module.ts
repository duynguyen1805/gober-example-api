import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverRequestService } from './driver-request.service';
import { DriverRequestController } from './driver-request.controller';
import { UpdateDriverRequestInfomationUseCase } from './use-case/update-driver-request-infomation.use-case';
import { FileModule } from '../file/file.module';
import { DriverRequestEntity } from '../../database/entities/driver-request.entity';
import { RequestTypeEntity } from '../../database/entities/request-type.entity';
import { CreateDriverInfomationUseCase } from './use-case/create-driver-request-infomation.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([DriverRequestEntity, RequestTypeEntity]),
    FileModule
  ],
  controllers: [DriverRequestController],
  providers: [
    DriverRequestService,
    CreateDriverInfomationUseCase,
    UpdateDriverRequestInfomationUseCase
  ],
  exports: [DriverRequestService]
})
export class DriverRequestModule {}
