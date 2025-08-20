import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
// dto
import { UpdateDriverRequestDto } from '@app/common/dto/driver-request/update-driver-request.dto';
import { CreateDriverRequestDto } from '@app/common/dto/driver-request/create-driver-request.dto';
// service
import { DriverRequestService } from './driver-request.service';
import { DriverRequestDocumentWithCustomId } from '@app/database/schemas/driver-request.schema';

@Controller()
export class DriverRequestController {
  constructor(private readonly driverRequestService: DriverRequestService) {}

  @MessagePattern({ cmd: 'createDriverRequestInformation' })
  async createDriverRequestInformation(
    @Payload() driverId: string,
    @Payload() body: CreateDriverRequestDto
  ): Promise<DriverRequestDocumentWithCustomId> {
    return this.driverRequestService.createDriverRequestInformation(
      driverId,
      body
    );
  }

  @MessagePattern({ cmd: 'findDriverRequestById' })
  async findDriverRequestById(
    @Payload() driverRequestId: string
  ): Promise<DriverRequestDocumentWithCustomId | null> {
    return this.driverRequestService.findDriverRequestById(driverRequestId);
  }

  @MessagePattern({ cmd: 'updateDriverRequestInformation' })
  async updateDriverRequestInformation(
    @Payload() driverId: string,
    @Payload() driverRequestId: string,
    @Payload() body: UpdateDriverRequestDto
  ): Promise<DriverRequestDocumentWithCustomId> {
    return this.driverRequestService.updateDriverRequestInformation(
      driverId,
      driverRequestId,
      body
    );
  }
}
