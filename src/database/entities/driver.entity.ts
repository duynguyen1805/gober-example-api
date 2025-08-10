import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { DriverBankEntity } from './driver-bank.entity';
import {
  EDriverApprovalStatus,
  EDriverStatus
} from '../../modules/driver/enums/driver.enum';
import { ServiceTypeEntity } from './service-type.entity';
import { DriverEmergencyContactEntity } from './driver-emergency-contact.entity';
import { DriverVehicleEntity } from './driver-vehicle.entity';
import { AdminEntity } from './admin.entity';
import { ProvinceEntity } from './province.entity';
import { FileEntity } from './file.entity';
import { DriverSignatureEntity } from './driver-signature.entity';
import { DriverUniformEntity } from './driver-uniform.entity';
import { DriverAvailabilityEntity } from './driver-availability.entity';
import { encrypt, decrypt } from '../../common/helpers/bcrypt.helper';
import { AutoMap } from '@automapper/classes';

@Entity('drivers')
export class DriverEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'driver_id' })
  driverId: number;

  @AutoMap()
  @Column({ name: 'full_name', nullable: true })
  fullName: string;

  @AutoMap()
  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @AutoMap()
  @Column({ name: 'email', nullable: true })
  email: string;

  @AutoMap()
  @Column({ name: 'password', nullable: true, select: false })
  password: string;

  @AutoMap()
  @Column({ name: 'device_token', nullable: true })
  deviceToken: string;

  @AutoMap()
  @Column({ name: 'last_login', nullable: true })
  lastLogin: Date;

  @AutoMap()
  @Column({ name: 'email_verified_at', nullable: true })
  emailVerifiedAt: Date;

  @AutoMap()
  @Column({ name: 'avatar', nullable: true, type: 'int' })
  avatar: number;

  @AutoMap()
  @Column({ name: 'active_area_id', nullable: true })
  activeAreaId: number;

  @AutoMap()
  @Column({ name: 'temporary_address', nullable: true })
  temporaryAddress: string;

  @AutoMap()
  @Column({ name: 'identity_card_front_id', nullable: true, type: 'int' })
  identityCardFrontId: number;

  @AutoMap()
  @Column({ name: 'identity_card_back_id', nullable: true, type: 'int' })
  identityCardBackId: number;

  @AutoMap()
  @Column({ enum: EDriverStatus, default: EDriverStatus.INACTIVE })
  status: EDriverStatus;

  @AutoMap()
  @Column({ name: 'submitted_at', nullable: true })
  submittedAt: Date;

  @AutoMap()
  @Column({
    name: 'approval_status',
    enum: EDriverApprovalStatus,
    default: EDriverApprovalStatus.DRAFT
  })
  approvalStatus: EDriverApprovalStatus;

  @AutoMap()
  @Column({ name: 'approved_at', nullable: true })
  approvedAt: Date;

  @AutoMap()
  @Column({ name: 'approved_by_id', nullable: true })
  approvedById: number;

  @AutoMap()
  @Column({ name: 'approved_note', nullable: true })
  approvedNote: string;

  @AutoMap()
  @Column({ name: 'created_by_id', nullable: true })
  createdById: number;

  @AutoMap()
  @Column({ name: 'balance', default: 0 })
  balance: number;

  @AutoMap()
  @Column({
    name: 'pin',
    nullable: true,
    select: false,
    transformer: {
      to: (value) => encrypt(value),
      from: (value) => decrypt(value)
    }
  })
  pin: string;

  @AutoMap(() => [DriverBankEntity])
  @OneToMany(() => DriverBankEntity, (driverBank) => driverBank.driver, {
    cascade: true
  })
  banks: DriverBankEntity[];

  @AutoMap(() => [ServiceTypeEntity])
  @ManyToMany(
    () => ServiceTypeEntity,
    (serviceType) => serviceType.serviceTypeId,
    { cascade: true }
  )
  @JoinTable({
    name: 'driver_service_types',
    joinColumn: { name: 'driver_id' },
    inverseJoinColumn: { name: 'service_type_id' }
  })
  serviceTypes: ServiceTypeEntity[];

  @AutoMap(() => [DriverEmergencyContactEntity])
  @OneToMany(
    () => DriverEmergencyContactEntity,
    (emergencyContact) => emergencyContact.driver,
    { cascade: true }
  )
  emergencyContacts: DriverEmergencyContactEntity[];

  @AutoMap(() => DriverVehicleEntity)
  @OneToOne(() => DriverVehicleEntity, (vehicle) => vehicle.driver, {
    cascade: true
  })
  vehicle: DriverVehicleEntity;

  @AutoMap(() => AdminEntity)
  @ManyToOne(() => AdminEntity, (admin) => admin.adminId)
  @JoinColumn({ name: 'approved_by_id' })
  approvedBy: AdminEntity;

  @AutoMap(() => AdminEntity)
  @ManyToOne(() => AdminEntity, (admin) => admin.adminId)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: AdminEntity;

  @AutoMap(() => ProvinceEntity)
  @ManyToOne(() => ProvinceEntity, (province) => province.provinceId)
  @JoinColumn({ name: 'active_area_id' })
  activeArea: ProvinceEntity;

  @AutoMap(() => FileEntity)
  @ManyToOne(() => FileEntity, (file) => file.fileId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'identity_card_front_id' })
  identityCardFront: FileEntity;

  @AutoMap(() => FileEntity)
  @ManyToOne(() => FileEntity, (file) => file.fileId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'identity_card_back_id' })
  identityCardBack: FileEntity;

  @AutoMap(() => FileEntity)
  @ManyToOne(() => FileEntity, (file) => file.fileId)
  @JoinColumn({ name: 'avatar' })
  avatarFile: FileEntity;

  @AutoMap(() => DriverSignatureEntity)
  @OneToOne(() => DriverSignatureEntity, (signature) => signature.driver, {
    cascade: true
  })
  signature: DriverSignatureEntity;

  @AutoMap(() => [DriverUniformEntity])
  @OneToMany(() => DriverUniformEntity, (uniform) => uniform.driver, {
    cascade: true
  })
  uniforms: DriverUniformEntity[];

  @AutoMap(() => [DriverAvailabilityEntity])
  @OneToMany(
    () => DriverAvailabilityEntity,
    (availability) => availability.driver
  )
  driverAvailability: DriverAvailabilityEntity[];
}
