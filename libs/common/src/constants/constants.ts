import { configService } from '../index';

export const Constants = {
  ROOT_USER_EMAIL: 'duynguyenqwert@gmail.com',
  ONE_DAY_IN_MILLISECOND: 86400000,
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
};

export const Settings = {
  UPLOADING_FILE_SIZE: 524288000
};

export const jwtConstants = {
  secret: configService.getEnv('JWT_SECRET'),
  expiresInAccessToken: '1d',
  expiresInRefreshToken: '30d',
  expiresInAccessTokenNumber: 1,
  expiresInRefreshTokenNumber: 30
};
