import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { DriverRequestService } from './driver-request.service';
import { DriverRequestEntity } from '../../database/entities/driver-request.entity';
import { UpdateDriverRequestDto } from './dto/update-driver-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { CreateDriverRequestDto } from './dto/create-driver-request.dto';

@ApiTags('drivers-request')
@Controller('drivers-request')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DriverRequestController {
  constructor(private readonly driverRequestService: DriverRequestService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Tạo thông tin driver request',
    description: 'Tạo thông tin driver request, driverId lấy từ token'
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo thông tin driver request thành công',
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
            code: '123123',
            description: 'Nội dung muốn yêu cầu by driver id = 1',
            typeId: 3,
            status: 'pending',
            driverId: 1,
            files: [
              {
                isActive: true,
                createdAt: '2025-08-08T01:53:06.753Z',
                updatedAt: '2025-08-08T01:53:06.753Z',
                deletedAt: null,
                fileId: 1,
                filename: 'avatar-john.png',
                url: '/uploads/avatar-john.png',
                mimeType: 'image/png',
                fileExtension: 'png',
                size: 204800,
                uploadedById: 1
              }
            ],
            deletedAt: null,
            approvedById: null,
            approvedAt: null,
            reason: null,
            isActive: true,
            createdAt: '2025-08-09T04:36:38.717Z',
            updatedAt: '2025-08-09T04:36:38.717Z',
            driverRequestId: 7
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
        messageCode: { type: 'string', example: 'INVALID_FILE_ID' },
        message: { type: 'string', example: 'Invalid file id' },
        statusCode: { type: 'number', example: 400 },
        timestamp: { type: 'string', format: '2025-08-09T11:14:52.713Z' },
        success: { type: 'boolean', example: false },
        path: { type: 'string', example: '/drivers-request/create' },
        method: { type: 'string', example: 'POST' },
        errorName: { type: 'string', example: 'ServerError' }
      }
    }
  })
  @ApiBody({ type: CreateDriverRequestDto })
  async createDriverRequestInformation(
    @User('driverId') driverId: number,
    @Body() body: CreateDriverRequestDto
  ): Promise<DriverRequestEntity> {
    return this.driverRequestService.createDriverRequestInformation(
      driverId,
      body
    );
  }

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
            createdAt: '2025-08-08T01:53:06.753Z',
            updatedAt: '2025-08-08T01:53:06.753Z',
            deletedAt: null,
            driverRequestId: 1,
            code: 'REQ-0001',
            description: 'Request leave for 1 day',
            typeId: 1,
            status: 'pending',
            approvedById: null,
            approvedAt: null,
            reason: null,
            driverId: 1,
            files: [
              {
                isActive: true,
                createdAt: '2025-08-08T01:53:06.753Z',
                updatedAt: '2025-08-08T01:53:06.753Z',
                deletedAt: null,
                fileId: 2,
                filename: 'id-front-john.png',
                url: '/uploads/id-front-john.png',
                mimeType: 'image/png',
                fileExtension: 'png',
                size: 102400,
                uploadedById: 1
              }
            ]
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Driver Request không tồn tại',
    schema: {
      type: 'object',
      properties: {
        messageCode: { type: 'string', example: 'DRIVER_REQUEST_NOT_FOUND' },
        message: { type: 'string', example: 'DRIVER_REQUEST_NOT_FOUND' },
        statusCode: { type: 'number', example: 400 },
        timestamp: { type: 'string', format: '2025-08-09T08:44:08.429Z' },
        success: { type: 'boolean', example: false },
        path: { type: 'string', example: '/drivers/find-by-id' },
        method: { type: 'string', example: 'POST' },
        errorName: { type: 'string', example: 'ServerError' }
      }
    }
  })
  async findDriverRequestById(
    @User('driverId') driverId: number
  ): Promise<DriverRequestEntity[] | null> {
    return this.driverRequestService.findDriverRequestById(driverId);
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
  @ApiBody({ type: UpdateDriverRequestDto })
  async updateDriverRequestInformation(
    @User('driverId') driverId: number,
    @Body() body: UpdateDriverRequestDto
  ): Promise<DriverRequestEntity> {
    return this.driverRequestService.updateDriverRequestInformation(
      driverId,
      body
    );
  }
}
