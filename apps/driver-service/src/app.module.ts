import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { configService } from '@app/common/config';
import { DriverModule } from './modules/driver/driver.module';

@Module({
  imports: [
    MongooseModule.forRoot(configService.getMongoConfig().uri),
    DriverModule
  ]
})
export class DriverAppModule {}
