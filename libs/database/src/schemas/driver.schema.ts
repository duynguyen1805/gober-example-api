import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { BaseSchema } from './base.schema';
import { File } from './file.schema';
import { Province } from './province.schema';
import { Admin } from './admin.schema';
import { ServiceType } from './service-type.schema';

@Schema({ _id: true })
export class DriverBankSub {
  @Prop() bankName: string;
  @Prop() accountNumber: string;
  @Prop() accountHolderName: string;
  @Prop({ default: true }) isActive?: boolean;
  @Prop({ type: Date, default: Date.now }) createdAt?: Date;
}
export const DriverBankSubSchema = SchemaFactory.createForClass(DriverBankSub);
export type DriverBankSubDocument = DriverBankSub & Document;
export interface DriverBankSubDocumentWithCustomId
  extends DriverBankSubDocument {
  driverBankId: string;
}
DriverBankSubSchema.virtual('driverBankId').get(function (this: any) {
  return this._id?.toString();
});
DriverBankSubSchema.set('toJSON', { virtuals: true });
DriverBankSubSchema.set('toObject', { virtuals: true });

@Schema({ _id: true })
export class DriverEmergencyContactSub {
  @Prop() fullName: string;
  @Prop() phoneNumber: string;
  @Prop() relationship: string;
  @Prop({ default: true }) isActive?: boolean;
}
export const DriverEmergencyContactSubSchema = SchemaFactory.createForClass(
  DriverEmergencyContactSub
);
export type DriverEmergencyContactSubDocument = DriverEmergencyContactSub &
  Document;
export interface DriverEmergencyContactSubDocumentWithCustomId
  extends DriverEmergencyContactSubDocument {
  driverEmergencyContactId: string;
}
DriverEmergencyContactSubSchema.virtual('driverEmergencyContactId').get(
  function (this: any) {
    return this._id?.toString();
  }
);
DriverEmergencyContactSubSchema.set('toJSON', { virtuals: true });
DriverEmergencyContactSubSchema.set('toObject', { virtuals: true });

@Schema({ _id: true })
export class DriverVehicleSub {
  @Prop() licensePlate: string;
  @Prop() vehicleType: string;
  @Prop() brand: string;
  @Prop() model: string;
  @Prop() year: number;
  @Prop({ default: true }) isActive?: boolean;
}
export const DriverVehicleSubSchema =
  SchemaFactory.createForClass(DriverVehicleSub);
export type DriverVehicleSubDocument = DriverVehicleSub & Document;
export interface DriverVehicleSubDocumentWithCustomId
  extends DriverVehicleSubDocument {
  driverVehicleId: string;
}
DriverVehicleSubSchema.virtual('driverVehicleId').get(function (this: any) {
  return this._id?.toString();
});
DriverVehicleSubSchema.set('toJSON', { virtuals: true });
DriverVehicleSubSchema.set('toObject', { virtuals: true });

@Schema()
export class DriverSignatureSub {
  @Prop() signatureData: string;
  @Prop() signatureType: string;
  @Prop({ type: Date, default: Date.now }) createdAt?: Date;
}
export const DriverSignatureSubSchema =
  SchemaFactory.createForClass(DriverSignatureSub);

@Schema()
export class DriverUniformSub {
  @Prop() uniformType: string;
  @Prop() size: string;
  @Prop() quantity: number;
  @Prop() issuedDate: Date;
}
export const DriverUniformSubSchema =
  SchemaFactory.createForClass(DriverUniformSub);

@Schema()
export class DriverAvailabilitySub {
  @Prop() dayOfWeek: number; // 0-6 hoặc 1-7
  @Prop() startTime: string; // '08:00'
  @Prop() endTime: string;
  @Prop() isAvailable: boolean;
}
export const DriverAvailabilitySubSchema = SchemaFactory.createForClass(
  DriverAvailabilitySub
);

@Schema({ collection: 'drivers', timestamps: true })
export class Driver extends BaseSchema {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ required: false })
  email?: string;

  @Prop() password?: string;
  @Prop() deviceToken?: string;
  @Prop() lastLogin?: Date;
  @Prop() emailVerifiedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: File.name })
  avatarFileId?: Types.ObjectId | File;

  @Prop({ type: Types.ObjectId, ref: Province.name })
  activeAreaId?: Types.ObjectId | Province;

  @Prop() temporaryAddress?: string;

  @Prop({ type: Types.ObjectId, ref: File.name })
  identityCardFrontId?: Types.ObjectId | File;

  @Prop({ type: Types.ObjectId, ref: File.name })
  identityCardBackId?: Types.ObjectId | File;

  @Prop({ enum: ['active', 'inactive', 'suspended'], default: 'active' })
  status?: string;

  @Prop({
    enum: ['draft', 'pending', 'approved', 'rejected'],
    default: 'draft'
  })
  approvalStatus?: string;

  @Prop() submittedAt?: Date;
  @Prop() approvedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: Admin.name })
  approvedById?: Types.ObjectId | Admin;

  @Prop() approvedNote?: string;

  @Prop({ type: Types.ObjectId, ref: Admin.name })
  createdById?: Types.ObjectId | Admin;

  @Prop({ default: 0 })
  balance?: number;

  @Prop() pin?: string;

  @Prop({ default: true })
  isActive?: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: ServiceType.name }] })
  serviceTypeIds?: (Types.ObjectId | ServiceType)[];

  @Prop({ type: [DriverBankSub], default: [] })
  banks?: DriverBankSub[];

  @Prop({ type: [DriverEmergencyContactSub], default: [] })
  emergencyContacts?: DriverEmergencyContactSub[];

  @Prop({ type: [DriverVehicleSub], default: [] })
  vehicles?: DriverVehicleSub[];

  @Prop({ type: [DriverSignatureSub], default: [] })
  signatures?: DriverSignatureSub[];

  @Prop({ type: [DriverUniformSub], default: [] })
  uniforms?: DriverUniformSub[];

  @Prop({ type: [DriverAvailabilitySub], default: [] })
  availabilities?: DriverAvailabilitySub[];

  @Prop() deletedAt?: Date;
}

// type cho Document
export type DriverDocument = Driver & Document;
export interface DriverDocumentWithCustomId extends DriverDocument {
  driverId: string;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);

// đánh index
// DriverSchema.index({ status: 1 });
// DriverSchema.index({ approvalStatus: 1 });

// ảo hoá cho driverId
DriverSchema.virtual('driverId').get(function (this: Driver & Document) {
  return this._id.toString();
});

DriverSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    return ret;
  }
});

DriverSchema.set('toObject', {
  virtuals: true
});
