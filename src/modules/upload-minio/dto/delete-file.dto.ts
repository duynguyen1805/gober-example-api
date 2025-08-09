import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DeleteFileDto {
  @ApiProperty({
    description: 'Filename to delete',
    example: 'avatar-123.jpg'
  })
  @IsString()
  filename: string;
}
