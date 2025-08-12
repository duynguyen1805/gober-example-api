import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateDriverRequestDto } from './create-driver-request.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateDriverRequestDto extends CreateDriverRequestDto {}
