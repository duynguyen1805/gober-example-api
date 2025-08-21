// app/api-gateway/src/app.module.ts
import { CacheModule, Module } from '@nestjs/common';
// config
import { ConfigModule } from '@nestjs/config';
import { jwtConstants } from '@app/common/index';
// redis config types và store adapter cho cache manager
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { configService } from '@app/common/config';
// interceptor
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from '@app/common/interceptors/cache.interceptor';
// module
import { AuthProxyModule } from './modules/auth-proxy/auth-proxy.module';
import { FileProxyControllerModule } from './modules/file-proxy/file-proxy-controller.module';
import { DriverProxyControllerModule } from './modules/driver-proxy/driver-proxy-controller.module';
import { UploadMinioProxyControllerModule } from './modules/upload-proxy/upload-minio-proxy-controller.module';
import { CustomeCacheModule } from '@app/common/cache/cache.module';

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
    DriverProxyControllerModule,
    FileProxyControllerModule,
    UploadMinioProxyControllerModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    }
  ]
})
export class AppModule {}
