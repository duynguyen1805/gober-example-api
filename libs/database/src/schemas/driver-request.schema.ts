import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import { Admin } from './admin.schema';
import { Driver } from './driver.schema';
import { RequestType } from './request-type.schema';
import { File } from './file.schema';

@Schema({ collection: 'driver_requests' })
export class DriverRequest extends BaseSchema {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: String, ref: RequestType.name })
  typeId: string;

  @Prop({
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  })
  status: string;

  @Prop({ type: String, ref: Admin.name, required: false })
  approvedById: string;

  @Prop({ required: false })
  approvedAt: Date;

  @Prop({ required: false })
  reason: string;

  @Prop({ type: String, ref: Driver.name, required: true })
  driverId: string;

  @Prop({ type: [String], ref: File.name })
  fileIds: string[];
}

// type cho Document
export type DriverRequestDocument = DriverRequest & Document;
export interface DriverRequestDocumentWithCustomId
  extends DriverRequestDocument {
  driverRequestId: string;
}
export const DriverRequestSchema = SchemaFactory.createForClass(DriverRequest);

// đánh index
// DriverRequestSchema.index({ driverId: 1 });
// DriverRequestSchema.index({ status: 1 });

// ảo hoá cho driverRequestId
DriverRequestSchema.virtual('driverRequestId').get(function (
  this: DriverRequest
) {
  return this._id.toString();
});

DriverRequestSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    return ret;
  }
});

DriverRequestSchema.set('toObject', {
  virtuals: true
});
