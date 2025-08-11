import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import { Document } from 'mongoose';

@Schema({ collection: 'provinces' })
export class Province extends BaseSchema {
  @Prop({ required: true })
  name: string;
}

// type cho Document
export type ProvinceDocument = Province & Document;
export interface ProvinceDocumentWithCustomId extends Province {
  provinceId: string;
}
export const ProvinceSchema = SchemaFactory.createForClass(Province);

// ảo hoá cho provinceId
ProvinceSchema.virtual('provinceId').get(function (this: Province) {
  return this._id.toString();
});
