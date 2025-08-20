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
import { DriverRequestProxyModule } from '@app/proxy/driver-proxy/driver-request-proxy.module';
import { UploadMinIOModule } from '@app/proxy/upload-proxy/upload-minio-proxy.module';
import { CustomeCacheModule } from '@app/common/cache/cache.module';
// controller proxy
import { DriverProxyController } from './modules/driver-proxy/driver-proxy.controller';
import { DriverRequestController } from './modules/driver-proxy/driver-request-proxy.controller';
import { FileProxyController } from './modules/file-proxy/file-proxy.controller';
import { UploadMinioController } from './modules/upload-proxy/upload-minio-proxy.controller';

// service proxy
import { FileProxyService } from '@app/proxy/file-proxy/file-proxy.service';
import { DriverProxyService } from '@app/proxy/driver-proxy/driver-proxy.service';
import { UploadMinioProxyService } from '@app/proxy/upload-proxy/upload-minio-proxy.service';
import { DriverRequestProxyService } from '@app/proxy/driver-proxy/driver-request-proxy.service';

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
    DriverRequestProxyModule,
    FileProxyModule,
    UploadMinIOModule
  ],
  controllers: [
    DriverProxyController,
    DriverRequestController,
    FileProxyController,
    UploadMinioController
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    },
    DriverProxyService,
    DriverRequestProxyService,
    FileProxyService,
    UploadMinioProxyService
  ]
})
export class AppModule {}
