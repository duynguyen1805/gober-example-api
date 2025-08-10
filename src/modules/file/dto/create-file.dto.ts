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
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  filename: string;

  @ApiProperty({
    description: 'Đường dẫn truy cập file đã tải lên',
    example: '/gober/meo_bay_lac.png'
  })
  @IsNotEmpty()
  // @IsUrl()
  path: string;

  @ApiPropertyOptional({
    description: 'MIME type của file',
    example: 'image/png'
  })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiProperty({
    description: 'File extension',
    example: 'png'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  fileExtension: string;

  @ApiPropertyOptional({
    description: 'Kích thước file',
    example: 1024000
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  size?: number;
}
