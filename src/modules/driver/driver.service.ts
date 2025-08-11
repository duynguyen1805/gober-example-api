import { Injectable } from '@nestjs/common';
// dto
import { QueryDriverDto } from './dto/query-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
// interface
import { PagedDriverResult } from './interfaces/driver.interface';
// entity
import { DriverEntity } from '../../database/entities/driver.entity';
// use-case
import { UpdateDriverInfomationUseCase } from './use-case/update-driver-infomation.use-case';
import { DriverRepository } from './driver.repository';

@Injectable()
export class DriverService {
  constructor(
    private readonly driverRepository: DriverRepository,
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
  ): Promise<PagedDriverResult<DriverEntity>> {
    // Cần thêm validate query
    return await this.driverRepository.getListDrivers(query);
  }

  /**
   * Tìm driver bằng driverId
   * @param driverId - driverId
   * @returns thông tin driver hoặc null
   */
  async findDriverById(driverId: number): Promise<DriverEntity | null> {
    return this.driverRepository.findDriverById(driverId);
  }

  /**
   * Tìm driver bằng driverId và các file liên quan: identityCardFront, identityCardBack, avatarFile
   * @param driverId - driverId
   * @returns thông tin driver và các file hoặc null
   */
  async findDriverByIdWithFiles(
    driverId: number
  ): Promise<DriverEntity | null> {
    return this.driverRepository.findDriverByIdWithFiles(driverId);
  }

  /**
   * Cập nhật thông tin của driver
   * @param driverId - driverId
   * @param input - thông tin cần cập nhật
   * @returns thông tin driver sau khi cập nhật
   */
  async updateDriverInformation(
    driverId: number,
    input: UpdateDriverDto
  ): Promise<DriverEntity> {
    return await this.updateDriverUseCase.execute(driverId, input);
  }
}
