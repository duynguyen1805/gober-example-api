import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';

@Schema({ collection: 'admins' })
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
