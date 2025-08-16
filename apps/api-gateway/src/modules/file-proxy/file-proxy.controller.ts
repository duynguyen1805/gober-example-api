import {
  Post,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Patch,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiResponse
} from '@nestjs/swagger';
// decorators
import { User } from '@app/common/decorators/user.decorator';
// guards
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// dto
import { CreateFileDto } from '@app/common/dto/file/create-file.dto';
import { UpdateFileDto } from '@app/common/dto/file/update-file.dto';
import { QueryFileDto } from '@app/common/dto/file/query-file.dto';
// interface
import { IFileOutput } from '@app/common/interfaces/file.interface';
// service
import { FileProxyService } from '@app/proxy/file-proxy/file-proxy.service';

@ApiTags('files')
@Controller('files')
export class FileProxyController {
  constructor(private readonly fileProxyService: FileProxyService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo record vào bảng File',
    description: 'Tạo record vào bảng File'
  })
  @ApiBody({ type: CreateFileDto })
  @ApiCreatedResponse({
    description: 'Tạo record file thành công',
    type: File,
    schema: {
      properties: {
        success: {
          type: 'boolean',
          example: true
        },
        data: {
          type: 'object',
          example: {
            deletedAt: null,
            filename: 'image.png',
            path: '/gober/meo_bay_lac.png',
            mimeType: 'image/png',
            fileExtension: 'png',
            size: 455431,
            _id: '689a856b772acdb811f86e4f',
            __v: 0,
            fileId: '689a856b772acdb811f86e4f',
            id: '689a856b772acdb811f86e4f',
            url: 'localhost/gober/meo_bay_lac.png'
          }
        }
      }
    }
  })
  async create(
    @Body() body: CreateFileDto,
    @User('driverId') driverId: string
  ): Promise<IFileOutput> {
    return await this.fileProxyService.createFile(driverId, body);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách cách file của driver hiện tại',
    description: 'Lấy danh sách có kèm filters thông tin file'
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách file thành công.',
    schema: {
      example: {
        items: [
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
        total: 1,
        page: 1,
        pageSize: 20
      }
    }
  })
  async list(@Query() query: QueryFileDto, @User('driverId') driverId: string) {
    return await this.fileProxyService.getListFiles(driverId, query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin 1 file cụ thể',
    description: 'Lấy thông tin file bằng fileId'
  })
  @ApiResponse({
    description: 'Lấy thông tin file thành công',
    schema: {
      properties: {
        success: {
          type: 'boolean',
          example: true
        },
        data: {
          type: 'object',
          example: {
            _id: '689a8a9655f410d124d91483',
            deletedAt: null,
            filename: 'meo_bay_lac.png',
            path: '/gober/meo_bay_lac.png',
            mimeType: 'image/png',
            fileExtension: 'png',
            size: 1024000,
            uploadedById: '689a7e7e568b7b237866dfb3',
            __v: 0,
            fileId: '689a8a9655f410d124d91483',
            id: '689a8a9655f410d124d91483',
            url: 'localhost/gober/meo_bay_lac.png'
          }
        }
      }
    }
  })
  @ApiParam({ name: 'id', required: true, example: '689a8a9655f410d124d91483' })
  async getFileById(
    @Param('id') id: string
    // @User('driverId') driverId: string
  ) {
    // console.log('driverId', driverId);
    return await this.fileProxyService.getFileById(id);
  }
}
