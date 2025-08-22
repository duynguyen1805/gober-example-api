import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsUrl,
  MaxLength,
  Min,
  Max
} from 'class-validator';

export class CreateFileDto {
  @ApiProperty({
    description: 'fileName nhận từ API upload hình ảnh lên MinIO',
    example: 'image.png'
  })
  @IsNotEmpty({ message: 'validation.file.filename.isNotEmpty' })
  @IsString({ message: 'validation.file.filename.isString' })
  @MaxLength(255, { message: 'validation.file.filename.maxLength' })
  filename: string;

  @ApiProperty({
    description: 'Đường dẫn truy cập file đã tải lên',
    example: '/gober/meo_bay_lac.png'
  })
  @IsNotEmpty({ message: 'validation.file.path.isNotEmpty' })
  @IsString({ message: 'validation.file.path.isString' })
  @IsUrl({ message: 'validation.file.path.isUrl' })
  path: string;

  @ApiPropertyOptional({
    description: 'MIME type của file',
    example: 'image/png'
  })
  @IsOptional()
  @IsString({ message: 'validation.file.mimeType.isString' })
  mimeType?: string;

  @ApiProperty({
    description: 'File extension',
    example: 'png'
  })
  @IsNotEmpty({ message: 'validation.file.fileExtension.isNotEmpty' })
  @IsString({ message: 'validation.file.fileExtension.isString' })
  @MaxLength(10, { message: 'validation.file.fileExtension.maxLength' })
  fileExtension: string;

  @ApiPropertyOptional({
    description: 'Kích thước file',
    example: 1024000
  })
  @IsOptional()
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'validation.file.size.isInt' }
  )
  @Min(0)
  size?: number;
}
