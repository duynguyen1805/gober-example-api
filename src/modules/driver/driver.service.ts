import { Injectable } from '@nestjs/common';
// dto
import { QueryDriverDto } from './dto/query-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
// interface
import { PagedDriverResult } from './interfaces/driver.interface';
// schema
import {
  DriverDocument,
  DriverDocumentWithCustomId
} from '../../database/mongo-db/driver.schema';
// use-case
import { UpdateDriverInfomationUseCase } from './use-case/update-driver-infomation.use-case';
import { DriverModelRepository } from './driver.model.repository';

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
}
