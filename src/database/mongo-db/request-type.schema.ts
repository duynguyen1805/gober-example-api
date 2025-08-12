import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import { Document } from 'mongoose';

@Schema({ collection: 'request_types', timestamps: true })
export class RequestType extends BaseSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;
}

// type cho Document
export type RequestTypeDocument = RequestType & Document;
export interface RequestTypeDocumentWithCustomId extends RequestType {
  requestTypeId: string;
}
export const RequestTypeSchema = SchemaFactory.createForClass(RequestType);

// ảo hoá cho requestTypeId
RequestTypeSchema.virtual('requestTypeId').get(function (this: RequestType) {
  return this._id.toString();
});

RequestTypeSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    return ret;
  }
});

RequestTypeSchema.set('toObject', {
  virtuals: true
});
