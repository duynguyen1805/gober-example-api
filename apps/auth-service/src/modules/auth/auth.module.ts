import { Module } from '@nestjs/common';
// controller
import { AuthController } from './auth.controller';
// service
import { AuthService } from './auth.service';
// proxy
import { DriverProxyModule } from '@app/proxy/driver-proxy/driver-proxy.module';
// use-case
import { SignInUseCase } from './use-cases/sign-in.use-case';
import { SignUpUseCase } from './use-cases/sign-up.use-case';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';
import { LogOutUseCase } from './use-cases/logout.use-case';
import { CustomeCacheModule } from '@app/common/cache/cache.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@app/common/index';

@Module({
  imports: [
    DriverProxyModule,
    CustomeCacheModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' }
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SignInUseCase,
    SignUpUseCase,
    RefreshTokenUseCase,
    LogOutUseCase
  ],
  exports: [AuthService]
})
export class AuthModule {}
