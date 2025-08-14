import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
// decorators
import { User } from '@app/common/decorators/user.decorator';
//dto
import { UpdateDriverDto } from '@app/common/dto/driver/update-driver.dto';
// service
import { DriverService } from './driver.service';
// schema
import { DriverDocument } from '@app/database/schemas/driver.schema';
import { MessagePattern } from '@nestjs/microservices';
import { DriverRefreshTokenDocumentWithCustomId } from '@app/database/schemas/driver-refresh-token.schema';

@Controller()
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @MessagePattern('findDriverById')
  async findDriverById(
    @User('driverId') driverId: string
  ): Promise<DriverDocument | null> {
    return this.driverService.findDriverById(driverId);
  }

  @MessagePattern('findDriversByEmailOrPhoneNumber')
  async findDriversByEmailOrPhoneNumber(
    @Body() input: { email?: string; phoneNumber?: string; identifier?: string }
  ): Promise<DriverDocument | null> {
    return this.driverService.findDriversByEmailOrPhoneNumber(input);
  }

  @MessagePattern('updateDriverInformation')
  async updateDriverInformation(
    @User('driverId') driverId: string,
    @Body() body: UpdateDriverDto
  ): Promise<DriverDocument> {
    return this.driverService.updateDriverInformation(driverId, body);
  }

  @MessagePattern('updateDriverRefreshToken')
  async updateDriverRefreshToken(
    @Body()
    input: {
      criteria: Partial<DriverRefreshTokenDocumentWithCustomId>;
      dataUpdate: Partial<DriverRefreshTokenDocumentWithCustomId>;
    }
  ): Promise<boolean> {
    return this.driverService.updateDriverRefreshToken(input);
  }
}
