import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { isNil } from 'lodash';
import { JwtService } from '@nestjs/jwt';
// helpers/constants
import { makeSure } from '../../../common/helpers/server-error.helper';
import { EError } from '../../../common/enums/error.enum';
import { isValidEmail } from '../../../common/helpers/auth.helper';
import { isValidPhoneNumber } from '../../../common/helpers/auth.helper';
import { jwtConstants } from '../../../common/constants/constants';
// schema
import {
  DriverDocument,
  DriverDocumentWithCustomId
} from '../../../database/mongo-db/driver.schema';
// dto
import { SignInDriverDto } from '../dto/signin-driver.dto';
// interface
import { ISignInDriverResponse } from '../interface/auth-driver.interface';
// model.repository
import { DriverModelRepository } from '../../../modules/driver/driver.model.repository';
import { DriverRefreshTokenModelRepository } from '../../driver-request/driver-refresh-token.model.repository';

@Injectable()
export class SignInUseCase {
  constructor(
    private readonly driverModelRepository: DriverModelRepository,
    private readonly driverRefreshTokenModelRepository: DriverRefreshTokenModelRepository,
    private jwtService: JwtService
  ) {}

  /**
   * SignIn driver
   * @param driver SignUpDriverDto để login
   * @returns token, refreshToken và thông tin driver
   * @throws EError nếu có giá trị không hợp lệ
   */
  async signIn(driver: SignInDriverDto): Promise<ISignInDriverResponse> {
    await this.validateDriverDto(driver);
    const driverExists = await this.findDriver(driver);
    const payload = {
      email: driverExists?.email || null,
      phoneNumber: driverExists?.phoneNumber || null,
      driverId: driverExists.driverId
    };

    const token = this.jwtService.sign(
      { data: payload },
      { expiresIn: jwtConstants.expiresInAccessToken }
    );
    const refreshToken = this.jwtService.sign(
      { data: payload },
      { expiresIn: jwtConstants.expiresInRefreshToken }
    );

    await this.createDriverRefreshToken(driverExists.driverId, refreshToken);

    return {
      token,
      refreshToken,
      driver: driverExists
    };
  }

  /**
   * Validate SignUpDriverDto trước khi request sign up
   * @throws EError nếu có giá trị không hợp lệ
   * @param driver the SignUpDriverDto object để validate
   */
  async validateDriverDto(driver: SignInDriverDto): Promise<void> {
    // Kiểm tra indentify hợp lệ
    // indentify => có thể email hoặc phoneNumber
    if (!isValidEmail(driver.identifier)) {
      // Kiểm tra phone number
      makeSure(isValidPhoneNumber(driver.identifier), EError.INVALID_INDETITY);
    }
    console.log('driver ::: ', driver);
    // Kiểm tra driver đã tồn tại
    const currentDriver = await this.findDriver(driver);
    console.log('currentDriver ::: ', currentDriver);
    makeSure(!isNil(currentDriver), EError.DRIVER_NOT_FOUND);

    // Kiểm tra password (có thể các rule khác)
    makeSure(driver.password.length >= 6, EError.INVALID_PASSWORD);
  }

  /**
   * Tìm kiếm driver có email hoặc phone number trùng với tham số
   * @param inputSignIn Tham số identifier là email hoặc phone number
   * @returns DriverEntity nếu tìm thấy, ngược lại trả về null
   */
  async findDriver(
    inputSignIn: SignInDriverDto
  ): Promise<DriverDocumentWithCustomId> {
    return await this.driverModelRepository.findDriversByEmailOrPhoneNumber({
      identifier: inputSignIn.identifier
    });
  }

  /**
   * Validate password của driver
   * @param driver DriverDocument để verify password
   * @param password password để verify
   * @throws EError nếu password không trùng khớp
   */
  async enforceCorrectPassword(driver: DriverDocument, password: string) {
    const isCorrectPassword = await compare(password, driver.password);
    makeSure(isCorrectPassword, EError.INVALID_PASSWORD);
  }

  /**
   * Tạo driver-refresh-token
   * @param driverId id của driver
   * @param refreshToken refresh token
   */
  async createDriverRefreshToken(driverId: string, refreshToken: string) {
    const driverRefreshTokenDocument =
      await this.driverRefreshTokenModelRepository.createDriverRefreshToken({
        driverId,
        token: refreshToken,
        deviceToken: 'example device token',
        isRevoked: false,
        expiresAt: new Date(
          new Date().setDate(
            new Date().getDate() + jwtConstants.expiresInRefreshTokenNumber
          )
        )
      });
    return this.driverRefreshTokenModelRepository.saveDriverRefreshToken(
      driverRefreshTokenDocument
    );
  }
}
