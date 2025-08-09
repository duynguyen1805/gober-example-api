import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverEntity } from '../../database/entities/driver.entity';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { UpdateDriverInfomationUseCase } from './use-case/update-driver-infomation.use-case';
import { FileModule } from '../file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([DriverEntity]), FileModule],
  controllers: [DriverController],
  providers: [DriverService, UpdateDriverInfomationUseCase],
  exports: [DriverService]
})
export class DriverModule {}
