import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import { Document } from 'mongoose';
import { Driver } from './driver.schema';

@Schema({ collection: 'files' })
export class File extends BaseSchema {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: false })
  mimeType: string;

  @Prop({ required: true })
  fileExtension: string;

  @Prop({ required: false })
  size: number;

  @Prop({ required: false })
  uploadedById: string;

  @Prop({ required: false }) // mặc định tạm set cho Driver
  uploadedByModel: string; // ai upload file: ADMIN | DRIVER
}

// type cho Document
export type FileDocument = File & Document;
export interface FileDocumentWithCustomId extends FileDocument {
  fileId: string;
}
export const FileSchema = SchemaFactory.createForClass(File);

// ảo hoá cho fileId
FileSchema.virtual('fileId').get(function (this: File) {
  return this._id.toString();
});

FileSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
    return ret;
  }
});

FileSchema.set('toObject', {
  virtuals: true
});
