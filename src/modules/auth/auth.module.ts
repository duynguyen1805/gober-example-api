import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from '../../common/constants/constants';
import { PassportModule } from '@nestjs/passport';
import { CustomeCacheModule } from '../cache/cache.module';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignUpUseCase } from './use-cases/sign-up.use-case';
import { SignInUseCase } from './use-cases/sign-in.use-case';
import { LogOutUseCase } from './use-cases/logout.use-case';
import { DriverEntity } from '../../database/entities/driver.entity';
import { DriverService } from '../driver/driver.service';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';
import { UpdateDriverInfomationUseCase } from '../driver/use-case/update-driver-infomation.use-case';
import { FileModule } from '../file/file.module';
import { DriverRefreshTokenEntity } from '../../database/entities/driver-refresh-token.entity';

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
    SignUpUseCase,
    SignInUseCase,
    RefreshTokenUseCase,
    LogOutUseCase,
    UpdateDriverInfomationUseCase,
    DriverService
  ],
  exports: [AuthService]
})
export class AuthModule {}
