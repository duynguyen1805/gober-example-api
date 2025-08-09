import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverEntity } from '../../database/entities/driver.entity';
import { QueryDriverDto } from './dto/query-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { PagedDriverResult } from './interfaces/driver.interface';
import { UpdateDriverInfomationUseCase } from './use-case/update-driver-infomation.use-case';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(DriverEntity)
    private readonly driverRepository: Repository<DriverEntity>,
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
    const { page = 1, pageSize = 20, keyword, status, activeAreaId } = query;
    const queryDB = this.driverRepository.createQueryBuilder('driver');

    if (keyword) {
      queryDB.andWhere(
        '(driver.full_name ILIKE :kw OR driver.phone_number ILIKE :kw OR driver.email ILIKE :kw)',
        { kw: `%${keyword}%` }
      );
    }
    if (status) {
      queryDB.andWhere('driver.status = :status', { status });
    }
    if (activeAreaId) {
      queryDB.andWhere('driver.active_area_id = :activeAreaId', {
        activeAreaId
      });
    }

    queryDB
      .orderBy('driver.created_at', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [items, total] = await queryDB.getManyAndCount();
    return { items, total, page, pageSize };
  }

  /**
   * Tìm driver bằng driverId
   * @param driverId - driverId
   * @returns thông tin driver hoặc null
   */
  async findDriverById(driverId: number): Promise<DriverEntity | null> {
    return this.driverRepository.findOne({ where: { driverId } });
  }

  /**
   * Tìm driver bằng driverId và các file liên quan: identityCardFront, identityCardBack, avatarFile
   * @param driverId - driverId
   * @returns thông tin driver và các file hoặc null
   */
  async findDriverByIdWithFiles(
    driverId: number
  ): Promise<DriverEntity | null> {
    return this.driverRepository.findOne({
      where: { driverId },
      relations: ['identityCardFront', 'identityCardBack', 'avatarFile']
    });
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
