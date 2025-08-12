import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateIf } from 'class-validator';

export class SignInDriverDto {
  @ApiProperty({ example: '0900000001' })
  @IsNotEmpty({ message: 'Yêu cầu nhập email hoặc số điện thoại' })
  identifier: string;

  @ApiProperty({ example: 'driver01' })
  @IsNotEmpty({ message: 'Yêu cầu nhập mật khẩu' })
  password: string;
}
