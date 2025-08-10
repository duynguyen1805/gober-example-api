import { Injectable } from '@nestjs/common';
import { ERedisKey } from '../../../common/enums/system/redis.enum';
import { CacheService } from '../../../modules/cache/cache.service';
import { DriverRefreshTokenEntity } from '../../../database/entities/driver-refresh-token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { makeSure } from '../../../common/helpers/system/server-error.helper';
import { EError } from '../../../common/enums/error.enum';

@Injectable()
export class LogOutUseCase {
  constructor(
    private readonly cacheService: CacheService,
    @InjectRepository(DriverRefreshTokenEntity)
    private driverRefreshTokenRepository: Repository<DriverRefreshTokenEntity>
  ) {}

  /**
   * Thêm access token và refresh token vào blacklist trong cache redis
   *
   * @param {string} token - access token.
   * @param {string} refreshToken - refresh token.
   * @returns {Promise<boolean>} - trả về true nếu thêm thành công.
   */

  async addTokenToBlackList(
    driverId: number,
    token: string,
    refreshToken: string
  ): Promise<boolean> {
    const blackListToken = `${ERedisKey.BLACKLIST_TOKEN_PREFIX}${token}`;
    const blackListRefreshToken = `${ERedisKey.BLACKLIST_TOKEN_PREFIX}${refreshToken}`;
    await Promise.all([
      this.cacheService.set(blackListToken, true),
      this.cacheService.set(blackListRefreshToken, true)
    ]);
    await this.updateDriverRefreshToken(driverId, refreshToken);
    return true;
  }

  /**
   * Đánh dấu thu hồi refresh token trong database bảng driver_refresh_token
   *
   * @param {number} driverId - id của driver.
   * @param {string} refreshToken - refresh token của driver.
   * @throws EError nếu cập nhật không thành công
   */

  async updateDriverRefreshToken(
    driverId: number,
    refreshToken: string
  ): Promise<void> {
    const entityDriverRefreshToken =
      await this.driverRefreshTokenRepository.update(
        {
          driverId,
          token: refreshToken
        },
        {
          isRevoked: true
        }
      );

    makeSure(
      entityDriverRefreshToken.affected > 0,
      EError.UPDATE_DRIVER_REFRESH_TOKEN_ERROR
    );
  }
}
