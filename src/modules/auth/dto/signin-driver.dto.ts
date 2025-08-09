import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateIf } from 'class-validator';

export class SignInDriverDto {
  @ApiProperty({ example: 'abc@gmail.com or 0907123456' })
  @IsNotEmpty({ message: 'Email or phone number is required' })
  identifier: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
