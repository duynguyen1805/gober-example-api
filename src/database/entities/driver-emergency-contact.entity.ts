import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { DriverEntity } from './driver.entity';

@Entity('driver_emergency_contacts')
export class DriverEmergencyContactEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'driver_emergency_contact_id' })
  driverEmergencyContactId: number;

  @Column({ name: 'driver_id' })
  driverId: number;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'relationship' })
  relationship: string;

  @ManyToOne(() => DriverEntity, (driver) => driver.driverId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;
} 