import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import { Driver } from './driver.schema';

@Schema({ collection: 'driver_refresh_tokens' })
export class DriverRefreshToken extends BaseSchema {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ required: true })
  deviceToken: string;

  @Prop({ default: false })
  isRevoked: boolean;

  @Prop({ type: String, ref: Driver.name, required: true })
  driverId: string;
}

// type cho Document
export type DriverRefreshTokenDocument = DriverRefreshToken & Document;
export interface DriverRefreshTokenDocumentWithCustomId
  extends DriverRefreshTokenDocument {
  driverRefreshTokenId: string;
}
export const DriverRefreshTokenSchema =
  SchemaFactory.createForClass(DriverRefreshToken);

// ảo hoá cho driverRefreshTokenId
DriverRefreshTokenSchema.virtual('driverRefreshTokenId').get(function (
  this: DriverRefreshToken
) {
  return this._id.toString();
});
