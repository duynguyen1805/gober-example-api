import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { makeSure } from '../../../common/helpers/system/server-error.helper';
import { compare } from 'bcrypt';
import { SignInDriverDto } from '../dto/signin-driver.dto';
import { DriverEntity } from '../../../database/entities/driver.entity';
import { DriverRefreshTokenEntity } from '../../../database/entities/driver-refresh-token.entity';
import { EError } from '../../../common/enums/error.enum';
import { isValidEmail } from '../../../common/helpers/auth/index';
import { isValidPhoneNumber } from '../../../common/helpers/auth';
import { isNil } from 'lodash';
import { ISignInDriverResponse } from '../interface/auth-driver.interface';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../../constants';

@Injectable()
export class SignInUseCase {
  constructor(
    @InjectRepository(DriverEntity)
    private driverRepository: Repository<DriverEntity>,
    @InjectRepository(DriverRefreshTokenEntity)
    private driverRefreshTokenRepository: Repository<DriverRefreshTokenEntity>,
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
    // Kiểm tra indentify hợp lệ (có thể email hoặc phone number)
    if (!isValidEmail(driver.identifier)) {
      // Kiểm tra phone number
      makeSure(isValidPhoneNumber(driver.identifier), EError.INVALID_INDETITY);
    }

    // Kiểm tra driver đã tồn tại
    const currentDriver = await this.findDriver(driver);
    makeSure(!isNil(currentDriver), EError.DRIVER_NOT_FOUND);

    // Kiểm tra password (có thể các rule khác)
    makeSure(driver.password.length >= 6, EError.INVALID_PASSWORD);
  }

  /**
   * Tìm kiếm driver có email hoặc phone number trùng với tham số
   * @param driver Tham số identifier là email hoặc phone number
   * @returns DriverEntity nếu tìm thấy, ngược lại trả về null
   */
  async findDriver(driver: SignInDriverDto): Promise<DriverEntity> {
    return await this.driverRepository.findOne({
      where: [{ email: driver.identifier }, { phoneNumber: driver.identifier }]
    });
  }

  /**
   * Validate password của driver
   * @param driver DriverEntity để verify password
   * @param password password để verify
   * @throws EError nếu password không trùng khớp
   */
  async enforceCorrectPassword(driver: DriverEntity, password: string) {
    const isCorrectPassword = await compare(password, driver.password);
    makeSure(isCorrectPassword, EError.INVALID_PASSWORD);
  }

  /**
   * Tạo driver-refresh-token
   * @param driverId id của driver
   * @param refreshToken refresh token
   */
  async createDriverRefreshToken(driverId: number, refreshToken: string) {
    const entityDriverRefreshToken = this.driverRefreshTokenRepository.create({
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
    return this.driverRefreshTokenRepository.save(entityDriverRefreshToken);
  }
}
