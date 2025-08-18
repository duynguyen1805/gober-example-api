import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
} from '@app/database/schemas/driver-request.schema';
import {
  RequestType,
  RequestTypeSchema
} from '@app/database/schemas/request-type.schema';
// model.repository
import { DriverRequestModelRepository } from './driver-request.model.repository';
import { RequestTypeModelRepository } from '../request-type/request-type.model.repository';
// proxy
import { FileProxyModule } from '@app/proxy/file-proxy/file-proxy.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DriverRequest.name, schema: DriverRequestSchema },
      { name: RequestType.name, schema: RequestTypeSchema }
    ]),
    FileProxyModule
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
