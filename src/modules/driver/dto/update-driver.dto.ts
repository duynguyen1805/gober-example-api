import { PartialType } from '@nestjs/swagger';
import { CreateDriverDto } from './create-driver.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { EDriverStatus } from '../../../common/enums/driver/driver.enum';

export class UpdateDriverDto extends PartialType(CreateDriverDto) {
  @ApiPropertyOptional({ enum: EDriverStatus, description: 'Driver status' })
  @IsOptional()
  @IsEnum(EDriverStatus)
  status?: EDriverStatus;

  @ApiPropertyOptional({ description: 'Approved note', example: 'Documents verified' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  approvedNote?: string;
}