import { Injectable } from '@nestjs/common';
import { ERedisKey } from '../../../common/enums/redis.enum';
import { CacheService } from '../../../modules/cache/cache.service';
import { DriverRefreshTokenEntity } from '../../../database/entities/driver-refresh-token.entity';
import { makeSure } from '../../../common/helpers/server-error.helper';
import { EError } from '../../../common/enums/error.enum';
import { DriverRefreshTokenRepository } from '../../../modules/driver-request/driver-refresh-token.repository';

@Injectable()
export class LogOutUseCase {
  constructor(
    private readonly cacheService: CacheService,
    private readonly driverRefreshTokenRepository: DriverRefreshTokenRepository
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
    await this.revokeDriverRefreshToken(driverId, refreshToken);
    return true;
  }

  /**
   * Đánh dấu thu hồi refresh token trong database bảng driver_refresh_token
   *
   * @param {number} driverId - id của driver.
   * @param {string} refreshToken - refresh token của driver.
   * @throws EError nếu cập nhật không thành công
   */

  async revokeDriverRefreshToken(
    driverId: number,
    refreshToken: string
  ): Promise<void> {
    const isUpdateDriverRefreshTokenSuccess =
      await this.driverRefreshTokenRepository.updateDriverRefreshToken(
        {
          driverId,
          token: refreshToken
        },
        {
          isRevoked: true
        }
      );

    makeSure(
      isUpdateDriverRefreshTokenSuccess,
      EError.UPDATE_DRIVER_REFRESH_TOKEN_ERROR
    );
  }
}
