import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// module
import { FileModule } from '../file/file.module';
// controller
import { DriverRequestController } from './driver-request.controller';
// service
import { DriverRequestService } from './driver-request.service';
// use-case
import { UpdateDriverRequestInfomationUseCase } from './use-case/update-driver-request-infomation.use-case';
import { CreateDriverInfomationUseCase } from './use-case/create-driver-request-infomation.use-case';
// schema
import {
  DriverRequest,
  DriverRequestSchema
} from '../../database/mongo-db/driver-request.schema';
import {
  RequestType,
  RequestTypeSchema
} from '../../database/mongo-db/request-type.schema';
// model.repository
import { DriverRequestModelRepository } from './driver-request.model.repository';
import { RequestTypeModelRepository } from '../request-type/request-type.model.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DriverRequest.name, schema: DriverRequestSchema },
      { name: RequestType.name, schema: RequestTypeSchema }
    ]),
    FileModule
  ],
  controllers: [DriverRequestController],
  providers: [
    DriverRequestService,
    CreateDriverInfomationUseCase,
    UpdateDriverRequestInfomationUseCase,

    DriverRequestModelRepository,
    RequestTypeModelRepository
  ],
  exports: [DriverRequestService]
})
export class DriverRequestModule {}
