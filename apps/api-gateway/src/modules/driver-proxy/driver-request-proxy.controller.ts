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
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
// decorators
import { User } from '@app/common/decorators/user.decorator';
// dto
import { GetDriverRequestByIdParamDto } from '@app/common/dto/driver-request/get-driver-request-by-id-param.dto';
import { UpdateDriverRequestDto } from '@app/common/dto/driver-request/update-driver-request.dto';
import { CreateDriverRequestDto } from '@app/common/dto/driver-request/create-driver-request.dto';
// service
import { DriverRequestProxyService } from '@app/proxy/driver-proxy/driver-request-proxy.service';
import { DriverRequestDocumentWithCustomId } from '@app/database/schemas/driver-request.schema';

@ApiTags('drivers-request')
@Controller('drivers-request')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DriverRequestController {
  constructor(
    private readonly driverRequestProxyService: DriverRequestProxyService
  ) {}

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
            deletedAt: null,
            code: '123123',
            description: 'Nội dung muốn yêu cầu',
            typeId: '689a915c4ce57ddcc6800c3d',
            status: 'pending',
            driverId: '689a8e4049df769dd9e3bd69',
            fileIds: ['689a8a9655f410d124d91483'],
            createdAt: '2025-08-12T01:07:38.857Z',
            updatedAt: '2025-08-12T01:07:38.857Z',
            driverRequestId: '689a93daeca946ea27a41367',
            id: '689a93daeca946ea27a41367'
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
    return this.driverRequestProxyService.createDriverRequestInformation(
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
            deletedAt: null,
            code: '123123',
            description: 'Nội dung muốn yêu cầu',
            typeId: '689a915c4ce57ddcc6800c3d',
            status: 'pending',
            driverId: '689a8e4049df769dd9e3bd69',
            fileIds: [
              {
                deletedAt: null,
                filename: 'meo_bay_lac.png',
                path: '/gober/meo_bay_lac.png',
                mimeType: 'image/png',
                fileExtension: 'png',
                size: 1024000,
                uploadedById: '689a7e7e568b7b237866dfb3',
                fileId: '689a8a9655f410d124d91483',
                id: '689a8a9655f410d124d91483'
              }
            ],
            createdAt: '2025-08-12T01:07:38.857Z',
            updatedAt: '2025-08-12T01:07:38.857Z',
            driverRequestId: '689a93daeca946ea27a41367',
            id: '689a93daeca946ea27a41367'
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
    // @Param('driverRequestId') driverRequestId: string
    @Param() params: GetDriverRequestByIdParamDto
  ): Promise<DriverRequestDocumentWithCustomId | null> {
    return this.driverRequestProxyService.findDriverRequestById(
      params.driverRequestId
    );
  }

  @Patch('update/:driverRequestId')
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
            deletedAt: null,
            code: '123123',
            description: 'Update nội dung yêu cầu mới',
            typeId: '689a915c4ce57ddcc6800c3d',
            status: 'pending',
            driverId: '689a8e4049df769dd9e3bd69',
            fileIds: ['689a8a9655f410d124d91483'],
            createdAt: '2025-08-12T01:07:38.857Z',
            updatedAt: '2025-08-12T01:07:38.857Z',
            driverRequestId: '689a93daeca946ea27a41367',
            id: '689a93daeca946ea27a41367'
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
    @Param('driverRequestId') driverRequestId: string,
    @Body() body: UpdateDriverRequestDto
  ): Promise<DriverRequestDocumentWithCustomId> {
    return this.driverRequestProxyService.updateDriverRequestInformation(
      driverId,
      driverRequestId,
      body
    );
  }
}
