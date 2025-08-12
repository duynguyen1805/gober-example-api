import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
// decorators
import { User } from '../../common/decorators/user.decorator';
// guards
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
//dto
import { UpdateDriverDto } from './dto/update-driver.dto';
// service
import { DriverService } from './driver.service';
// schema
import { DriverDocument } from '../../database/mongo-db/driver.schema';

@ApiTags('drivers')
@Controller('drivers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get('find-by-id')
  @ApiOperation({
    summary: 'Lấy thông tin driver',
    description:
      'Lấy thông tin của driver đăng nhập hiện tại bằng driverId lấy từ token'
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
            fullName: 'Người dùng 01 sau cập nhật',
            phoneNumber: '0900000022',
            email: 'driver01update@example.com',
            activeAreaId: '689a8a9655f410d124d91412',
            temporaryAddress: 'hẻm 12/34, Quận 3, HCMC',
            identityCardFrontId: {
              deletedAt: null,
              filename: 'meo_bay_lac.png',
              path: '/gober/meo_bay_lac.png',
              mimeType: 'image/png',
              fileExtension: 'png',
              size: 1024000,
              uploadedById: '689a7e7e568b7b237866dfb3',
              fileId: '689a8a9655f410d124d91483',
              id: '689a8a9655f410d124d91483'
            },
            identityCardBackId: {
              deletedAt: null,
              filename: 'meo_bay_lac.png',
              path: '/gober/meo_bay_lac.png',
              mimeType: 'image/png',
              fileExtension: 'png',
              size: 1024000,
              uploadedById: '689a7e7e568b7b237866dfb3',
              fileId: '689a8a9655f410d124d91483',
              id: '689a8a9655f410d124d91483'
            },
            status: 'inactive',
            approvalStatus: 'draft',
            balance: 0,
            pin: '123456',
            isActive: true,
            serviceTypeIds: [],
            banks: [],
            emergencyContacts: [],
            vehicles: [],
            signatures: [],
            uniforms: [],
            availabilities: [],
            createdAt: '2025-08-12T00:43:44.919Z',
            updatedAt: '2025-08-12T00:51:35.230Z',
            avatarFileId: {
              deletedAt: null,
              filename: 'meo_bay_lac.png',
              path: '/gober/meo_bay_lac.png',
              mimeType: 'image/png',
              fileExtension: 'png',
              size: 1024000,
              uploadedById: '689a7e7e568b7b237866dfb3',
              fileId: '689a8a9655f410d124d91483',
              id: '689a8a9655f410d124d91483'
            },
            driverId: '689a8e4049df769dd9e3bd69',
            id: '689a8e4049df769dd9e3bd69'
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
        message: { type: 'string', example: 'Không tìm thấy tài xế' },
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
    @User('driverId') driverId: string
  ): Promise<DriverDocument | null> {
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
            fullName: 'Người dùng 01 sau cập nhật',
            phoneNumber: '0900000022',
            email: 'driver01update@example.com',
            activeAreaId: '689a8a9655f410d124d91412',
            temporaryAddress: 'hẻm 12/34, Quận 3, HCMC',
            identityCardFrontId: {
              deletedAt: null,
              filename: 'meo_bay_lac.png',
              path: '/gober/meo_bay_lac.png',
              mimeType: 'image/png',
              fileExtension: 'png',
              size: 1024000,
              uploadedById: '689a7e7e568b7b237866dfb3',
              fileId: '689a8a9655f410d124d91483',
              id: '689a8a9655f410d124d91483'
            },
            identityCardBackId: {
              deletedAt: null,
              filename: 'meo_bay_lac.png',
              path: '/gober/meo_bay_lac.png',
              mimeType: 'image/png',
              fileExtension: 'png',
              size: 1024000,
              uploadedById: '689a7e7e568b7b237866dfb3',
              fileId: '689a8a9655f410d124d91483',
              id: '689a8a9655f410d124d91483'
            },
            status: 'inactive',
            approvalStatus: 'draft',
            balance: 0,
            pin: '123456',
            isActive: true,
            serviceTypeIds: [],
            banks: [],
            emergencyContacts: [],
            vehicles: [],
            signatures: [],
            uniforms: [],
            availabilities: [],
            createdAt: '2025-08-12T00:43:44.919Z',
            updatedAt: '2025-08-12T00:46:47.196Z',
            driverId: '689a8e4049df769dd9e3bd69',
            id: '689a8e4049df769dd9e3bd69'
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
        message: { type: 'string', example: 'Ảnh đại diện không hợp lệ' },
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
    @User('driverId') driverId: string,
    @Body() body: UpdateDriverDto
  ): Promise<DriverDocument> {
    return this.driverService.updateDriverInformation(driverId, body);
  }
}
