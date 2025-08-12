import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
// module.repository
import {
  DriverRequest,
  DriverRequestDocumentWithCustomId
} from '../../database/mongo-db/driver-request.schema';
// dto
import { QueryDriverRequestDto } from './dto/query-driver-request.dto';
import { PagedDriverResult } from '../driver/interfaces/driver.interface';

@Injectable()
export class DriverRequestModelRepository {
  constructor(
    @InjectModel(DriverRequest.name)
    private readonly driveRequestModelRepository: Model<DriverRequestDocumentWithCustomId>
  ) {}

  /**
   * Tìm driver request bằng driverRequestId
   * @param driverRequestId - driverRequestId
   * @returns thông tin mảng driver request hoặc null
   */
  async findDriverRequestById(
    driverRequestId: string
  ): Promise<DriverRequestDocumentWithCustomId | null> {
    return await this.driveRequestModelRepository
      .findById(driverRequestId)
      .populate('fileIds')
      .exec();
  }

  /**
   * Tìm kiếm driver request bằng filter
   * @param filter FilterQuery<DriverRequestDocumentWithCustomId>
   * @returns DriverRequestDocumentWithCustomId | null: thông tin driver request nếu tìm thấy, ngược lại trả về null
   */
  async findDriverRequestByFilter(
    filter:
      | FilterQuery<QueryDriverRequestDto>
      | FilterQuery<DriverRequestDocumentWithCustomId>
  ): Promise<DriverRequestDocumentWithCustomId | null> {
    const fixedFilter = { ...filter };
    // query Driver schema nên chuyển đổi driverRequestId -> _id
    if (
      fixedFilter.driverRequestId &&
      Types.ObjectId.isValid(fixedFilter.driverRequestId)
    ) {
      fixedFilter._id = new Types.ObjectId(fixedFilter.driverRequestId);
      delete fixedFilter.driverRequestId; // vì đây là virtual
    }
    return this.driveRequestModelRepository.findOne(fixedFilter).exec();
  }

  /**
   * Lấy danh sách driver request theo keyword, status, activeAreaId, phân trang
   *
   * @param query - chứa thuộc tính filter và phân trang
   *   - `keyword`: tìm kiếm drivers bằng các field description, reason.
   *   - `status`: tìm kiếm theo trạng thái driver.
   *   - `typeId`: tìm kiếm theo typeId.
   *   - `page`: Trang số
   *   - `pageSize`: Số lượng item trong 1 trang
   *
   * @returns Trả về mảng drivers request, tống số drivers request của mảng, trang hiện tại, số lượng item trong 1 trang.
   */
  async getListDriverRequests(
    query: Partial<QueryDriverRequestDto>
  ): Promise<PagedDriverResult<DriverRequestDocumentWithCustomId>> {
    const { page = 1, pageSize = 20, keyword, status, typeId } = query;
    // Tạo điều kiện filter, sử dụng FilterQuery
    const filter: FilterQuery<DriverRequestDocumentWithCustomId> = {};
    if (keyword) {
      filter.$or = [
        { description: { $regex: keyword, $options: 'i' } },
        { reason: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (status) {
      filter.status = status;
    }
    if (typeId) {
      filter.typeId = typeId;
    }

    const [items, total] = await Promise.all([
      this.driveRequestModelRepository
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.driveRequestModelRepository.countDocuments(filter).exec()
    ]);

    return { items, total, page, pageSize };
  }

  /**
   * Tạo mới DriverRequestDocument
   * @param input Partial<DriverRequestDocumentWithCustomId>
   * @returns DriverRequestDocumentWithCustomId: thông tin bảng driver request
   */
  async createDriverRequest(
    input: Partial<DriverRequestDocumentWithCustomId>
  ): Promise<DriverRequestDocumentWithCustomId> {
    return new this.driveRequestModelRepository(input);
  }

  /**
   * Lưu thông tin driver request
   * @param driverRequest DriverRequestDocumentWithCustomId: thông tin bảng driver request
   * @returns DriverRefreshTokenDocumentWithCustomId: thông tin bảng driver request
   */
  async saveDriverRequest(
    driverRequest: DriverRequestDocumentWithCustomId
  ): Promise<DriverRequestDocumentWithCustomId> {
    return await driverRequest.save();
  }
}
