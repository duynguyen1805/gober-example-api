import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('request_types')
export class RequestTypeEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'request_type_id' })
  requestTypeId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;
} 