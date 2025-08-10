import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  makeSure,
  mustExist
} from '../../../common/helpers/server-error.helper';
import { DriverEntity } from '../../../database/entities/driver.entity';
import { EError } from '../../../common/enums/error.enum';
import { isValidEmail } from '../../../common/helpers/auth.helper';
import { isValidPhoneNumber } from '../../../common/helpers/auth.helper';
import { UpdateDriverDto } from '../dto/update-driver.dto';
import { FileService } from '../../../modules/file/file.service';
import { isNil } from 'lodash';

@Injectable()
export class UpdateDriverInfomationUseCase {
  private driverExists: DriverEntity;
  constructor(
    @InjectRepository(DriverEntity)
    private driverRepository: Repository<DriverEntity>,
    private readonly fileService: FileService
  ) {}

  /**
   * Thực hiện cập nhật thông tin driver
   *
   * @param driverId - id chỉ định driver cần cập nhật thông tin, lấy từ token
   * @param input - Thông tin cần cập nhật
   * @returns Thông tin driver sau khi cập nhật
   * @throws EError trả lỗi nếu validate thất bại hoặc cập nhật không thành công
   */

  async execute(
    driverId: number,
    input: UpdateDriverDto
  ): Promise<DriverEntity> {
    await this.validateUpdateDriverInformationDto(driverId, input);
    Object.assign(this.driverExists, input);
    return this.driverRepository.save(this.driverExists);
  }

  /**
   * Validate UpdateDriverDto trước khi request cập nhật thông tin driver
   * @param driverId - id chỉ định driver cần cập nhật thông tin, lấy từ token
   * @param input - UpdateDriverDto object để validate
   * @throws EError nếu có giá trị không hợp lệ
   */
  async validateUpdateDriverInformationDto(
    driverId: number,
    input: UpdateDriverDto
  ): Promise<void> {
    // Kiểm tra driver đã tồn tại
    this.driverExists = await this.driverRepository.findOne({
      where: { driverId }
    });
    mustExist(this.driverExists, EError.DRIVER_NOT_FOUND);

    // Kiểm tra các trường có thông tin trong input
    // Kiểm tra fullName
    if (input?.fullName) {
      makeSure(input.fullName.length > 0, EError.INVALID_FULL_NAME);
    }
    // Kiểm tra email
    if (input?.email) {
      makeSure(isValidEmail(input.email), EError.INVALID_EMAIL);
    }
    // Kiểm tra phone number
    if (input?.phoneNumber) {
      makeSure(
        isValidPhoneNumber(input.phoneNumber),
        EError.INVALID_PHONE_NUMBER
      );
    }
    // Kiểm tra avatar
    if (input?.avatar) {
      makeSure(!isNaN(Number(input?.avatar)), EError.INVALID_AVATAR);
      // Kiểm tra thêm có trong bảng File chưa
      const file = await this.fileService.findFileById(+input?.avatar);
      makeSure(!isNil(file), EError.INVALID_AVATAR);
    }
    // Kiểm tra activeAreaId
    if (input?.activeAreaId) {
      makeSure(!isNaN(Number(input?.activeAreaId)), EError.INVALID_ACTIVE_AREA);
      // Kiểm tra thêm có trong bảng Province chưa (CHƯA THỰC HIỆN)
    }
    // Kiểm tra temporaryAddress
    if (input?.temporaryAddress) {
      makeSure(
        input.temporaryAddress.length > 0,
        EError.INVALID_TEMPORARY_ADDRESS
      );
      // Kiểm tra thêm thông tin địa chỉ chính xác (CHƯA THỰC HIỆN)
    }
  }
}
