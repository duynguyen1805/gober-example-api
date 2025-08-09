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
import { ScheduleModule } from '@nestjs/schedule';
import settings from '../ormconfig.json';
import { RmqModule } from './modules/rmq/rmq.module';
import { EServiceType } from './common/enums/system/service-type.enum';
import { compact } from 'lodash';
import { BlacklistMiddleware } from './common/middleware/system/blacklist-token.middleware';
import { FileModule } from './modules/file/file.module';
import { UploadMinIOModule } from './modules/upload-minio/upload-minio.module';
import { DriverModule } from './modules/driver/driver.module';

const configRedis = configService.getRedisConfig();

@Module({
  imports: compact([
    ConfigModule.forRoot({ isGlobal: true }),
    configService.getEnv('SERVICE_TYPE') === EServiceType.MAIN_SERVICE
      ? ScheduleModule.forRoot()
      : null,
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
    RmqModule,
    UploadMinIOModule,
    FileModule,
    DriverModule
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
    // .forRoutes('user', 'transactions')
  }
}
