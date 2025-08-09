import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { DriverEntity } from './driver.entity';

@Entity('driver_signatures')
export class DriverSignatureEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'driver_signature_id' })
  driverSignatureId: number;

  @Column({ name: 'driver_id' })
  driverId: number;

  @Column({ name: 'signature_data' })
  signatureData: string;

  @Column({ name: 'signature_type' })
  signatureType: string;

  @OneToOne(() => DriverEntity, (driver) => driver.driverId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;
} 