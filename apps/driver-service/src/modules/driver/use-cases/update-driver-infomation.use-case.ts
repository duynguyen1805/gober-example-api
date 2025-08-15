import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { isNil } from 'lodash';
// constants/helpers
import {
  makeSure,
  mustExist,
  isValidEmail,
  isValidPhoneNumber
} from '@app/common/helpers/index';
import { EError } from '@app/common/enums/error.enum';
// dto
import { UpdateDriverDto } from '@app/common/dto/driver/update-driver.dto';
// schema
import { DriverDocumentWithCustomId } from '@app/database/schemas/driver.schema';
// repository
import { DriverModelRepository } from '../driver.model.repository';

@Injectable()
export class UpdateDriverInfomationUseCase {
  private driverExists: DriverDocumentWithCustomId;
  constructor(
    @Inject('FILE_SERVICE') private fileServiceClient: ClientProxy,
    private readonly driverModelRepository: DriverModelRepository
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
    driverId: string,
    input: UpdateDriverDto
  ): Promise<DriverDocumentWithCustomId> {
    await this.validateUpdateDriverInformationDto(driverId, input);
    Object.assign(this.driverExists, input);
    return this.driverModelRepository.saveDriver(this.driverExists);
  }

  /**
   * Validate UpdateDriverDto trước khi request cập nhật thông tin driver
   * @param driverId - id chỉ định driver cần cập nhật thông tin, lấy từ token
   * @param input - UpdateDriverDto object để validate
   * @throws EError nếu có giá trị không hợp lệ
   */
  async validateUpdateDriverInformationDto(
    driverId: string,
    input: UpdateDriverDto
  ): Promise<void> {
    // Kiểm tra driver đã tồn tại
    this.driverExists = await this.driverModelRepository.findDriverById(
      driverId
    );
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
    if (input?.avatarFileId) {
      makeSure(input?.avatarFileId.length > 0, EError.INVALID_AVATAR);
      // Kiểm tra thêm có trong bảng File chưa
      const file = await this.fileServiceClient.send(
        'findFileByIdById',
        input.avatarFileId
      );
      makeSure(!isNil(file), EError.INVALID_AVATAR);
    }
    // Kiểm tra activeAreaId
    if (input?.activeAreaId) {
      makeSure(input?.activeAreaId.length > 0, EError.INVALID_ACTIVE_AREA);
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
