import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiBearerAuth
} from '@nestjs/swagger';
import { UploadMinioService } from './upload-minio.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';
import {
  SingleUploadInterceptor,
  MultiUploadInterceptor
} from '../../common/interceptors/upload.interceptor';
import {
  IUploadedFileInfoOutput,
  IUploadResult
} from './interfaces/upload.interface';

@ApiTags('upload-minio')
@Controller('upload-minio')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadMinioController {
  constructor(private readonly uploadService: UploadMinioService) {}

  @Post('single')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Upload single file to MinIO',
    description:
      'Upload a single file to MinIO storage and return file information'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload (images only)'
        }
      },
      required: ['file']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        originalName: { type: 'string', example: 'avatar.jpg' },
        filename: { type: 'string', example: '1234567890_abc123.jpg' },
        url: {
          type: 'string',
          example: 'https://storage.example.com/bucket/1234567890_abc123.jpg'
        },
        size: { type: 'number', example: 1024000 },
        mimeType: { type: 'string', example: 'image/jpeg' },
        fileExtension: { type: 'string', example: 'jpg' },
        uploadedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Bad request - validation failed',
    schema: {
      type: 'object',
      properties: {
        messageCode: { type: 'string', example: 'UPLOAD_FAILED' },
        message: { type: 'string', example: 'File upload failed' },
        statusCode: { type: 'number', example: 400 },
        timestamp: { type: 'string', format: 'date-time' },
        success: { type: 'boolean', example: false },
        path: { type: 'string', example: '/upload-minio/single' },
        method: { type: 'string', example: 'POST' },
        errorName: { type: 'string', example: 'ServerError' }
      }
    }
  })
  @UseInterceptors(SingleUploadInterceptor)
  async singleUpload(
    @UploadedFile() file
    // @User('driverId') driverId: number
  ): Promise<IUploadedFileInfoOutput> {
    return this.uploadService.singleUploadMinio(file);
  }

  @Post('multi')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Upload multiple files to MinIO',
    description:
      'Upload multiple files to MinIO storage and return files information'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary'
          },
          description: 'Multiple files to upload (max 100 files, images only)'
        }
      },
      required: ['files']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Files uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        files: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              originalName: { type: 'string', example: 'document.jpg' },
              filename: { type: 'string', example: '1234567890_document.jpg' },
              url: {
                type: 'string',
                example:
                  'https://storage.example.com/bucket/1234567890_document.jpg'
              },
              size: { type: 'number', example: 2048000 },
              mimeType: { type: 'string', example: 'image/jpeg' },
              fileExtension: { type: 'string', example: 'jpg' },
              uploadedAt: { type: 'string', format: 'date-time' },
              uploadedById: { type: 'number', example: 1 }
            }
          }
        },
        totalFiles: { type: 'number', example: 5 },
        totalSize: { type: 'number', example: 10240000 }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Bad request - validation failed',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'File type not allowed' },
        error: { type: 'string', example: 'File type video is not allowed' }
      }
    }
  })
  @UseInterceptors(MultiUploadInterceptor)
  async multiUpload(
    @UploadedFiles() files: Express.Multer.File[]
    // @User('driverId') driverId: number
  ): Promise<IUploadResult> {
    return this.uploadService.multiUploadMinio(files);
  }
}
