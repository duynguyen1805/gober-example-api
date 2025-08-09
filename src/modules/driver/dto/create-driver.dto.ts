import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength
} from 'class-validator';

export class CreateDriverDto {
  @ApiPropertyOptional({
    description: 'Họ tên',
    example: 'Nguyen Van A'
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullName?: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0907123456'
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'Email của driver - Không bắt buộc',
    example: 'driver01@example.com'
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Mật khẩu',
    example: '123123'
  })
  @IsOptional()
  @IsString()
  @Length(6, 100)
  password?: string;

  @ApiPropertyOptional({
    description: 'FCM/APNS device token',
    example: 'fcm_device_token_123'
  })
  @IsOptional()
  @IsString()
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
  @IsString()
  @MaxLength(500)
  temporaryAddress?: string;
}
