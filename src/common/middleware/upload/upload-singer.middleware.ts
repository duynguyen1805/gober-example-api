import multer from 'multer';
import { RequestHandler } from 'express';
import path from 'path';
import { Settings } from '../../../common/constants/constants';
import {
  allowedExtensions,
  allowedMimeTypes,
  blockedExtensions
} from '../../../common/enums/file.enum';
import { BadRequestException } from '@nestjs/common';

const multerOptions = {
  storage: multer.memoryStorage(),
  limits: { fileSize: Settings.UPLOADING_FILE_SIZE }
  // fileFilter: async (req, file, cb) => {
  //   const ext = path.extname(file.originalname).toLowerCase().replace('.', '');

  //   if (blockedExtensions.includes(ext)) {
  //     return cb(new Error(`Extension không đưuọc phép: .${ext}`));
  //   }
  //   console.log('ext ::: ', ext);
  //   if (!allowedExtensions.includes(ext)) {
  //     return cb(new Error(`Extension .${ext} không được phép.`));
  //   }

  //   cb(null, true);
  // }
};

export const uploadMiddleware = multer(multerOptions).single(
  'file'
) as RequestHandler;
