import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsUrl, MaxLength, Min, Max } from 'class-validator';

export class CreateFileDto {
  @ApiProperty({ 
    description: 'Original filename of the uploaded file',
    example: 'document.png'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  filename: string;

  @ApiProperty({ 
    description: 'URL where the file is stored',
    example: 'https://domain/files/document.png'
  })
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiPropertyOptional({ 
    description: 'MIME type of the file',
    example: 'application/png'
  })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiProperty({ 
    description: 'File extension without dot',
    example: 'png'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  fileExtension: string;

  @ApiPropertyOptional({ 
    description: 'File size in bytes',
    example: 1024000
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  size?: number;

  @ApiPropertyOptional({ 
    description: 'ID of the driver who uploaded the file',
    example: 1
  })
  @IsOptional()
  @IsNumber()
  uploadedById?: number;
}
