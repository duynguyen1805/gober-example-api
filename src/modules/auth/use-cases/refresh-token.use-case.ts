import { Injectable } from '@nestjs/common';
import {
  makeSure,
  mustExist
} from '../../../common/helpers/server-error.helper';
import { EError, EErrorDetail } from '../../../common/enums/auth/auth.enum';
import { IRefreshTokenResponse } from '../interface/auth-driver.interface';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '../../../modules/cache/cache.service';
import { ERedisKey } from '../../../common/enums/system/redis.enum';
import { jwtConstants } from '../../../constants';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly cacheService: CacheService,
    private jwtService: JwtService
  ) {}

  async getRefreshToken(
    oldRefreshToken: string
  ): Promise<IRefreshTokenResponse> {
    const payloadEncoded = await this.validateOldRefreshToken(oldRefreshToken);
    const token = this.jwtService.sign({ data: payloadEncoded.payload });
    const refreshToken = this.jwtService.sign(
      { data: payloadEncoded.payload },
      { expiresIn: jwtConstants.expiresIn }
    );
    return {
      token,
      refreshToken
    };
  }

  async validateOldRefreshToken(oldRefreshToken: string) {
    // Decoded token lấy payload
    let payload: any;
    try {
      const decoded = this.jwtService.verify(oldRefreshToken);
      payload = decoded?.data;
      mustExist(
        payload,
        EError.INVALID_REFRESH_TOKEN,
        EErrorDetail.INVALID_REFRESH_TOKEN
      );
    } catch (error) {
      makeSure(
        false,
        EError.INVALID_REFRESH_TOKEN,
        EErrorDetail.INVALID_REFRESH_TOKEN
      );
    }

    // Kiểm tra blacklist hoặc revoked token ở đây nếu cần
    const isBlacklisted = await this.cacheService.get(
      `${ERedisKey.BLACKLIST_TOKEN_PREFIX}${oldRefreshToken}`
    );
    if (isBlacklisted) {
      makeSure(
        false,
        EError.INVALID_REFRESH_TOKEN,
        EErrorDetail.INVALID_REFRESH_TOKEN,
        401
      );
    }

    return payload;
  }
}
