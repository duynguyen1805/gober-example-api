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
// module
import { AuthProxyModule } from './modules/auth-proxy/auth-proxy.module';
import { FileProxyModule } from '../../../libs/proxy/src/file-proxy/file-proxy.module';
import { DriverProxyModule } from '@app/proxy/driver-proxy/driver-proxy.module';
import { CustomeCacheModule } from '@app/common/cache/cache.module';
// controller proxy
import { DriverProxyController } from './modules/driver-proxy/driver-proxy.controller';
import { FileProxyController } from './modules/file-proxy/file-proxy.controller';
// service proxy
import { FileProxyService } from '@app/proxy/file-proxy/file-proxy.service';
import { DriverProxyService } from '@app/proxy/driver-proxy/driver-proxy.service';

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
    CustomeCacheModule,
    AuthProxyModule,
    DriverProxyModule,
    FileProxyModule
  ],
  controllers: [DriverProxyController, FileProxyController],
  providers: [
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    },
    DriverProxyService,
    FileProxyService
  ]
})
export class AppModule {}
