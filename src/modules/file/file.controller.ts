import {
  Post,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
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
  ApiBody
} from '@nestjs/swagger';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { QueryFileDto } from './dto/query-file.dto';
import { FileEntity } from '../../database/entities/file.entity';

@ApiTags('files')
@Controller('files')
@ApiBearerAuth()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new file record',
    description:
      'Creates a file record with metadata and returns the created entity.'
  })
  @ApiBody({ type: CreateFileDto, description: 'File metadata to create' })
  @ApiCreatedResponse({
    description: 'File created successfully',
    type: FileEntity,
    schema: {
      example: {
        fileId: 1,
        filename: 'document.pdf',
        url: 'https://storage.example.com/files/document.pdf',
        mimeType: 'application/pdf',
        fileExtension: 'pdf',
        size: 1024000,
        uploadedById: 1,
        isActive: true,
        createdAt: '2025-08-08T00:00:00.000Z',
        updatedAt: '2025-08-08T00:00:00.000Z'
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Validation error' })
  async create(@Body() body: CreateFileDto): Promise<FileEntity> {
    return this.fileService.create(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List files',
    description: 'List files with pagination and filters.'
  })
  @ApiOkResponse({
    description: 'Paged files',
    schema: {
      example: {
        items: [
          {
            fileId: 1,
            filename: 'document.pdf',
            url: 'https://storage.example.com/files/document.pdf',
            mimeType: 'application/pdf',
            fileExtension: 'pdf',
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
  async list(@Query() query: QueryFileDto) {
    return this.fileService.getListFiles(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get file by id',
    description: 'Fetch a file by fileId.'
  })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiOkResponse({ description: 'File found', type: FileEntity })
  async getById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<FileEntity | null> {
    return this.fileService.findFileById(id);
  }

  @Get(':id/with-uploader')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get file by id with uploader info',
    description: 'Fetch a file by fileId including uploader information.'
  })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiOkResponse({ description: 'File with uploader info', type: FileEntity })
  async getByIdWithUploader(
    @Param('id', ParseIntPipe) id: number
  ): Promise<FileEntity | null> {
    return this.fileService.findFileByIdWithUploader(id);
  }

  @Get('driver/:driverId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get files by driver',
    description: 'Get all files uploaded by a specific driver.'
  })
  @ApiParam({ name: 'driverId', required: true, example: 1 })
  @ApiOkResponse({
    description: 'Files uploaded by driver',
    type: [FileEntity]
  })
  async getFilesByDriver(
    @Param('driverId', ParseIntPipe) driverId: number
  ): Promise<FileEntity[]> {
    return this.fileService.getFilesByDriver(driverId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update file',
    description: 'Update a file by fileId.'
  })
  @ApiParam({ name: 'id', required: true, example: 1 })
  @ApiBody({ type: UpdateFileDto })
  @ApiOkResponse({ description: 'File updated', type: FileEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateFileDto
  ): Promise<FileEntity> {
    return this.fileService.updateFile(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete file',
    description: 'Delete a file by fileId.'
  })
  @ApiParam({ name: 'id', required: true, example: 1 })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.fileService.removeFile(id);
  }
}
