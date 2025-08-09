import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateIf } from 'class-validator';

export class SignInDriverDto {
  @ApiProperty({ example: '0901234567' })
  @IsNotEmpty({ message: 'Email or phone number is required' })
  identifier: string;

  @ApiProperty({ example: 'adminadmin' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
