import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { DriverEntity } from './driver.entity';

@Entity('driver_banks')
export class DriverBankEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'driver_bank_id' })
  driverBankId: number;

  @Column({ name: 'driver_id' })
  driverId: number;

  @Column({ name: 'bank_name' })
  bankName: string;

  @Column({ name: 'account_number' })
  accountNumber: string;

  @Column({ name: 'account_holder_name' })
  accountHolderName: string;

  @ManyToOne(() => DriverEntity, (driver) => driver.driverId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;
} 