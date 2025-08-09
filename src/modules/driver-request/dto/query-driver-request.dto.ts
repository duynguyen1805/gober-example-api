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
import { ERequestStatus } from '../../../common/enums';

export class QueryDriverRequestDto {
  @ApiPropertyOptional({
    description: 'Keyword to search by description/reason',
    example: 'Yeu cau'
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    enum: ERequestStatus,
    description: 'Filter by status'
  })
  @IsOptional()
  @IsEnum(ERequestStatus)
  status?: ERequestStatus;

  @ApiPropertyOptional({ description: 'Filter by request type id', example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  typeId?: number;

  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1,
    default: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Page size', example: 20, default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;
}
