import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SignUpDriverDto {
  @ApiProperty({ example: 'driver01@gmail.com', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @ApiProperty({ example: 'driver01', required: true })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'Nguyen Van A', required: true })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '0907123456', required: true })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'fileId reviced from API upload'
  })
  @IsOptional()
  avatar: number;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Value of provinceId'
  })
  @IsOptional()
  activeAreaId: number;

  @ApiProperty({
    example: 'Phong Dien, Can Tho',
    required: false,
    description: ''
  })
  @IsOptional()
  temporaryAddress: string;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'fileId reviced from API upload'
  })
  @IsOptional()
  identityCardFrontId: number;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'fileId reviced from API upload'
  })
  @IsOptional()
  identityCardBackId: number;

  @ApiProperty({
    example: '123456',
    required: false,
    description: ''
  })
  @IsOptional()
  pin: string;
}
