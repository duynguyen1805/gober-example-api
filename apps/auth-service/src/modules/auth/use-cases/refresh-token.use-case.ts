import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// helpers
import { makeSure, mustExist } from '@app/common/helpers/server-error.helper';
import { EError, ERedisKey } from '@app/common/enums/index';
import { jwtConstants } from '@app/common/constants';
// interfaces
import { IRefreshTokenResponse } from '@app/common/interfaces/auth.interface';
// service
import { CacheService } from '@app/common/cache/cache.service';
// proxy
import { DriverProxyService } from '@app/proxy/driver-proxy/driver-proxy.service';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly cacheService: CacheService,
    private jwtService: JwtService,
    private driverProxyService: DriverProxyService
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
      await this.revokeDriverRefreshToken(payload.driverId, oldRefreshToken);
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

  async revokeDriverRefreshToken(
    driverId: string,
    refreshToken: string
  ): Promise<void> {
    const isUpdateDriverRefreshTokenSuccess =
      await this.driverProxyService.updateDriverRefreshToken(
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
