import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { DriverService } from './driver.service';
import { DriverEntity } from '../../database/entities/driver.entity';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';

@ApiTags('drivers')
@Controller('drivers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get('find-by-id')
  @ApiOperation({
    summary: 'Lấy thông tin driver',
    description: 'Lấy thông tin driver bằng driverId lấy từ token'
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin driver thành công',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true
        },
        data: {
          type: 'object',
          example: {
            isActive: true,
            createdAt: '2025-08-08T22:28:44.808Z',
            updatedAt: '2025-08-08T22:28:44.808Z',
            deletedAt: null,
            driverId: 3,
            fullName: 'Nguyen Van A updated',
            phoneNumber: '0907123456',
            email: 'driver01@gmail.com',
            deviceToken: null,
            lastLogin: null,
            emailVerifiedAt: null,
            avatar: 1,
            activeAreaId: 1,
            temporaryAddress: 'hẻm 12/34, Quận 3, HCMC',
            identityCardFrontId: 1,
            identityCardBackId: 1,
            status: 'inactive',
            submittedAt: null,
            approvalStatus: 'draft',
            approvedAt: null,
            approvedById: null,
            approvedNote: null,
            createdById: null,
            balance: 0
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Driver không tồn tại',
    schema: {
      type: 'object',
      properties: {
        messageCode: { type: 'string', example: 'DRIVER_NOT_FOUND' },
        message: { type: 'string', example: 'DRIVER_NOT_FOUND' },
        statusCode: { type: 'number', example: 400 },
        timestamp: { type: 'string', format: '2025-08-09T08:44:08.429Z' },
        success: { type: 'boolean', example: false },
        path: { type: 'string', example: '/drivers/find-by-id' },
        method: { type: 'string', example: 'POST' },
        errorName: { type: 'string', example: 'ServerError' }
      }
    }
  })
  async findDriverById(
    @User('driverId') driverId: number
  ): Promise<DriverEntity | null> {
    return this.driverService.findDriverById(driverId);
  }

  @Patch('update')
  @ApiOperation({
    summary: 'Cập nhật thông tin driver',
    description: 'Cập nhật thông tin driver bằng driverId lấy từ token'
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thông tin driver thành công',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true
        },
        data: {
          type: 'object',
          example: {
            isActive: true,
            createdAt: '2025-08-08T22:28:44.808Z',
            updatedAt: '2025-08-08T22:28:44.808Z',
            deletedAt: null,
            driverId: 3,
            fullName: 'Nguyen Van A updated',
            phoneNumber: '0907123456',
            email: 'driver01@gmail.com',
            deviceToken: null,
            lastLogin: null,
            emailVerifiedAt: null,
            avatar: 1,
            activeAreaId: 1,
            temporaryAddress: 'hẻm 12/34, Quận 3, HCMC',
            identityCardFrontId: 1,
            identityCardBackId: 1,
            status: 'inactive',
            submittedAt: null,
            approvalStatus: 'draft',
            approvedAt: null,
            approvedById: null,
            approvedNote: null,
            createdById: null,
            balance: 0
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Avatar không hợp lệ',
    schema: {
      type: 'object',
      properties: {
        messageCode: { type: 'string', example: 'INVALID_AVATAR' },
        message: { type: 'string', example: 'INVALID_AVATAR' },
        statusCode: { type: 'number', example: 400 },
        timestamp: { type: 'string', format: '2025-08-09T08:44:08.429Z' },
        success: { type: 'boolean', example: false },
        path: { type: 'string', example: '/drivers/update' },
        method: { type: 'string', example: 'PATCH' },
        errorName: { type: 'string', example: 'ServerError' }
      }
    }
  })
  @ApiBody({ type: UpdateDriverDto })
  async updateDriverInformation(
    @User('driverId') driverId: number,
    @Body() body: UpdateDriverDto
  ): Promise<DriverEntity> {
    return this.driverService.updateDriverInformation(driverId, body);
  }
}
