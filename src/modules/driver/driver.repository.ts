import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// entity
import { DriverEntity } from '../../database/entities/driver.entity';
// dto
import { SignUpDriverDto } from '../auth/dto/signup-driver.dto';
import { QueryDriverDto } from './dto/query-driver.dto';
// interface
import { PagedDriverResult } from './interfaces/driver.interface';

@Injectable()
export class DriverRepository {
  constructor(
    @InjectRepository(DriverEntity)
    private readonly driverRepository: Repository<DriverEntity>
  ) {}

  /**
   * Tìm kiếm driver có email hoặc phone number trùng với tham số
   * @param string email: Tham số chứa email
   * @param string phoneNumber: Tham số chúa phone number
   * @returns DriverEntity nếu tìm thấy, ngược lại trả về null
   */
  async findDriversByEmailOrPhoneNumber(input: {
    email?: string;
    phoneNumber?: string;
    identifier?: string;
  }): Promise<DriverEntity> {
    const where: Object[] = [];
    if (input?.identifier) {
      where.push({ email: input.identifier });
      where.push({ phoneNumber: input.identifier });
    } else {
      if (input?.email) {
        where.push({ email: input.email });
      }
      if (input?.phoneNumber) {
        where.push({ phoneNumber: input.phoneNumber });
      }
    }
    if (where.length === 0) return null;
    return await this.driverRepository.findOne({ where });
  }

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
  async getListDrivers(
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
   * Lưu thống tin driver vào database
   *
   * @param driver - DriverEntity hoặc SignUpDriverDto cần lưu.
   * @returns DriverEntity: thông tin driver sau khi được lưu
   */

  async saveDriver(
    driver: DriverEntity | SignUpDriverDto
  ): Promise<DriverEntity> {
    return await this.driverRepository.save(driver);
  }
}
