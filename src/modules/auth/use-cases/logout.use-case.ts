import { Injectable } from '@nestjs/common';
import { ERedisKey } from '../../../common/enums/system/redis.enum';
import { CacheService } from '../../../modules/cache/cache.service';

@Injectable()
export class LogOutUseCase {
  constructor(private readonly cacheService: CacheService) {}

  async addTokenToBlackList(
    token: string,
    refreshToken: string
  ): Promise<boolean> {
    const blackListToken = `${ERedisKey.BLACKLIST_TOKEN_PREFIX}${token}`;
    const blackListRefreshToken = `${ERedisKey.BLACKLIST_TOKEN_PREFIX}${refreshToken}`;
    await Promise.all([
      this.cacheService.set(blackListToken, true),
      this.cacheService.set(blackListRefreshToken, true)
    ]);
    return true;
  }
}
