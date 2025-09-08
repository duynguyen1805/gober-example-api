// dto/get-driver-request-by-id.param.ts
import { Type } from 'class-transformer';
import { IsNotEmpty, IsInt, IsMongoId } from 'class-validator';

export class GetDriverRequestByIdParamDto {
  @IsNotEmpty({ message: 'validation.driver-request.id.isNotEmpty' })
  @IsMongoId({ message: 'validation.driver-request.id.isMongoId' })
  driverRequestId: string;
}
