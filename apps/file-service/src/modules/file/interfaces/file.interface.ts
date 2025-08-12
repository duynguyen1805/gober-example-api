import {
  FileDocument,
  FileDocumentWithCustomId
} from '@app/database/schemas/file.schema';

export interface IFileUploadInput {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface PagedFileResult {
  items: FileDocument[];
  total: number;
  page: number;
  pageSize: number;
}

export interface IFileOutput extends FileDocument {
  url: string;
}
