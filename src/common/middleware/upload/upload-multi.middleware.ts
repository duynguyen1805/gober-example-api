import multer from 'multer';
import { RequestHandler } from 'express';
import { Settings } from '../../../common/constants/constants';
import path from 'path';
import {
  allowedExtensions,
  allowedMimeTypes,
  blockedExtensions
} from '../../../common/enums/file.enum';

const multerOptions = {
  storage: multer.memoryStorage(),
  limits: { fileSize: Settings.UPLOADING_FILE_SIZE }
  // fileFilter: async (req, file, cb) => {
  //   const ext = path.extname(file.originalname).toLowerCase().replace('.', '');

  //   if (blockedExtensions.includes(ext)) {
  //     return cb(new Error(`Extension không đưuọc phép: .${ext}`));
  //   }

  //   if (!allowedExtensions.includes(ext)) {
  //     return cb(new Error(`Extension .${ext} không được phép.`));
  //   }

  //   // Import động file-type để tránh lỗi
  //   const { fileTypeFromBuffer } = await import('file-type');
  //   const type = await fileTypeFromBuffer(file.buffer);
  //   if (!type || !allowedMimeTypes.includes(type.mime)) {
  //     return cb(
  //       new Error(`Mime type ${type?.mime || 'unknown'} không được phép.`)
  //     );
  //   }

  //   cb(null, true);
  // }
};

export const multiUploadMiddleware = multer(multerOptions).array(
  'files',
  10
) as RequestHandler;
