import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateDriverRequestDto } from './create-driver-request.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateDriverRequestDto extends CreateDriverRequestDto {
  @ApiPropertyOptional({
    description: 'driverRequestId cần để cập nhật',
    example: 1
  })
  @IsNotEmpty()
  driverRequestId?: string;
}
