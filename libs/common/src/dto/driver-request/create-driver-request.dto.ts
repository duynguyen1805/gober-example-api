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
    example: '689a915c4ce57ddcc6800c3d'
  })
  @IsNotEmpty()
  typeId?: string;

  @ApiPropertyOptional({
    description: 'fileId sau khi upload file lên Minio',
    example: ['689a8a9655f410d124d91483']
  })
  @IsOptional()
  fileIds?: [string];
}
