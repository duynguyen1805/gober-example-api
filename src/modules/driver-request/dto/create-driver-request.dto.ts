import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
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
  @IsNotEmpty({ message: 'validation.driver-request.code.isNotEmpty' })
  @IsString({ message: 'validation.driver-request.code.isString' })
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
    example: 1
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt({ message: 'validation.driver-request.typeId.isInt' })
  typeId?: number;

  @ApiPropertyOptional({
    description: 'fileId sau khi upload file lên Minio',
    example: ['1']
  })
  @IsOptional()
  fileIds?: [string];
}
