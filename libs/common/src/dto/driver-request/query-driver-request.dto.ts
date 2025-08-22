import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min
} from 'class-validator';
import { ERequestStatus } from '@app/common/enums';
import { Type } from 'class-transformer';

export class QueryDriverRequestDto {
  @ApiPropertyOptional({
    description: 'Keyword to search by description/reason',
    example: 'Yeu cau'
  })
  @IsOptional()
  keyword?: string;

  @ApiPropertyOptional({
    enum: ERequestStatus,
    description: 'Filter by status'
  })
  @IsOptional()
  @IsEnum(ERequestStatus)
  status?: ERequestStatus;

  @ApiPropertyOptional({
    description: 'Filter by request type id',
    example: '689a915c4ce57ddcc6800c3d'
  })
  @IsOptional()
  typeId?: string;

  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1,
    default: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'validation.page.isInt' })
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Page size', example: 20, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'validation.pageSize.isInt' })
  pageSize?: number = 20;
}
