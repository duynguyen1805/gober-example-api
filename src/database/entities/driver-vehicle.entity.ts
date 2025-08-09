import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { DriverEntity } from './driver.entity';

@Entity('driver_vehicles')
export class DriverVehicleEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'driver_vehicle_id' })
  driverVehicleId: number;

  @Column({ name: 'driver_id' })
  driverId: number;

  @Column({ name: 'license_plate' })
  licensePlate: string;

  @Column({ name: 'vehicle_type' })
  vehicleType: string;

  @Column({ name: 'brand' })
  brand: string;

  @Column({ name: 'model' })
  model: string;

  @Column({ name: 'year' })
  year: number;

  @OneToOne(() => DriverEntity, (driver) => driver.driverId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;
} 