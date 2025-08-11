import { DriverDocumentWithCustomId } from '../../../database/mongo-db/driver.schema';

export interface ISignInDriverResponse {
  token: string;
  refreshToken: string;
  driver: DriverDocumentWithCustomId;
}

export interface IRefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface IJWTPayload {
  data: {
    email: string;
    phoneNumber: string;
    driverId: string;
  };
}
