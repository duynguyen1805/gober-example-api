// dto/get-file-by-id.param.ts
import { Type } from 'class-transformer';
import { IsNotEmpty, IsInt, IsMongoId } from 'class-validator';

export class GetFileByIdParamDto {
  @IsNotEmpty({ message: 'validation.file.id.isNotEmpty' })
  @IsMongoId({ message: 'validation.file.id.isMongoId' })
  id: string;
}
