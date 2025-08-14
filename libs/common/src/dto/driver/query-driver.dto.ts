import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { EDriverStatus } from '@app/common/enums/driver.enum';
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
  @IsEnum(EDriverStatus)
  status?: EDriverStatus;

  @ApiPropertyOptional({
    description: 'Lọc theo id của khu vực hoạt động',
    example: 1
  })
  @IsOptional()
  activeAreaId?: number;

  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1,
    default: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Page size', example: 20, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageSize?: number = 20;
}
