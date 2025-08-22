// dto/get-driver-by-id.param.ts
import { Type } from 'class-transformer';
import { IsNotEmpty, IsInt, IsMongoId } from 'class-validator';

export class GetDriverByIdParamDto {
  @IsNotEmpty({ message: 'validation.driver.id.isNotEmpty' })
  @IsMongoId({ message: 'validation.driver.id.isMongoId' })
  driverId: string;
}
