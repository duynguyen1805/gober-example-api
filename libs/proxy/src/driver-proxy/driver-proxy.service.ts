import { SignUpDriverDto } from '@app/common/dto/auth/signup-driver.dto';
import { UpdateDriverDto } from '@app/common/dto/driver/update-driver.dto';
import { DriverRefreshTokenDocumentWithCustomId } from '@app/database/schemas/driver-refresh-token.schema';
import { DriverDocumentWithCustomId } from '@app/database/schemas/driver.schema';
import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DriverProxyService implements OnModuleInit {
  constructor(@Inject('DRIVER_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    // Chờ connect xong trước khi dùng send()
    await this.client.connect();
    Logger.log('[DriverProxyService] Connected to DRIVER_SERVICE queue');
  }

  async findDriverById(id: string) {
    const result = await firstValueFrom(
      this.client.send({ cmd: 'findDriverById' }, id)
    );
    return result;
  }

  async findDriversByEmailOrPhoneNumber(input: {
    email?: string;
    phoneNumber?: string;
    identifier?: string;
  }) {
    const result = await firstValueFrom(
      this.client.send({ cmd: 'findDriversByEmailOrPhoneNumber' }, input)
    );
    return result;
  }

  async createDriver(body: DriverDocumentWithCustomId | SignUpDriverDto) {
    const result = await firstValueFrom(
      this.client.send({ cmd: 'createDriver' }, { body })
    );
    return result;
  }

  async updateDriverInformation(id: string, body: UpdateDriverDto) {
    const result = await firstValueFrom(
      this.client.send({ cmd: 'updateDriverInformation' }, { id, body })
    );
    return result;
  }

  async createDriverRefreshToken(
    input: Partial<DriverRefreshTokenDocumentWithCustomId>
  ) {
    const result = await firstValueFrom(
      this.client.send({ cmd: 'createDriverRefreshToken' }, { input })
    );
    return result;
  }

  async saveDriverRefreshToken(input: DriverRefreshTokenDocumentWithCustomId) {
    const result = await firstValueFrom(
      this.client.send({ cmd: 'saveDriverRefreshToken' }, { input })
    );
    return result;
  }

  /**
   * Cập nhật trạng thái của driver refresh token
   * @param criteria Partial<DriverRefreshTokenDocumentWithCustomId>: các điều kiện để tìm kiếm
   * @param input Partial<DriverRefreshTokenDocumentWithCustomId>: các giá trị cần cập nhật
   * @returns Promise<boolean>: true nếu cập nhật thành công
   */
  async updateDriverRefreshToken(
    criteria: Partial<DriverRefreshTokenDocumentWithCustomId>,
    dataUpdate: Partial<DriverRefreshTokenDocumentWithCustomId>
  ): Promise<boolean> {
    const result = await firstValueFrom(
      this.client.send(
        { cmd: 'updateDriverRefreshToken' },
        { criteria, dataUpdate }
      )
    );
    return (
      result &&
      result.matchedCount > 0 &&
      result.modifiedCount > 0 &&
      result.modifiedCount === result.matchedCount
    );
  }
}
