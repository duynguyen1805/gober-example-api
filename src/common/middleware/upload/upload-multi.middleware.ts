import multer from 'multer';
import { RequestHandler } from 'express';
import { Settings } from '../../../common/constants/constants';
import path from 'path';
import { fileTypeFromFile } from 'file-type';
import { makeSure } from '../../../common/helpers/server-error.helper';
import { EError } from '../../../common/enums';
import { allowedExtension, blockedExtention } from './upload-singer.middleware';

const multerOptions = {
  storage: multer.memoryStorage(),
  limits: { fileSize: Settings.UPLOADING_FILE_SIZE }
  // fileFilter: async (req, file, cb) => {
  //   try {
  //     const ext = path.extname(file.originalname).toLowerCase();
  //     if (!allowedExtension.includes(ext)) {
  //       makeSure(false, EError.INVALID_FILE_TYPE, null, 400);
  //     }
  //     if (blockedExtention.includes(ext)) {
  //       makeSure(false, EError.INVALID_FILE_TYPE, null, 400);
  //     }

  //     // check loại file thực tế
  //     const type = await fileTypeFromFile(file.buffer);
  //     if (!type || !['image/jpeg', 'image/png'].includes(type.mime)) {
  //       makeSure(false, EError.INVALID_FILE_TYPE, null, 400);
  //     }

  //     cb(null, true);
  //   } catch (err) {
  //     makeSure(false, EError.INVALID_FILE_TYPE, null, 400);
  //     cb(err);
  //   }
  // }
};

export const multiUploadMiddleware = multer(multerOptions).array(
  'files',
  10
) as RequestHandler;
