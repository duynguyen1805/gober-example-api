import {
  Post,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Patch
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
import { User } from '../../common/decorators/user.decorator';
// entity
import { FileEntity } from '../../database/entities/file.entity';
// dto
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { QueryFileDto } from './dto/query-file.dto';
// interface
import { IFileOutput } from './interfaces/file.interface';
// service
import { FileService } from './file.service';

@ApiTags('files')
@Controller('files')
@ApiBearerAuth()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo record vào bảng File',
    description: 'Tạo record vào bảng File'
  })
  @ApiBody({ type: CreateFileDto })
  @ApiCreatedResponse({
    description: 'Tạo record file thành công',
    type: FileEntity,
    schema: {
      properties: {
        success: {
          type: 'boolean',
          example: true
        },
        data: {
          type: 'object',
          example: {
            filename: 'meo_bay_lac.png',
            url: '/gober/meo_bay_lac.png',
            mimeType: 'image/png',
            fileExtension: 'png',
            size: 455431,
            deletedAt: null,
            uploadedById: null,
            isActive: true,
            createdAt: '2025-08-09T04:56:24.998Z',
            updatedAt: '2025-08-09T04:56:24.998Z',
            fileId: 6
          }
        }
      }
    }
  })
  async create(
    @Body() body: CreateFileDto,
    @User('driverId') driverId: number
  ): Promise<IFileOutput> {
    return this.fileService.create(driverId, body);
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
            fileId: 1,
            filename: 'meo_bay_lac.png',
            path: '/gober/meo_bay_lac.png',
            url: 'https://localhost:9000/gober/meo_bay_lac.png',
            mimeType: 'image/png',
            fileExtension: 'png',
            size: 1024000,
            uploadedById: 1
          }
        ],
        total: 1,
        page: 1,
        pageSize: 20
      }
    }
  })
  async list(@Query() query: QueryFileDto, @User('driverId') driverId: number) {
    return this.fileService.getListFiles(driverId, query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin 1 file cụ thể',
    description: 'Lấy thông tin file bằng fileId'
  })
  @ApiResponse({
    description: 'Lấy thông tin file thành công',
    type: FileEntity,
    schema: {
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
            fileId: 1,
            filename: 'meo_bay_lac.png',
            path: '/gober/meo_bay_lac.png',
            url: 'https://localhost:9000/gober/meo_bay_lac.png',
            mimeType: 'image/png',
            fileExtension: 'png',
            size: 204800,
            uploadedById: 1
          }
        }
      }
    }
  })
  @ApiParam({ name: 'id', required: true, example: 1 })
  async getById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<IFileOutput | null> {
    return this.fileService.findFileById(id);
  }

  // @Patch(':id')
  // @ApiOperation({
  //   summary: 'Update file',
  //   description: 'Update a file by fileId.'
  // })
  // @ApiParam({ name: 'id', required: true, example: 1 })
  // @ApiBody({ type: UpdateFileDto })
  // async update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() body: UpdateFileDto
  // ): Promise<FileEntity> {
  //   return this.fileService.updateFile(id, body);
  // }

  // @Delete(':id')
  // @ApiOperation({
  //   summary: 'Delete file',
  //   description: 'Delete a file by fileId.'
  // })
  // @ApiParam({ name: 'id', required: true, example: 1 })
  // async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
  //   return this.fileService.removeFile(id);
  // }
}
