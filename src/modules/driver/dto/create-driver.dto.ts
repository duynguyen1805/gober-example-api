import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDriverDto {
  @ApiPropertyOptional({
    description: 'Họ tên',
    example: 'Người dùng 02'
  })
  @IsOptional()
  fullName?: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0900000002'
  })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'Email của driver - Không bắt buộc',
    example: 'driver02@example.com'
  })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Mật khẩu',
    example: '123123'
  })
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    description: 'FCM/APNS device token',
    example: 'fcm_device_token_123'
  })
  @IsOptional()
  deviceToken?: string;

  @ApiPropertyOptional({
    description: 'fileId sau khi upload avatar',
    example: 101
  })
  @IsOptional()
  avatar?: string | number;

  @ApiPropertyOptional({
    description: 'provinceId được cho phép',
    example: 1
  })
  @IsOptional()
  activeAreaId?: number;

  @ApiPropertyOptional({
    description: 'Temporary address',
    example: 'hẻm 12/34, Quận 3, HCMC'
  })
  @IsOptional()
  temporaryAddress?: string;
}
