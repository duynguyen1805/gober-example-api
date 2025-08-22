import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MinLength, ValidateIf } from 'class-validator';

export class SignInDriverDto {
  @ApiProperty({ example: '0900000001' })
  @IsNotEmpty({ message: 'validation.driver.phoneNumber.isNotEmpty' })
  @Matches(/^(0[3|5|7|8|9])[0-9]{8}$/, {
    message: 'validation.driver.phoneNumber.invalid'
  })
  identifier: string;

  @ApiProperty({ example: 'driver01' })
  @IsNotEmpty({ message: 'validation.driver.password.isNotEmpty' })
  @MinLength(6, { message: 'validation.driver.password.minLength' })
  password: string;
}
