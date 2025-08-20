import { Controller, UseGuards } from '@nestjs/common';
// decorators
// import { User } from '@app/common/decorators/user.decorator';
//dto
import { UpdateDriverDto } from '@app/common/dto/driver/update-driver.dto';
// service
import { DriverService } from './driver.service';
// schema
import { DriverDocument } from '@app/database/schemas/driver.schema';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  DriverRefreshTokenDocument,
  DriverRefreshTokenDocumentWithCustomId
} from '@app/database/schemas/driver-refresh-token.schema';

@Controller()
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @MessagePattern({ cmd: 'findDriverById' })
  async findDriverById(driverId: string): Promise<DriverDocument | null> {
    return this.driverService.findDriverById(driverId);
  }

  @MessagePattern({ cmd: 'findDriversByEmailOrPhoneNumber' })
  async findDriversByEmailOrPhoneNumber(input: {
    email?: string;
    phoneNumber?: string;
    identifier?: string;
  }): Promise<DriverDocument | null> {
    return this.driverService.findDriversByEmailOrPhoneNumber(input);
  }

  @MessagePattern({ cmd: 'updateDriverInformation' })
  async updateDriverInformation(
    @Payload() driverId: string,
    @Payload() body: UpdateDriverDto
  ): Promise<DriverDocument> {
    return this.driverService.updateDriverInformation(driverId, body);
  }

  @MessagePattern({ cmd: 'updateDriverRefreshToken' })
  async updateDriverRefreshToken(input: {
    criteria: Partial<DriverRefreshTokenDocumentWithCustomId>;
    dataUpdate: Partial<DriverRefreshTokenDocumentWithCustomId>;
  }): Promise<boolean> {
    return this.driverService.updateDriverRefreshToken(input);
  }

  @MessagePattern({ cmd: 'createDriverRefreshToken' })
  async createDriverRefreshToken(
    @Payload() input: Partial<DriverRefreshTokenDocumentWithCustomId>
  ): Promise<DriverRefreshTokenDocument> {
    return this.driverService.createDriverRefreshToken(input);
  }

  @MessagePattern({ cmd: 'saveDriverRefreshToken' })
  async saveDriverRefreshToken(
    @Payload() input: DriverRefreshTokenDocumentWithCustomId
  ): Promise<DriverRefreshTokenDocument> {
    return this.driverService.saveDriverRefreshToken(input);
  }
}
