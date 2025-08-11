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
    example: 'typeId1'
  })
  @IsNotEmpty()
  @IsNumber()
  typeId?: string;

  @ApiPropertyOptional({
    description: 'fileId sau khi upload file lên Minio',
    example: ['fileId1', 'fileId2']
  })
  @IsOptional()
  fileIds?: [string];
}
