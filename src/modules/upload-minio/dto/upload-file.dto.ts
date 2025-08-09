import { IsOptional, IsString, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiPropertyOptional({
    description: 'Filename for the uploaded file',
    example: 'avatar.jpg'
  })
  @IsOptional()
  @IsString()
  filename?: string;

  @ApiPropertyOptional({
    description: 'MIME type of the file',
    example: 'image/jpeg'
  })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiPropertyOptional({
    description: 'File extension',
    example: 'jpg'
  })
  @IsOptional()
  @IsString()
  fileExtension?: string;

  @ApiPropertyOptional({
    description: 'File size in bytes',
    example: 1024000
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  size?: number;

  @ApiPropertyOptional({
    description: 'ID of the user who uploaded the file',
    example: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  uploadedById?: number;
}
