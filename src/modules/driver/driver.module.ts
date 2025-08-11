import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// modules
import { FileModule } from '../file/file.module';
// controller
import { DriverController } from './driver.controller';
// service
import { DriverService } from './driver.service';
// entity
import { DriverEntity } from '../../database/entities/driver.entity';
// repository
import { DriverRepository } from './driver.repository';
// use-case
import { UpdateDriverInfomationUseCase } from './use-case/update-driver-infomation.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([DriverEntity]), FileModule],
  controllers: [DriverController],
  providers: [DriverService, DriverRepository, UpdateDriverInfomationUseCase],
  exports: [DriverService]
})
export class DriverModule {}
