import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { DriverEntity } from './driver.entity';

@Entity('files')
export class FileEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'file_id' })
  fileId: number;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column({ name: 'mime_type', nullable: true })
  mimeType: string;

  @Column({ name: 'file_extension', nullable: false })
  fileExtension: string;

  @Column({ nullable: true })
  size: number;

  @Column({ name: 'uploaded_by_id', nullable: true })
  uploadedById: number;

  @ManyToOne(() => DriverEntity, (driver) => driver.driverId)
  @JoinColumn({ name: 'uploaded_by_id' })
  uploadedBy: DriverEntity;
}
