import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SignUpDriverDto {
  @ApiProperty({ example: 'driver01@gmail.com', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Địa chỉ email không hợp lệ' })
  email: string;

  @ApiProperty({ example: 'driver01', required: true })
  @IsNotEmpty({ message: 'Mật khẩu là bắt buộc' })
  password: string;

  @ApiProperty({ example: 'Người dùng 01', required: true })
  @IsNotEmpty({ message: 'Họ tên là bắt buộc' })
  fullName: string;

  @ApiProperty({ example: '0900000001', required: true })
  @IsNotEmpty({ message: 'Số điện thoại là bắt buộc' })
  phoneNumber: string;

  @ApiProperty({
    example: '689a8a9655f410d124d91483',
    required: false,
    description:
      'nhập fileId nhận từ API upload hình ảnh lên MinIO và tạo record file trong Database'
  })
  @IsOptional()
  avatarFileId: string;

  @ApiProperty({
    example: '689a8a9655f410d124d91412',
    required: false,
    description: 'provinceId nhận từ API lấy danh sách khu vực hoạt động'
  })
  @IsOptional()
  activeAreaId: string;

  @ApiProperty({
    example: 'Phong Dien, Can Tho',
    required: false,
    description: 'Địa chỉ tạm trú'
  })
  @IsOptional()
  temporaryAddress: string;

  @ApiProperty({
    example: '689a8a9655f410d124d91483',
    required: false,
    description:
      'nhập fileId nhận từ API upload hình ảnh lên MinIO và tạo record file trong Database'
  })
  @IsOptional()
  identityCardFrontId: string;

  @ApiProperty({
    example: '689a8a9655f410d124d91483',
    required: false,
    description:
      'nhập fileId nhận từ API upload hình ảnh lên MinIO và tạo record file trong Database'
  })
  @IsOptional()
  identityCardBackId: string;

  @ApiProperty({
    example: '123456',
    required: false,
    description: 'Mã pin'
  })
  @IsOptional()
  pin: string;
}
