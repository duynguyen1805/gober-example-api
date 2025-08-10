import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator';

export class CreateDriverRequestDto {
  @ApiPropertyOptional({
    description: 'Code',
    example: '123123'
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiPropertyOptional({
    description: 'Mô tả',
    example: 'Nội dung muốn yêu cầu'
  })
  @IsNotEmpty()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'requestTypeId lấy từ bảng request_type',
    example: 3
  })
  @IsNotEmpty()
  @IsNumber()
  typeId?: number;

  @ApiPropertyOptional({
    description: 'fileId sau khi upload file lên Minio',
    example: 1
  })
  @IsOptional()
  fileIds?: [number];
}
