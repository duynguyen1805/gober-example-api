import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
// guards
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// decorators
import { User } from '../../common/decorators/user.decorator';
// dto
import { UpdateDriverRequestDto } from './dto/update-driver-request.dto';
import { CreateDriverRequestDto } from './dto/create-driver-request.dto';
// service
import { DriverRequestService } from './driver-request.service';
import { DriverRequestDocumentWithCustomId } from 'src/database/mongo-db/driver-request.schema';

@ApiTags('drivers-request')
@Controller('drivers-request')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DriverRequestController {
  constructor(private readonly driverRequestService: DriverRequestService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Tạo thông tin driver request',
    description:
      'Tạo thông tin driver request đăng nhập hiện tại, driverId lấy từ token'
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
            description: 'Nội dung muốn yêu cầu',
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
                filename: 'avatar-can-update.png',
                path: '/uploads/avatar-can-update.png',
                url: 'https://backend-server/gober/avatar-can-update.png',
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
        message: { type: 'string', example: 'ID tệp không hợp lệ' },
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
    @User('driverId') driverId: string,
    @Body() body: CreateDriverRequestDto
  ): Promise<DriverRequestDocumentWithCustomId> {
    return this.driverRequestService.createDriverRequestInformation(
      driverId,
      body
    );
  }

  @Get('find-by-id/:driverRequestId')
  @ApiOperation({
    summary: 'Lấy thông tin driver request theo driverRequestId',
    description: 'Lấy thông tin driver request theo driverRequestId'
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin driver request thành công',
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
            description: 'Cập nhật thông tin tài xế',
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
                filename: 'avatar-can-update.png',
                path: '/uploads/avatar-can-update.png',
                url: 'https://backend-server/gober/avatar-can-update.png',
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
        messageCode: { type: 'string', example: 'INVALID_DRIVER_REQUEST_ID' },
        message: { type: 'string', example: 'ID yêu cầu tài xế không hợp lệ' },
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
    @User('driverId') driverId: string,
    @Param('driverRequestId') driverRequestId: string
  ): Promise<DriverRequestDocumentWithCustomId | null> {
    return this.driverRequestService.findDriverRequestById(
      driverId,
      driverRequestId
    );
  }

  @Patch('update')
  @ApiOperation({
    summary: 'Cập nhật thông tin driver request bằng driverRequestId',
    description: 'Cập nhật thông tin driver request bằng driverRequestId'
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thông tin driver request thành công',
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
            description: 'Cập nhật thông tin tài xế',
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
                filename: 'avatar-can-update-02.png',
                path: '/uploads/avatar-can-update-02.png',
                url: 'https://backend-server/gober/avatar-can-update-02.png',
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
    description: 'Bad request - Avatar không hợp lệ',
    schema: {
      type: 'object',
      properties: {
        messageCode: { type: 'string', example: 'INVALID_FILE_ID' },
        message: { type: 'string', example: 'ID tệp không hợp lệ' },
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
    @User('driverId') driverId: string,
    @Body() body: UpdateDriverRequestDto
  ): Promise<DriverRequestDocumentWithCustomId> {
    return this.driverRequestService.updateDriverRequestInformation(
      driverId,
      body
    );
  }
}
