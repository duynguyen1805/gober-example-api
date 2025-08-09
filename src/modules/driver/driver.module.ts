import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverEntity } from '../../database/entities/driver.entity';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DriverEntity])],
  controllers: [DriverController],
  providers: [DriverService],
  exports: [DriverService]
})
export class DriverModule {}