import multer from 'multer';
import { RequestHandler } from 'express';
import path from 'path';
import { fileTypeFromFile } from 'file-type';
import { Settings } from '../../../common/constants/constants';
import { makeSure } from '../../../common/helpers/server-error.helper';
import { EError } from '../../../common/enums';

// Danh sách extension cho phép
export const allowedExtension = ['.jpg', '.jpeg', '.png'];
// Danh sách extension bị cấm
export const blockedExtention = ['.exe', '.bat', '.sh', '.msi'];

const multerOptions = {
  storage: multer.memoryStorage(),
  limits: { fileSize: Settings.UPLOADING_FILE_SIZE },
  fileFilter: async (req, file, cb) => {
    try {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowedExtension.includes(ext)) {
        makeSure(false, EError.INVALID_FILE_TYPE, null, 400);
      }
      if (blockedExtention.includes(ext)) {
        makeSure(false, EError.INVALID_FILE_TYPE, null, 400);
      }

      // check loại file thực tế
      const type = await fileTypeFromFile(file.buffer);
      if (!type || !['image/jpeg', 'image/png'].includes(type.mime)) {
        makeSure(false, EError.INVALID_FILE_TYPE, null, 400);
      }

      cb(null, true);
    } catch (err) {
      makeSure(false, EError.INVALID_FILE_TYPE, null, 400);
      cb(err);
    }
  }
};

export const uploadMiddleware = multer(multerOptions).single(
  'file'
) as RequestHandler;
