// app/api-gateway/src/app.module.ts
import { CacheModule, Module } from '@nestjs/common';
// config
import { ConfigModule } from '@nestjs/config';
// redis config types và store adapter cho cache manager
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { configService } from '@app/common/config';
// auth
import { JwtStrategy } from './modules/auth-proxy/jwt.strategy';
// interceptor
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from '@app/common/interceptors/cache.interceptor';

import { AuthProxyModule } from './modules/auth-proxy/auth-proxy.module';
import { FileProxyModule } from './modules/file-proxy/file-proxy.module';
import { DriverProxyModule } from '@app/proxy/driver-proxy/driver-proxy.module';

const configRedis = configService.getRedisConfig();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      url:
        configRedis?.redisURL ||
        `redis://${configRedis?.host}:${configRedis?.port}`,
      ttl: 0
    }),
    AuthProxyModule,
    DriverProxyModule,
    FileProxyModule
  ],
  controllers: [],
  providers: [
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    }
  ]
})
export class AppModule {}
