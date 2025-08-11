import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import { Document } from 'mongoose';

@Schema({ collection: 'service_types' })
export class ServiceType extends BaseSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;
}

// type cho Document
export type ServiceTypeDocument = ServiceType & Document;
export interface ServiceTypeDocumentWithCustomId extends ServiceType {
  serviceTypeId: string;
}
export const ServiceTypeSchema = SchemaFactory.createForClass(ServiceType);

// ảo hoá cho serviceTypeId
ServiceTypeSchema.virtual('serviceTypeId').get(function (this: ServiceType) {
  return this._id.toString();
});
