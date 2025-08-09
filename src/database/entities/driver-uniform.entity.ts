import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { DriverEntity } from './driver.entity';

@Entity('driver_uniforms')
export class DriverUniformEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'driver_uniform_id' })
  driverUniformId: number;

  @Column({ name: 'driver_id' })
  driverId: number;

  @Column({ name: 'uniform_type' })
  uniformType: string;

  @Column({ name: 'size' })
  size: string;

  @Column({ name: 'quantity' })
  quantity: number;

  @Column({ name: 'issued_date' })
  issuedDate: Date;

  @ManyToOne(() => DriverEntity, (driver) => driver.driverId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;
} 