// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import {
//   IsEmail,
//   IsMongoId,
//   IsNotEmpty,
//   IsOptional,
//   Matches,
//   MaxLength,
//   MinLength
// } from 'class-validator';

// export class CreateDriverDto {
//   @ApiPropertyOptional({
//     description: 'Họ tên',
//     example: 'Người dùng 02'
//   })
//   @IsOptional()
//   @MinLength(2, { message: 'validation.driver.fullName.minLength' })
//   @MaxLength(255, { message: 'validation.driver.fullName.maxLength' })
//   fullName?: string;

//   @ApiProperty({
//     description: 'Số điện thoại',
//     example: '0900000002'
//   })
//   @IsNotEmpty({ message: 'validation.driver.phoneNumber.isNotEmpty' })
//   @Matches(/^(0[3|5|7|8|9])[0-9]{8}$/, {
//     message: 'validation.driver.phoneNumber.invalid'
//   })
//   phoneNumber: string;

//   @ApiPropertyOptional({
//     description: 'Email của driver - Không bắt buộc',
//     example: 'driver02@example.com'
//   })
//   @IsOptional()
//   @IsEmail({ message: 'validation.driver.email.invalid' })
//   email?: string;

//   @ApiPropertyOptional({
//     description: 'Mật khẩu',
//     example: '123123'
//   })
//   @IsNotEmpty({ message: 'validation.driver.password.isNotEmpty' })
//   @MinLength(6, { message: 'validation.driver.password.minLength' })
//   password?: string;

//   @ApiPropertyOptional({
//     description: 'FCM/APNS device token',
//     example: 'fcm_device_token_123'
//   })
//   @IsOptional()
//   deviceToken?: string;

//   @ApiPropertyOptional({
//     description: 'fileId sau khi upload avatar',
//     example: 101
//   })
//   @IsOptional()
//   @IsMongoId({ message: 'validation.driver.avatarFileId.isMongoId' })
//   avatarFileId?: string | number;

//   @ApiPropertyOptional({
//     description: 'provinceId được cho phép',
//     example: '689a8a9655f410d124d91412'
//   })
//   @IsOptional()
//   @IsMongoId({ message: 'validation.driver.activeAreaId.isMongoId' })
//   activeAreaId?: string;

//   @ApiPropertyOptional({
//     description: 'Temporary address',
//     example: 'hẻm 12/34, Quận 3, HCMC'
//   })
//   @IsOptional()
//   @MaxLength(255, { message: 'validation.driver.temporaryAddress.maxLength' })
//   temporaryAddress?: string;
// }
