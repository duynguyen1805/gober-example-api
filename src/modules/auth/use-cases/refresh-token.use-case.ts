import { Injectable } from '@nestjs/common';
import {
  makeSure,
  mustExist
} from '../../../common/helpers/server-error.helper';
import { EError } from '../../../common/enums/error.enum';
import { IRefreshTokenResponse } from '../interface/auth-driver.interface';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '../../../modules/cache/cache.service';
import { ERedisKey } from '../../../common/enums/redis.enum';
import { jwtConstants } from '../../../common/constants/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverRefreshTokenEntity } from '../../../database/entities/driver-refresh-token.entity';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly cacheService: CacheService,
    private jwtService: JwtService,
    @InjectRepository(DriverRefreshTokenEntity)
    private driverRefreshTokenRepository: Repository<DriverRefreshTokenEntity>
  ) {}

  /**
   * Kiểm tra, thu hồi refresh token cũ, tạo cặp access token, refresh token mới
   * @param oldRefreshToken refresh token cũ
   * @returns object chưa cặp access token, refresh token
   * @throws EError nếu token invalid hoặc đã bị thu hồi
   */
  async getRefreshToken(
    oldRefreshToken: string
  ): Promise<IRefreshTokenResponse> {
    const payloadEncoded = await this.validateOldRefreshToken(oldRefreshToken);
    const token = this.jwtService.sign(
      { data: payloadEncoded.payload },
      {
        expiresIn: jwtConstants.expiresInAccessToken
      }
    );
    const refreshToken = this.jwtService.sign(
      { data: payloadEncoded.payload },
      { expiresIn: jwtConstants.expiresInRefreshToken }
    );
    return {
      token,
      refreshToken
    };
  }

  /**
   * Validate old refresh token và kiểm tra đã bị thêm vào blacklist hay không.
   * Nếu hợp lệ, thực hiện thu hồi và cấu lại cập access token, refresh token mới.
   * @param oldRefreshToken refresh token cũ
   * @returns  payload sau khi decoded token
   * @throws EError nếu token invalid hoặc đã bị thu hồi
   */
  async validateOldRefreshToken(oldRefreshToken: string) {
    // Decoded token lấy giá trị payload
    let payload: any;
    try {
      const decoded = this.jwtService.verify(oldRefreshToken);
      payload = decoded?.data;
      mustExist(payload, EError.INVALID_REFRESH_TOKEN);
    } catch (error) {
      makeSure(false, EError.INVALID_REFRESH_TOKEN);
    }

    // Kiểm tra blacklist hoặc revoked token ở đây nếu cần
    const isBlacklisted = await this.cacheService.get(
      `${ERedisKey.BLACKLIST_TOKEN_PREFIX}${oldRefreshToken}`
    );
    if (isBlacklisted) {
      makeSure(false, EError.INVALID_REFRESH_TOKEN, null, 401);
    } else {
      // Thu hồi refresh token
      await this.cacheService.set(
        `${ERedisKey.BLACKLIST_TOKEN_PREFIX}${oldRefreshToken}`,
        true
      );
      await this.updateDriverRefreshToken(payload.driverId, oldRefreshToken);
    }

    return payload;
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
