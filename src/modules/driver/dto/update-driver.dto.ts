import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateDriverDto {
  @ApiPropertyOptional({
    description: 'Họ tên',
    example: 'Người dùng 01 sau cập nhật'
  })
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Số điện thoại',
    example: '0900000022'
  })
  @IsOptional()
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'Email của driver - Không bắt buộc',
    example: 'driver01update@example.com'
  })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description:
      'nhập fileId nhận từ API upload hình ảnh lên MinIO và tạo record file trong Database',
    example: '101'
  })
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'provinceId nhận từ API lấy danh sách khu vực hoạt động',
    example: '1'
  })
  @IsOptional()
  activeAreaId?: string;

  @ApiPropertyOptional({
    description: 'Địa chỉ tạm trú',
    example: 'hẻm 12/34, Quận 3, HCMC'
  })
  @IsOptional()
  temporaryAddress?: string;
}
