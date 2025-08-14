import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// controller
import { DriverController } from './driver.controller';
// service
import { DriverService } from './driver.service';
// model.repository
import { DriverModelRepository } from './driver.model.repository';
// use-case
import { UpdateDriverInfomationUseCase } from './use-cases/update-driver-infomation.use-case';
// schema
import { Driver, DriverSchema } from '@app/database/schemas/driver.schema';
import {
  DriverRefreshToken,
  DriverRefreshTokenSchema
} from '@app/database/schemas';
import {
  DriverRequest,
  DriverRequestSchema
} from '@app/database/schemas/driver-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Driver.name, schema: DriverSchema },
      { name: DriverRefreshToken.name, schema: DriverRefreshTokenSchema },
      { name: DriverRequest.name, schema: DriverRequestSchema }
    ])
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
