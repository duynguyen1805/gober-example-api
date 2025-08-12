import { Injectable } from '@nestjs/common';
// dto
import { QueryDriverRequestDto } from './dto/query-driver-request.dto';
import { UpdateDriverRequestDto } from './dto/update-driver-request.dto';
import { CreateDriverRequestDto } from './dto/create-driver-request.dto';
// interface
import { PagedDriverRequestResult } from './interfaces/driver-request.interface';
// use-case
import { UpdateDriverRequestInfomationUseCase } from './use-case/update-driver-request-infomation.use-case';
import { CreateDriverInfomationUseCase } from './use-case/create-driver-request-infomation.use-case';
// schema
import { DriverRequestDocumentWithCustomId } from 'src/database/mongo-db/driver-request.schema';
// model.repository
import { DriverRequestModelRepository } from './driver-request.model.repository';

@Injectable()
export class DriverRequestService {
  constructor(
    private readonly driverRequestRepository: DriverRequestModelRepository,
    private readonly createDriverUseCase: CreateDriverInfomationUseCase,
    private readonly updateDriverUseCase: UpdateDriverRequestInfomationUseCase
  ) {}

  /**
   * Tạo thông tin driver request
   * @param driverId - driverId
   * @param input - thông tin cần tạo driver request
   * @returns thông tin driver request sau khi tạo thành công
   */
  async createDriverRequestInformation(
    driverId: string,
    input: CreateDriverRequestDto
  ): Promise<DriverRequestDocumentWithCustomId> {
    return await this.createDriverUseCase.execute(driverId, input);
  }

  /**
   * Lấy danh sách driver theo keyword, status, typeId, phân trang
   *
   * @param query - chứa thuộc tính filter và phân trang
   *   - `keyword`: tìm kiếm drivers bằng các field reason, description.
   *   - `status`: tìm kiếm theo trạng thái driver.
   *   - `typeId`: tìm kiếm theo request type id (typeId).
   *   - `page`: Trang số
   *   - `pageSize`: Số lượng item trong 1 trang
   *
   * @returns Trả về mảng drivers request, tống số drivers request của mảng, trang hiện tại, số lượng item trong 1 trang.
   */

  async getListDriverRequest(
    query: Partial<QueryDriverRequestDto>
  ): Promise<PagedDriverRequestResult<DriverRequestDocumentWithCustomId>> {
    return this.driverRequestRepository.getListDriverRequests(query);
  }

  /**
   * Tìm driver request bằng driverRequestId
   * @param driverId - driverId
   * @param driverRequestId - driverRequestId
   * @returns thông tin mảng driver request hoặc null
   */
  async findDriverRequestById(
    driverRequestId: string
  ): Promise<DriverRequestDocumentWithCustomId | null> {
    return this.driverRequestRepository.findDriverRequestById(driverRequestId);
  }

  /**
   * Cập nhật thông tin của driver request, chi áp dụng khi request còn ở trạng thái "pending"
   * @param driverId - driverId
   * @param input - thông tin cần cập nhật
   * @returns thông tin driver request sau khi cập nhật
   */
  async updateDriverRequestInformation(
    driverId: string,
    driverRequestId: string,
    input: UpdateDriverRequestDto
  ): Promise<DriverRequestDocumentWithCustomId> {
    return await this.updateDriverUseCase.execute(
      driverId,
      driverRequestId,
      input
    );
  }
}
