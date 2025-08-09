import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('admins')
export class AdminEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'admin_id' })
  adminId: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;
} 