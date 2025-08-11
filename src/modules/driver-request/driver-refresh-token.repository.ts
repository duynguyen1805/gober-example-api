import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// entity
import { DriverRefreshTokenEntity } from '../../database/entities/driver-refresh-token.entity';

@Injectable()
export class DriverRefreshTokenRepository {
  constructor(
    @InjectRepository(DriverRefreshTokenEntity)
    private readonly driverRefreshTokenRepository: Repository<DriverRefreshTokenEntity>
  ) {}

  /**
   * Tạo mới DriverRefreshTokenEntity
   * @param input Partial<DriverRefreshTokenEntity>
   * @returns DriverRefreshTokenEntity: thông tin bảng driver refresh token
   */
  async createDriverRefreshToken(
    input: Partial<DriverRefreshTokenEntity>
  ): Promise<DriverRefreshTokenEntity> {
    return this.driverRefreshTokenRepository.create(input);
  }

  /**
   * Lưu thông tin driver refresh token
   * @param driverRefreshToken DriverRefreshTokenEntity: thông tin bảng driver refresh token
   * @returns DriverRefreshTokenEntity: thông tin bảng driver refresh token
   */
  async saveDriverRefreshToken(
    driverRefreshToken: DriverRefreshTokenEntity
  ): Promise<DriverRefreshTokenEntity> {
    return await this.driverRefreshTokenRepository.save(driverRefreshToken);
  }

  /**
   * Cập nhật trạng thái của driver refresh token
   * @param criteria Partial<DriverRefreshTokenEntity>: các điều kiện để tìm kiếm
   * @param input Partial<DriverRefreshTokenEntity>: các giá trị cần cập nhật
   * @returns Promise<boolean>: true nếu cập nhật thành công
   */
  async updateDriverRefreshToken(
    criteria: Partial<DriverRefreshTokenEntity>,
    input: Partial<DriverRefreshTokenEntity>
  ): Promise<boolean> {
    const updateResult = await this.driverRefreshTokenRepository.update(
      {
        driverId: criteria?.driverId,
        token: criteria?.token
      },
      {
        isRevoked: input?.isRevoked
      }
    );
    return true && updateResult.affected > 0;
  }
}
