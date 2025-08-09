import multer from 'multer';
import { RequestHandler } from 'express';
import { Settings } from '../../../constants';

const multerOptions = {
  storage: multer.memoryStorage(),
  limits: { fileSize: Settings.UPLOADING_FILE_SIZE }
};

export const uploadMiddleware = multer(multerOptions).single('file') as RequestHandler;
