import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';
import { EDriverStatus } from '../../../common/enums/driver/driver.enum';

export class QueryDriverDto {
  @ApiPropertyOptional({ description: 'Keyword to search by phone/email/fullName', example: 'Nguyen' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ enum: EDriverStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(EDriverStatus)
  status?: EDriverStatus;

  @ApiPropertyOptional({ description: 'Filter by active area id', example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  activeAreaId?: number;

  @ApiPropertyOptional({ description: 'Page number (1-based)', example: 1, default: 1 })
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