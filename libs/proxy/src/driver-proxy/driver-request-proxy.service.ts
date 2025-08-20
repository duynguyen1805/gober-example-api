import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
// dto
import { QueryDriverRequestDto } from '@app/common/dto/driver-request/query-driver-request.dto';
import { UpdateDriverRequestDto } from '@app/common/dto/driver-request/update-driver-request.dto';
import { CreateDriverRequestDto } from '@app/common/dto/driver-request/create-driver-request.dto';
// interface
import { PagedDriverRequestResult } from '@app/common/interfaces/driver-request.interface';
// schema
import { DriverRequestDocumentWithCustomId } from '@app/database/schemas/driver-request.schema';

@Injectable()
export class DriverRequestProxyService implements OnModuleInit {
  constructor(@Inject('DRIVER_REQUEST_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    // Chờ connect xong trước khi dùng send()
    await this.client.connect();
    Logger.log(
      '[DriverRequestProxyService] Connected to DRIVER_REQUEST_SERVICE queue'
    );
  }

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
    const result = await firstValueFrom(
      this.client.send(
        { cmd: 'createDriverRequestInformation' },
        { driverId, body: input }
      )
    );
    return result;
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
    const result = await firstValueFrom(
      this.client.send({ cmd: 'getListDriverRequest' }, { query })
    );
    return result;
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
    const result = await firstValueFrom(
      this.client.send({ cmd: 'findDriverRequestById' }, driverRequestId)
    );
    return result;
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
    const result = await firstValueFrom(
      this.client.send(
        { cmd: 'updateDriverRequestInformation' },
        { driverId, driverRequestId, input }
      )
    );
    return result;
  }
}
