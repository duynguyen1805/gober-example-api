import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsInt, Min, Max } from 'class-validator';

export class QueryFileDto {
  @ApiPropertyOptional({ 
    description: 'Keyword to search by filename',
    example: 'document'
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by MIME type',
    example: 'application/png'
  })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by uploaded by driver ID',
    example: 1
  })
  @IsOptional()
  @IsNumber()
  uploadedById?: number;

  @ApiPropertyOptional({ 
    description: 'Page number (1-based)',
    example: 1,
    default: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ 
    description: 'Page size',
    example: 20,
    default: 20
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;
} 