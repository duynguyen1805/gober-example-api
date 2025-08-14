import { Injectable } from '@nestjs/common';
// dto
import { QueryDriverDto } from '@app/common/dto/driver/query-driver.dto';
import { UpdateDriverDto } from '@app/common/dto/driver/update-driver.dto';
// interface
import { PagedDriverResult } from '@app/common/interfaces/driver.interface';
// schema
import {
  DriverDocument,
  DriverDocumentWithCustomId
} from '@app/database/schemas/driver.schema';
// use-case
import { UpdateDriverInfomationUseCase } from './use-cases/update-driver-infomation.use-case';
import { DriverModelRepository } from './driver.model.repository';
import { DriverRefreshTokenDocumentWithCustomId } from '@app/database/schemas/driver-refresh-token.schema';

@Injectable()
export class DriverService {
  constructor(
    private readonly driverModelRepository: DriverModelRepository,
    private readonly updateDriverUseCase: UpdateDriverInfomationUseCase
  ) {}

  /**
   * Lấy danh sách driver theo keyword, status, activeAreaId, phân trang
   *
   * @param query - chứa thuộc tính filter và phân trang
   *   - `keyword`: tìm kiếm drivers bằng các field full name, phone number, email.
   *   - `status`: tìm kiếm theo trạng thái driver.
   *   - `activeAreaId`: tìm kiếm theo activeAreaId.
   *   - `page`: Trang số
   *   - `pageSize`: Số lượng item trong 1 trang
   *
   * @returns Trả về mảng drivers, tống số drivers của mảng, trang hiện tại, số lượng item trong 1 trang.
   */
  async getListDriver(
    query: QueryDriverDto
  ): Promise<PagedDriverResult<DriverDocument>> {
    // Cần thêm validate query
    return await this.driverModelRepository.getListDrivers(query);
  }

  /**
   * Tìm driver bằng driverId
   * @param driverId - driverId
   * @returns thông tin driver hoặc null
   */
  async findDriverById(driverId: string): Promise<DriverDocument | null> {
    return this.driverModelRepository.findDriverById(driverId);
  }

  /**
   * Tìm driver bằng driverId và các file liên quan: identityCardFront, identityCardBack, avatarFile
   * @param driverId - driverId
   * @returns thông tin driver và các file hoặc null
   */
  async findDriverByIdWithFiles(
    driverId: string
  ): Promise<DriverDocument | null> {
    return this.driverModelRepository.findDriverByIdWithFiles(driverId);
  }

  /**
   * Cập nhật thông tin của driver
   * @param driverId - driverId
   * @param input - thông tin cần cập nhật
   * @returns thông tin driver sau khi cập nhật
   */
  async updateDriverInformation(
    driverId: string,
    input: UpdateDriverDto
  ): Promise<DriverDocument> {
    return await this.updateDriverUseCase.execute(driverId, input);
  }

  async findDriversByEmailOrPhoneNumber(input: {
    email?: string;
    phoneNumber?: string;
    identifier?: string;
  }): Promise<DriverDocumentWithCustomId> {
    return await this.driverModelRepository.findDriversByEmailOrPhoneNumber(
      input
    );
  }

  /**
   * Cập nhật trạng thái của driver refresh token
   * @param criteria Partial<DriverRefreshTokenDocumentWithCustomId>: các điều kiện để tìm kiếm
   * @param input Partial<DriverRefreshTokenDocumentWithCustomId>: các giá trị cần cập nhật
   * @returns Promise<boolean>: true nếu cập nhật thành công
   */
  async updateDriverRefreshToken(input: {
    criteria: Partial<DriverRefreshTokenDocumentWithCustomId>;
    dataUpdate: Partial<DriverRefreshTokenDocumentWithCustomId>;
  }): Promise<boolean> {
    return await this.driverModelRepository.updateDriverRefreshToken(input);
  }
}
