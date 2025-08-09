import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';

export class CreateDriverDto {
  @ApiPropertyOptional({ description: 'Driver full name', example: 'Nguyen Van A' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullName?: string;

  @ApiProperty({ description: 'Unique phone number of the driver', example: '+84901234567' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+?\d{8,15}$/)
  phoneNumber!: string;

  @ApiPropertyOptional({ description: 'Email of the driver', example: 'driver@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Hashed password or raw to be hashed at domain layer', example: 'P@ssw0rd!' })
  @IsOptional()
  @IsString()
  @Length(6, 100)
  password?: string;

  @ApiPropertyOptional({ description: 'FCM/APNS device token', example: 'fcm_device_token_123' })
  @IsOptional()
  @IsString()
  deviceToken?: string;

  @ApiPropertyOptional({ description: 'Avatar file id reference', example: 101 })
  @IsOptional()
  avatar?: string | number;

  @ApiPropertyOptional({ description: 'Province id where driver is active', example: 1 })
  @IsOptional()
  activeAreaId?: number;

  @ApiPropertyOptional({ description: 'Temporary address', example: '12/34 Street, Ward 5, District 3, HCMC' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  temporaryAddress?: string;
}