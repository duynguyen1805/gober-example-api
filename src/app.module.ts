import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  RequestMethod
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { configService } from './config/config.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from './common/interceptors/cache.interceptor';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';
import { CustomeCacheModule } from './modules/cache/cache.module';
import { ConfigModule } from '@nestjs/config';
import settings from '../ormconfig.json';
import { compact } from 'lodash';
import { BlacklistMiddleware } from './common/middleware/blacklist-token.middleware';
import { FileModule } from './modules/file/file.module';
import { UploadMinIOModule } from './modules/upload-minio/upload-minio.module';
import { DriverModule } from './modules/driver/driver.module';
import { DriverRequestModule } from './modules/driver-request/driver-request.module';

const configRedis = configService.getRedisConfig();

@Module({
  imports: compact([
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files')
    }),
    TypeOrmModule.forRoot(settings),
    MulterModule.register({
      dest: '../files'
    }),
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
