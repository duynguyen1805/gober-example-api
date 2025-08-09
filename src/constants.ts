import { configService } from './config/config.service';

export const Constants = {
  ROOT_USER_EMAIL: 'duynguyenqwert@gmail.com',
  ROOT_USER_ID: 1,
  SALT_ROUNDS: 8,
  ONE_DAY_IN_MILLISECOND: 86400000,
  ONE_HOUR_IN_MILLISECOND: 3600000,
  ONE_DAY_IN_SECOND: 86400,
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
};

export const Settings = {
  PRODUCT_NAME: 'Gober-api',
  SENDER_EMAIL: 'no-reply@gober',
  EMAIL_SUPPORT: 'support@gober',
  FORGOT_PASSWORD_EXPIRED_TIME: 86400000,
  CHANGE_PASSWORD_EXPIRED_TIME: 86400000,
  REGISTER_VERIFICATION_EXPIRED_TIME: 86400000,
  SESSION_EXPIRED_TIME: 864000000,
  SESSION_REMEMBER_ME_EXPIRED_TIME: 864000000,
  UPLOADING_FILE_SIZE: 524288000,
  SEND_OTP: 300000,
  CREATE_2FA_EXPIRED_TIME: 86400000
};

export const jwtConstants = {
  secret: configService.getEnv('JWT_SECRET'),
  expiresInAccessToken: '1d',
  expiresInRefreshToken: '30d',
  expiresInAccessTokenNumber: 1,
  expiresInRefreshTokenNumber: 30
};
