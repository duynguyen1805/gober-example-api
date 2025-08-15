import { CacheModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@app/common/constants';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from '@app/common/interceptors/cache.interceptor';
// module
import { AuthModule } from './modules/auth/auth.module';
import { CustomeCacheModule } from '@app/common/cache/cache.module';
// redis config types và store adapter cho cache manager
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { configService } from '@app/common/config';

const configRedis = configService.getRedisConfig();

@Module({
  imports: [
    AuthModule,
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      url:
        configRedis?.redisURL ||
        `redis://${configRedis?.host}:${configRedis?.port}`,
      ttl: 0
    }),
    CustomeCacheModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    }
  ]
})
export class AuthAppModule {}
