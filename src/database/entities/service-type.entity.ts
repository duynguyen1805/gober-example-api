import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('service_types')
export class ServiceTypeEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'service_type_id' })
  serviceTypeId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;
} 