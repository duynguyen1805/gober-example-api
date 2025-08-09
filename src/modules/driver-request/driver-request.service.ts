import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverRequestEntity } from '../../database/entities/driver-request.entity';
import { QueryDriverRequestDto } from './dto/query-driver-request.dto';
import { UpdateDriverRequestDto } from './dto/update-driver-request.dto';
import { PagedDriverRequestResult } from './interfaces/driver-request.interface';
import { UpdateDriverRequestInfomationUseCase } from './use-case/update-driver-request-infomation.use-case';
import { CreateDriverRequestDto } from './dto/create-driver-request.dto';
import { CreateDriverInfomationUseCase } from './use-case/create-driver-request-infomation.use-case';

@Injectable()
export class DriverRequestService {
  constructor(
    @InjectRepository(DriverRequestEntity)
    private driverRequestRepository: Repository<DriverRequestEntity>,
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
    driverId: number,
    input: CreateDriverRequestDto
  ): Promise<DriverRequestEntity> {
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
   * @returns Trả về mảng drivers, tống số drivers của mảng, trang hiện tại, số lượng item trong 1 trang.
   */

  async getListDriverRequest(
    query: QueryDriverRequestDto
  ): Promise<PagedDriverRequestResult<DriverRequestEntity>> {
    const { page = 1, pageSize = 20, keyword, status, typeId } = query;
    const queryDB =
      this.driverRequestRepository.createQueryBuilder('driver_requests');

    if (keyword) {
      queryDB.andWhere(
        '(driver_requests.description ILIKE :kw OR driver_requests.reason ILIKE :kw)',
        { kw: `%${keyword}%` }
      );
    }
    if (status) {
      queryDB.andWhere('driver.status = :status', { status });
    }
    if (typeId) {
      queryDB.andWhere('driver.type_id = :typeId', {
        typeId
      });
    }

    queryDB
      .orderBy('driver_requests.created_at', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [items, total] = await queryDB.getManyAndCount();
    return { items, total, page, pageSize };
  }

  /**
   * Tìm driver request bằng driverId
   * @param driverId - driverId
   * @returns thông tin mảng driver request hoặc null
   */
  async findDriverRequestById(
    driverId: number
  ): Promise<DriverRequestEntity[] | null> {
    return this.driverRequestRepository.find({
      where: { driverId },
      relations: ['files']
    });
  }

  /**
   * Cập nhật thông tin của driver request
   * @param driverId - driverId
   * @param input - thông tin cần cập nhật
   * @returns thông tin driver request sau khi cập nhật
   */
  async updateDriverRequestInformation(
    driverId: number,
    input: UpdateDriverRequestDto
  ): Promise<DriverRequestEntity> {
    return await this.updateDriverUseCase.execute(driverId, input);
  }
}
