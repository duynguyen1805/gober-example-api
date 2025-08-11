import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// entity
import { DriverRequestEntity } from '../../database/entities/driver-request.entity';
import { RequestTypeEntity } from '../../database/entities/request-type.entity';
// module
import { FileModule } from '../file/file.module';
// controller
import { DriverRequestController } from './driver-request.controller';
// service
import { DriverRequestService } from './driver-request.service';
// use-case
import { UpdateDriverRequestInfomationUseCase } from './use-case/update-driver-request-infomation.use-case';
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
