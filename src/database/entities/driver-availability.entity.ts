import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { DriverEntity } from './driver.entity';

@Entity('driver_availabilities')
export class DriverAvailabilityEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'driver_availability_id' })
  driverAvailabilityId: number;

  @Column({ name: 'driver_id' })
  driverId: number;

  @Column({ name: 'day_of_week' })
  dayOfWeek: number;

  @Column({ name: 'start_time' })
  startTime: string;

  @Column({ name: 'end_time' })
  endTime: string;

  @Column({ name: 'is_available' })
  isAvailable: boolean;

  @ManyToOne(() => DriverEntity, (driver) => driver.driverId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;
} 