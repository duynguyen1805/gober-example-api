// nestJS core modules
import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  RequestMethod
} from '@nestjs/common';
// mongoose configuration module
import { MongooseModule } from '@nestjs/mongoose';
// redis config types và store adapter cho cache manager
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
// interceptor
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from './common/interceptors/cache.interceptor';
// util
import { compact } from 'lodash';
// auth
import { JwtStrategy } from './modules/auth/jwt.strategy';
// config
import { ConfigModule } from '@nestjs/config';
import { configService } from './config/config.service';
// middleware
import { BlacklistMiddleware } from './common/middleware/blacklist-token.middleware';
// modules
import { CustomeCacheModule } from './modules/cache/cache.module';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/file/file.module';
import { UploadMinIOModule } from './modules/upload-minio/upload-minio.module';
import { DriverModule } from './modules/driver/driver.module';
import { DriverRequestModule } from './modules/driver-request/driver-request.module';
// controller
import { AppController } from './app.controller';
// service
import { AppService } from './app.service';

const configRedis = configService.getRedisConfig();

@Module({
  imports: compact([
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(configService.getMongoConfig().uri),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      url:
        configRedis?.redisURL ||
        `redis://${configRedis?.host}:${configRedis?.port}`,
      ttl: 0
    }),
    AuthModule,
    CustomeCacheModule,
    UploadMinIOModule,
    FileModule,
    DriverModule,
    DriverRequestModule
  ]),
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    }
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BlacklistMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // Áp dụng cho tất cả route
    // Hoặc chỉ áp dụng cho một số route:
    // .forRoutes('driver', 'driver-request');
  }
}
