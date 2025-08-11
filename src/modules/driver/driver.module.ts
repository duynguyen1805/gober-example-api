import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// modules
import { FileModule } from '../file/file.module';
// controller
import { DriverController } from './driver.controller';
// service
import { DriverService } from './driver.service';
// model.repository
import { DriverModelRepository } from './driver.model.repository';
// use-case
import { UpdateDriverInfomationUseCase } from './use-case/update-driver-infomation.use-case';
// schema
import { Driver, DriverSchema } from '../../database/mongo-db/driver.schema';
import {
  DriverRequest,
  DriverRequestSchema
} from '../../database/mongo-db/driver-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Driver.name, schema: DriverSchema },
      { name: DriverRequest.name, schema: DriverRequestSchema }
    ]),
    FileModule
  ],
  controllers: [DriverController],
  providers: [
    DriverService,
    DriverModelRepository,
    UpdateDriverInfomationUseCase
  ],
  exports: [DriverService]
})
export class DriverModule {}
