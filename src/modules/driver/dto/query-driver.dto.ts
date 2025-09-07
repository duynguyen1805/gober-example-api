import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsMongoId, IsOptional } from 'class-validator';
import { EDriverStatus } from '../enums/driver.enum';
import { Type } from 'class-transformer';

export class QueryDriverDto {
  @ApiPropertyOptional({
    description:
      'Từ khoá tìm kiếm, áp dụng cho các trường phoneNumber/email/fullname',
    example: 'Nguyen'
  })
  @IsOptional()
  keyword?: string;

  @ApiPropertyOptional({
    enum: EDriverStatus,
    description: 'Lọc theo trạng thái driver'
  })
  @IsOptional()
  @IsEnum(EDriverStatus, {
    message: 'validation.driver.status.invalid'
  })
  status?: EDriverStatus;

  @ApiPropertyOptional({
    description: 'Lọc theo id của khu vực hoạt động',
    example: '689a915c4ce57ddcc6800c3d'
  })
  @IsOptional()
  @IsMongoId({ message: 'validation.driver.activeAreaId.isMongoId' })
  activeAreaId?: string;

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
