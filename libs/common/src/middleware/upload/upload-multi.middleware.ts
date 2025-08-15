import multer from 'multer';
import { RequestHandler } from 'express';
import { Settings } from '../../constants/constants';

const multerOptions = {
  storage: multer.memoryStorage(),
  limits: { fileSize: Number(Settings?.UPLOADING_FILE_SIZE) }
};

export const multiUploadMiddleware = multer(multerOptions).array(
  'files',
  10
) as RequestHandler;
