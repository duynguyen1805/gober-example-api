import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryFileDto {
  @ApiPropertyOptional({
    description: 'Từ khoá để tìm kiếm, theo filename',
    example: 'meo_bay_lac'
  })
  @IsOptional()
  keyword?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo thuộc tính MIME type',
    example: 'image/png'
  })
  @IsOptional()
  mimeType?: string;

  @ApiPropertyOptional({
    description: 'Phân trang, thứ tự trang',
    example: 1,
    default: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'validation.page.isInt'
  })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Số lượng item trong 1 trang',
    example: 20,
    default: 20
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'validation.pageSize.isInt'
  })
  pageSize?: number = 20;
}
