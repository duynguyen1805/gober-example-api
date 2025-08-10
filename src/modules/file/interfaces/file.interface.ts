import { FileEntity } from '../../../database/entities/file.entity';

export interface IFileUploadInput {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface PagedFileResult {
  items: FileEntity[];
  total: number;
  page: number;
  pageSize: number;
}

export interface IFileOutput extends FileEntity {
  url: string;
}
