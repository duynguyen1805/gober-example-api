import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('provinces')
export class ProvinceEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'province_id' })
  provinceId: number;

  @Column()
  name: string;
} 