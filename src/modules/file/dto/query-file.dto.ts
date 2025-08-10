import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  Min,
  Max
} from 'class-validator';

export class QueryFileDto {
  @ApiPropertyOptional({
    description: 'Từ khoá để tìm kiếm, theo filename',
    example: 'meo_bay_lac'
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo thuộc tính MIME type',
    example: 'image/png'
  })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo id của driver',
    example: 1
  })
  @IsOptional()
  @IsNumber()
  uploadedById?: number;

  @ApiPropertyOptional({
    description: 'Phân trang, thứ tự trang',
    example: 1,
    default: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Số lượng item trong 1 trang',
    example: 20,
    default: 20
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;
}
