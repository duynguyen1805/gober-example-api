import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDriverDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6I' })
  @IsNotEmpty({ message: 'Email or phone number is required' })
  refreshToken: string;
}
