import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDriverDto } from '../dto/signup-driver.dto';
import { DriverEntity } from '../../../database/entities/driver.entity';
import { EError, EErrorDetail } from '../../../common/enums/auth/auth.enum';
import { generateRandomCodeNumber } from '../../../common/helpers/auth/index';
import {
  makeSure,
  serverError
} from '../../../common/helpers/server-error.helper';
import { isNil } from 'lodash';
import { hash } from 'bcrypt';
import { EDriverStatus } from '../../../common/enums/driver/driver.enum';
import { isValidEmail } from '../../../common/helpers/auth/index';
import { isValidPhoneNumber } from '../../../common/helpers/auth';

@Injectable()
export class SignUpUseCase {
  constructor(
    @InjectRepository(DriverEntity)
    private driverRepository: Repository<DriverEntity>
  ) {}

  async signUpAccount(driver: SignUpDriverDto): Promise<DriverEntity> {
    this.validateDriverDto(driver);
    try {
      const driverRegistered = await this.saveDriver(driver);
      const code = generateRandomCodeNumber(6);
      // Handle gửi email code cho người dùng qua EMail hoặc SMS verify account (TH: có thông tin email)
      // await Mailer.sendRegistrationConfirmationEmail(userRegistered.id, {
      //   code,
      //   email: userRegistered.email
      // });

      // Lưu mã code (database hoặc redis với ttl)
      // const registerVerification = await this.saveCodeRegisterVerification(
      //   code,
      //   driverRegistered
      // );
      return driverRegistered;
    } catch (error) {
      console.log('signUpAccount error ::: ', error);
      serverError(
        EError.SIGN_UP_ERROR,
        EErrorDetail.SIGN_UP_ERROR,
        error.statusCode
      );
    }
  }

  /**
   * Validate SignUpDriverDto trước khi request sign up
   * @throws EError nếu có giá trị không hợp lệ
   * @param driver the SignUpDriverDto object để validate
   */
  async validateDriverDto(driver: SignUpDriverDto): Promise<void> {
    // Kiểm tra email hợp lệ
    makeSure(
      isValidEmail(driver.email),
      EError.INVALID_EMAIL,
      EErrorDetail.INVALID_EMAIL
    );
    // Kiểm tra phone number
    makeSure(
      isValidPhoneNumber(driver.phoneNumber),
      EError.INVALID_PHONE_NUMBER,
      EErrorDetail.INVALID_PHONE_NUMBER
    );
    // Kiểm tra driver đã tồn tại
    const currentDriver = await this.findDriver(driver);
    makeSure(isNil(currentDriver), EError.USER_EXIST, EErrorDetail.USER_EXIST);
    // Kiểm tra password (có thể các rule khác)
    makeSure(
      driver.password.length >= 6,
      EError.INVALID_PASSWORD,
      EErrorDetail.INVALID_PASSWORD
    );
    // Kiểm tra avatar (có thể thêm tìm trong bảng Files)
    if (driver.avatar)
      makeSure(
        !isNaN(driver.avatar),
        EError.INVALID_AVATAR,
        EErrorDetail.INVALID_AVATAR
      );
    // Kiểm tra avatar (có thể thêm tìm trong bảng Files)
    if (driver.identityCardFrontId)
      makeSure(
        !isNaN(driver.identityCardFrontId),
        EError.INVALID_IDENTITY_CARD,
        EErrorDetail.INVALID_IDENTITY_CARD
      );
    // Kiểm tra avatar (có thể thêm tìm trong bảng Files)
    if (driver.identityCardBackId)
      makeSure(
        !isNaN(driver.identityCardBackId),
        EError.INVALID_IDENTITY_CARD,
        EErrorDetail.INVALID_IDENTITY_CARD
      );
  }

  /**
   * Tìm kiếm driver có email hoặc phone number trùng với tham số
   * @param driver Tham số chứa email và/hoặc phone number
   * @returns DriverEntity nếu tìm thấy, ngược lại trả về null
   */
  async findDriver(driver: SignUpDriverDto): Promise<DriverEntity> {
    const where: Object[] = [];
    if (driver.email) {
      where.push({ email: driver.email });
    }
    if (driver.phoneNumber) {
      where.push({ phoneNumber: driver.phoneNumber });
    }
    if (where.length === 0) return null;

    return await this.driverRepository.findOne({ where });
  }

  /**
   * Lưu thông tin đăng ký của driver với status = INACTIVE
   *
   * @param driver - SignUpDriverDto chứa thông tin của driver
   * @returns DriverEntity đã lưu
   */

  async saveDriver(driver: SignUpDriverDto): Promise<DriverEntity> {
    const passwordHash = await hash(driver.password, 8);
    return await this.driverRepository.save({
      ...driver,
      password: passwordHash,
      status: EDriverStatus.INACTIVE,
      balance: 0
    });
  }
}
