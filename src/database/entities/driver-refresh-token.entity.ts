import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { DriverEntity } from './driver.entity';

@Entity('driver_refresh_tokens')
export class DriverRefreshTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'driver_refresh_token_id' })
  driverRefreshTokenId: number;

  @Column({ name: 'driver_id' })
  driverId: number;

  @Column({ name: 'token' })
  token: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'device_token' })
  deviceToken: string;

  @Column({ name: 'is_revoked', default: false })
  isRevoked: boolean;

  @ManyToOne(() => DriverEntity, (driver) => driver.driverId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;
}
