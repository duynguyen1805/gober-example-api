import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateDriverDto {
  @ApiPropertyOptional({
    description: 'Họ tên',
    example: 'Nguyen Van A'
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Số điện thoại',
    example: '0907123456'
  })
  @IsOptional()
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
