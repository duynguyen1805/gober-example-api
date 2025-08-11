import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
// constants/helpers
import { jwtConstants } from '../../common/constants/constants';
// modules
import { CustomeCacheModule } from '../cache/cache.module';
import { FileModule } from '../file/file.module';
// controller
import { AuthController } from './auth.controller';
// service
import { AuthService } from './auth.service';
import { DriverService } from '../driver/driver.service';
// entity
import { DriverEntity } from '../../database/entities/driver.entity';
import { DriverRefreshTokenEntity } from '../../database/entities/driver-refresh-token.entity';
// repository
import { DriverRepository } from '../driver/driver.repository';
import { DriverRefreshTokenRepository } from '../driver-request/driver-refresh-token.repository';
// use-case
import { SignUpUseCase } from './use-cases/sign-up.use-case';
import { SignInUseCase } from './use-cases/sign-in.use-case';
import { LogOutUseCase } from './use-cases/logout.use-case';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';
import { UpdateDriverInfomationUseCase } from '../driver/use-case/update-driver-infomation.use-case';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' }
    }),
    CustomeCacheModule,
    HttpModule,
    TypeOrmModule.forFeature([DriverEntity, DriverRefreshTokenEntity]),
    FileModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    DriverService,

    SignUpUseCase,
    SignInUseCase,
    RefreshTokenUseCase,
    LogOutUseCase,
    UpdateDriverInfomationUseCase,

    DriverRepository,
    DriverRefreshTokenRepository
  ],
  exports: [AuthService]
})
export class AuthModule {}
