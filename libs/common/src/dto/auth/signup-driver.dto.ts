import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';

export class SignUpDriverDto {
  @ApiProperty({ example: 'driver01@gmail.com', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'validation.driver.email.invalid' })
  email: string;

  @ApiProperty({ example: 'driver01', required: true })
  @IsNotEmpty({ message: 'validation.driver.password.isNotEmpty' })
  @MinLength(6, { message: 'validation.driver.password.minLength' })
  password: string;

  @ApiProperty({ example: 'Người dùng 01', required: true })
  @IsNotEmpty({ message: 'validation.driver.fullName.isNotEmpty' })
  @MinLength(2, { message: 'validation.driver.fullName.minLength' })
  @MaxLength(255, { message: 'validation.driver.fullName.maxLength' })
  fullName: string;

  @ApiProperty({ example: '0900000001', required: true })
  @IsNotEmpty({ message: 'validation.driver.phoneNumber.isNotEmpty' })
  @Matches(/^(0[3|5|7|8|9])[0-9]{8}$/, {
    message: 'validation.driver.phoneNumber.invalid'
  })
  phoneNumber: string;

  @ApiProperty({
    example: '689a8a9655f410d124d91483',
    required: false,
    description:
      'nhập fileId nhận từ API upload hình ảnh lên MinIO và tạo record file trong Database'
  })
  @IsOptional()
  @IsMongoId({ message: 'validation.driver.avatarFileId.isMongoId' })
  avatarFileId: string;

  @ApiProperty({
    example: '689a8a9655f410d124d91412',
    required: false,
    description: 'provinceId nhận từ API lấy danh sách khu vực hoạt động'
  })
  @IsOptional()
  @IsMongoId({ message: 'validation.driver.activeAreaId.isMongoId' })
  activeAreaId: string;

  @ApiProperty({
    example: 'Phong Dien, Can Tho',
    required: false,
    description: 'Địa chỉ tạm trú'
  })
  @IsOptional()
  @MaxLength(255, { message: 'validation.driver.temporaryAddress.maxLength' })
  temporaryAddress: string;

  @ApiProperty({
    example: '689a8a9655f410d124d91483',
    required: false,
    description:
      'nhập fileId nhận từ API upload hình ảnh lên MinIO và tạo record file trong Database'
  })
  @IsOptional()
  @IsMongoId({ message: 'validation.driver.identityCardFrontId.isMongoId' })
  identityCardFrontId: string;

  @ApiProperty({
    example: '689a8a9655f410d124d91483',
    required: false,
    description:
      'nhập fileId nhận từ API upload hình ảnh lên MinIO và tạo record file trong Database'
  })
  @IsOptional()
  @IsMongoId({ message: 'validation.driver.identityCardBackId.isMongoId' })
  identityCardBackId: string;

  @ApiProperty({
    example: '123456',
    required: false,
    description: 'Mã pin'
  })
  @IsOptional()
  @Matches(/^[0-9]{6}$/, { message: 'validation.driver.pin.invalid' })
  pin: string;
}
