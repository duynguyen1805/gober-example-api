import { Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { hash } from 'bcrypt';
// common/helpers
import { EError } from '../../../common/enums/error.enum';
import { generateRandomCodeNumber } from '../../../common/helpers/auth.helper';
import {
  makeSure,
  serverError
} from '../../../common/helpers/server-error.helper';

import { EDriverStatus } from '../../driver/enums/driver.enum';
import { isValidEmail } from '../../../common/helpers/auth.helper';
import { isValidPhoneNumber } from '../../../common/helpers/auth.helper';
// dto
import { SignUpDriverDto } from '../dto/signup-driver.dto';
// model.repository
import { DriverModelRepository } from '../../../modules/driver/driver.model.repository';
// schema
import { DriverDocument } from '../../../database/mongo-db/driver.schema';

@Injectable()
export class SignUpUseCase {
  constructor(private readonly driverModelRepository: DriverModelRepository) {}

  /**
   * Đăng ký tài khoản cho driver
   *
   * Validates SignUpDriverDto
   * Tạo verification code. Có thể gửi cho người dùng qua email hoặc SMS
   *
   * @param driver - SignUpDriverDto chứa thông tin chi tiết của driver
   * @returns Thông tin driver sau khi đăng ký.
   * @throws EError nếu có lỗi trong quá trình validation và đăng ký.
   */

  async signUpAccount(driver: SignUpDriverDto): Promise<DriverDocument> {
    await this.validateDriverDto(driver);
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
      serverError(EError.SIGN_UP_ERROR, error.statusCode);
    }
  }

  /**
   * Validate SignUpDriverDto trước khi request sign up
   * @throws EError nếu có giá trị không hợp lệ
   * @param driver the SignUpDriverDto object để validate
   */
  async validateDriverDto(driver: SignUpDriverDto): Promise<void> {
    // Kiểm tra email hợp lệ
    makeSure(isValidEmail(driver.email), EError.INVALID_EMAIL);
    // Kiểm tra phone number
    makeSure(
      isValidPhoneNumber(driver.phoneNumber),
      EError.INVALID_PHONE_NUMBER
    );
    // Kiểm tra driver đã tồn tại
    const currentDriver = await this.findDriver(driver);
    makeSure(isNil(currentDriver), EError.DRIVER_EXIST);
    // Kiểm tra password (có thể các rule khác)
    makeSure(driver.password.length >= 6, EError.INVALID_PASSWORD);
    // Kiểm tra avatar (có thể thêm tìm trong bảng Files)
    if (driver?.avatarFileId)
      makeSure(driver.avatarFileId.length > 0, EError.INVALID_AVATAR);
    // Kiểm tra avatar (có thể thêm tìm trong bảng Files)
    if (driver?.identityCardFrontId)
      makeSure(
        driver.identityCardFrontId.length > 0,
        EError.INVALID_IDENTITY_CARD
      );
    // Kiểm tra avatar (có thể thêm tìm trong bảng Files)
    if (driver.identityCardBackId)
      makeSure(
        driver.identityCardBackId.length > 0,
        EError.INVALID_IDENTITY_CARD
      );
  }

  /**
   * Tìm kiếm driver có email hoặc phone number trùng với tham số
   * @param driver Tham số chứa email hoặc phone number
   * @returns DriverDocument nếu tìm thấy, ngược lại trả về null
   */
  async findDriver(driver: SignUpDriverDto): Promise<DriverDocument> {
    return await this.driverModelRepository.findDriversByEmailOrPhoneNumber({
      email: driver.email,
      phoneNumber: driver.phoneNumber
    });
  }

  /**
   * Lưu thông tin đăng ký của driver với status = INACTIVE
   *
   * @param driver - SignUpDriverDto chứa thông tin của driver
   * @returns DriverDocument đã lưu
   */

  async saveDriver(driver: SignUpDriverDto): Promise<DriverDocument> {
    const passwordHash = await hash(driver.password, 8);
    const dataCreateDriver = {
      ...driver,
      password: passwordHash,
      status: EDriverStatus.INACTIVE,
      balance: 0
    };
    return await this.driverModelRepository.saveDriver(dataCreateDriver);
  }
}
