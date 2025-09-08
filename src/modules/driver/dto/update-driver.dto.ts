import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsOptional,
  Length,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';

export class UpdateDriverDto {
  @ApiPropertyOptional({
    description: 'Họ tên',
    example: 'Người dùng 01 sau cập nhật'
  })
  @IsOptional()
  @MinLength(2, { message: 'validation.driver.fullName.minLength' })
  @MaxLength(255, { message: 'validation.driver.fullName.maxLength' })
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Số điện thoại',
    example: '0900000022'
  })
  @IsOptional()
  @Matches(/^(0[3|5|7|8|9])[0-9]{8}$/, {
    message: 'validation.driver.phoneNumber.invalid'
  })
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'Email của driver - Không bắt buộc',
    example: 'driver01update@example.com'
  })
  @IsOptional()
  @IsEmail({ message: 'validation.driver.email.invalid' })
  email?: string;

  @ApiPropertyOptional({
    description:
      'nhập fileId nhận từ API upload hình ảnh lên MinIO và tạo record file trong Database',
    example: '689a8a9655f410d124d91483'
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'validation.driver.avatarFileId.isInt' })
  avatarFileId?: number;

  @ApiPropertyOptional({
    description: 'provinceId nhận từ API lấy danh sách khu vực hoạt động',
    example: '689a8a9655f410d124d91412'
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'validation.driver.activeAreaId.isInt' })
  activeAreaId?: number;

  @ApiPropertyOptional({
    description: 'Địa chỉ tạm trú',
    example: 'hẻm 12/34, Quận 3, HCMC'
  })
  @IsOptional()
  @MaxLength(255, { message: 'validation.driver.temporaryAddress.maxLength' })
  temporaryAddress?: string;
}
