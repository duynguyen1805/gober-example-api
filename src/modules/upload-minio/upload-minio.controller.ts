import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UseGuards
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
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
export class UploadMinioController {
  constructor(private readonly uploadService: UploadMinioService) {}

  @Post('single')
  @ApiOperation({
    summary: 'Upload single file lên MinIO',
    description:
      'Upload duy nhất 1 file lên MinIO storage, trả về đường dẫn và thông tin file.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Tạm thời chỉ áp dụng hình ảnh (img, jpec, png)'
        }
      },
      required: ['file']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Tải file thành công',
    schema: {
      type: 'object',
      properties: {
        originalName: { type: 'string', example: 'meo_bay_lac.png' },
        filename: { type: 'string', example: 'meo_bay_lac.png' },
        url: {
          type: 'string',
          example: 'https://localhost:9000/gober/meo_bay_lac.png'
        },
        path: { type: 'string', example: '/gober/meo_bay_lac.png' },
        size: { type: 'number', example: 455431 },
        mimeType: { type: 'string', example: 'image/png' },
        fileExtension: { type: 'string', example: 'png' },
        uploadedAt: { type: 'string', format: '2025-08-09T07:11:39.639Z' }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Bad request - File sai định dạng cho phép.',
    schema: {
      type: 'object',
      properties: {
        messageCode: { type: 'string', example: 'UPLOAD_FAILED' },
        message: { type: 'string', example: 'Tải tệp lên thất bại' },
        statusCode: { type: 'number', example: 400 },
        timestamp: { type: 'string', format: '2025-08-09T07:11:39.639Z' },
        success: { type: 'boolean', example: false },
        path: { type: 'string', example: '/upload-minio/single' },
        method: { type: 'string', example: 'POST' },
        errorName: { type: 'string', example: 'ServerError' }
      }
    }
  })
  @UseInterceptors(SingleUploadInterceptor)
  async singleUpload(
    @UploadedFile() file: Express.Multer.File
  ): Promise<IUploadedFileInfoOutput> {
    return this.uploadService.singleUploadMinio(file);
  }

  @Post('multi')
  @ApiOperation({
    summary: 'Upload multiple files lên MinIO',
    description:
      'Upload multiple files lên MinIO storage,, trả về mảng đường dẫn và thông tin file.'
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
          description: 'Multiple files to upload (tối đa 10 files, images only)'
        }
      },
      required: ['files']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Tải các file thành công.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        files: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              originalName: { type: 'string', example: 'meo_bay_lac.png' },
              filename: { type: 'string', example: 'meo_bay_lac.png' },
              url: {
                type: 'string',
                example: 'https://localhost:9000/gober/meo_bay_lac.png'
              },
              path: { type: 'string', example: '/gober/meo_bay_lac.png' },
              size: { type: 'number', example: 455431 },
              mimeType: { type: 'string', example: 'image/png' },
              fileExtension: { type: 'string', example: 'png' },
              uploadedAt: { type: 'string', format: '2025-08-09T07:11:39.639Z' }
            }
          }
        },
        totalFiles: { type: 'number', example: 1 },
        totalSize: { type: 'number', example: 455431 }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Bad request - File sai định dạng cho phép.',
    schema: {
      type: 'object',
      properties: {
        messageCode: { type: 'string', example: 'UPLOAD_FAILED' },
        message: { type: 'string', example: 'Tải tệp lên thất bại' },
        statusCode: { type: 'number', example: 400 },
        timestamp: { type: 'string', format: '2025-08-09T07:11:39.639Z' },
        success: { type: 'boolean', example: false },
        path: { type: 'string', example: '/upload-minio/multi' },
        method: { type: 'string', example: 'POST' },
        errorName: { type: 'string', example: 'ServerError' }
      }
    }
  })
  @UseInterceptors(MultiUploadInterceptor)
  async multiUpload(
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<IUploadResult> {
    return this.uploadService.multiUploadMinio(files);
  }
}
