import { DriverEntity } from '../../../database/entities/driver.entity';

export interface ISignInDriverResponse {
  token: string;
  refreshToken: string;
  driver: DriverEntity;
}

export interface IRefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface IJWTPayload {
  data: {
    email: string;
    phoneNumber: string;
    driverId: number;
  };
}
