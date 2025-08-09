export enum EFileError {
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  DRIVER_NOT_FOUND = 'DRIVER_NOT_FOUND'
}

export enum EFileStatus {
  UPLOADING = 'uploading',
  UPLOADED = 'uploaded',
  PROCESSING = 'processing',
  READY = 'ready',
  ERROR = 'error'
}

export enum EFileType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
  OTHER = 'other'
}

export enum EErrorFile {
    FILE_NOT_FOUND = 'FILE_NOT_FOUND'
}