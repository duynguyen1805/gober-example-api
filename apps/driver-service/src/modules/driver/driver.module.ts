import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// controller
import { DriverController } from './driver.controller';
// service
import { DriverService } from './driver.service';
// model.repository
import { DriverModelRepository } from './driver.model.repository';
import { DriverRefreshTokenModelRepository } from './driver-refresh-token.model.repository';
// use-case
import { UpdateDriverInfomationUseCase } from './use-cases/update-driver-infomation.use-case';
// schema
import { Driver, DriverSchema } from '@app/database/schemas/driver.schema';
import {
  DriverRefreshToken,
  DriverRefreshTokenSchema,
  FileSchema
} from '@app/database/schemas';
import {
  DriverRequest,
  DriverRequestSchema
} from '@app/database/schemas/driver-request.schema';
// module
import { FileProxyModule } from '@app/proxy/file-proxy/file-proxy.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Driver.name, schema: DriverSchema },
      { name: DriverRefreshToken.name, schema: DriverRefreshTokenSchema },
      { name: DriverRequest.name, schema: DriverRequestSchema },
      { name: File.name, schema: FileSchema }
    ]),
    FileProxyModule
  ],
  controllers: [DriverController],
  providers: [
    DriverService,
    DriverModelRepository,
    DriverRefreshTokenModelRepository,
    UpdateDriverInfomationUseCase
  ],
  exports: [DriverService]
})
export class DriverModule {}
