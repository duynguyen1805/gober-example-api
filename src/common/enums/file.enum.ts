export enum EFileType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
  OTHER = 'other'
}

// Tập mime types & extensions hợp lệ cho mỗi loại
export const FileTypeConfig: Record<
  EFileType,
  {
    mimeTypes: string[];
    extensions: string[];
  }
> = {
  [EFileType.IMAGE]: {
    mimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    extensions: ['jpg', 'jpeg', 'png']
  },
  [EFileType.DOCUMENT]: {
    mimeTypes: ['application/pdf', 'application/msword'],
    extensions: ['pdf', 'doc', 'docx']
  },
  [EFileType.VIDEO]: {
    mimeTypes: ['video/mp4', 'video/mpeg'],
    extensions: ['mp4', 'mpeg']
  },
  [EFileType.AUDIO]: {
    mimeTypes: ['audio/mpeg', 'audio/wav'],
    extensions: ['mp3', 'wav']
  },
  [EFileType.OTHER]: {
    mimeTypes: [],
    extensions: []
  }
};

export const allowedExtensions = FileTypeConfig[EFileType.IMAGE].extensions;
export const allowedMimeTypes = FileTypeConfig[EFileType.IMAGE].mimeTypes;
export const blockedExtensions = ['exe', 'bat', 'sh', 'msi'];
