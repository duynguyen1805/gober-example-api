import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
// schema
import {
  Driver,
  DriverDocumentWithCustomId
} from '../../database/mongo-db/driver.schema';
// dto
import { SignUpDriverDto } from '../auth/dto/signup-driver.dto';
import { QueryDriverDto } from './dto/query-driver.dto';
// interface
import { PagedDriverResult } from './interfaces/driver.interface';

@Injectable()
export class DriverModelRepository {
  constructor(
    @InjectModel(Driver.name)
    private readonly driverModelRepository: Model<DriverDocumentWithCustomId>
  ) {}

  /**
   * Tìm kiếm driver có email hoặc phone number trùng với tham số
   * @param string email: Tham số chứa email
   * @param string phoneNumber: Tham số chúa phone number
   * @returns DriverDocument nếu tìm thấy, ngược lại trả về null
   */
  async findDriversByEmailOrPhoneNumber(input: {
    email?: string;
    phoneNumber?: string;
    identifier?: string;
  }): Promise<DriverDocumentWithCustomId> {
    const orConditions: Object[] = [];
    if (input?.identifier) {
      orConditions.push({ email: input.identifier });
      orConditions.push({ phoneNumber: input.identifier });
    } else {
      if (input?.email) {
        orConditions.push({ email: input.email });
      }
      if (input?.phoneNumber) {
        orConditions.push({ phoneNumber: input.phoneNumber });
      }
    }
    if (orConditions.length === 0) return null;
    const result = await this.driverModelRepository.findOne({
      $or: orConditions
    });
    return result;
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
  ): Promise<PagedDriverResult<DriverDocumentWithCustomId>> {
    const { page = 1, pageSize = 20, keyword, status, activeAreaId } = query;
    // Tạo điều kiện filter, sử dụng FilterQuery
    const filter: FilterQuery<DriverDocumentWithCustomId> = {};
    if (keyword) {
      filter.$or = [
        { full_name: { $regex: keyword, $options: 'i' } },
        { phone_number: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (status) {
      filter.status = status;
    }
    if (activeAreaId) {
      filter.activeAreaId = activeAreaId;
    }

    const [items, total] = await Promise.all([
      this.driverModelRepository
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.driverModelRepository.countDocuments(filter).exec()
    ]);

    return { items, total, page, pageSize };
  }

  /**
   * Tìm driver bằng driverId
   * @param driverId - driverId
   * @returns thông tin driver hoặc null
   */
  async findDriverById(
    driverId: string
  ): Promise<DriverDocumentWithCustomId | null> {
    return this.driverModelRepository
      .findById(driverId)
      .select('-password')
      .populate('identityCardFrontId') // truy vấn ref
      .populate('identityCardBackId')
      .populate('avatarFileId')
      .exec();
  }

  /**
   * Tìm driver bằng driverId và các file liên quan: identityCardFront, identityCardBack, avatarFile
   * @param driverId - driverId
   * @returns thông tin driver và các file hoặc null
   */
  async findDriverByIdWithFiles(
    driverId: string
  ): Promise<DriverDocumentWithCustomId | null> {
    return this.driverModelRepository
      .findOne({ driverId })
      .populate('identityCardFrontId') // truy vấn ref
      .populate('identityCardBackId')
      .populate('avatarFileId')
      .exec();
  }

  /**
   * Lưu thông tin driver vào database
   *
   * @param driver - DriverDocument hoặc SignUpDriverDto cần lưu.
   * @returns driverDocument: thông tin driver sau khi được lưu
   */

  async saveDriver(
    driver: DriverDocumentWithCustomId | SignUpDriverDto
  ): Promise<DriverDocumentWithCustomId> {
    const driverDocument = new this.driverModelRepository(driver);
    return await driverDocument.save();
  }
}
