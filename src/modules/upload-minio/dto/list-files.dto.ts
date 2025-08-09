import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListFilesDto {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    minimum: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Filter by filename',
    example: 'avatar'
  })
  @IsOptional()
  @IsString()
  filename?: string;

  @ApiPropertyOptional({
    description: 'Filter by file extension',
    example: 'jpg'
  })
  @IsOptional()
  @IsString()
  fileExtension?: string;
}
