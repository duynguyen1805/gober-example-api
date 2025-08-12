import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';

@Schema({ collection: 'admins', timestamps: true })
export class Admin extends BaseSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

// type cho Document
export type AdminDocument = Admin & Document;
export interface AdminDocumentWithCustomId extends AdminDocument {
  adminId: string;
}
export const AdminSchema = SchemaFactory.createForClass(Admin);

// ảo hoá cho adminId
AdminSchema.virtual('adminId').get(function (this: Admin) {
  return this._id.toString();
});

AdminSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    return ret;
  }
});

AdminSchema.set('toObject', {
  virtuals: true
});
