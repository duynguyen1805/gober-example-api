import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from '../../constants';
import { PassportModule } from '@nestjs/passport';
import { CustomeCacheModule } from '../cache/cache.module';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignUpUseCase } from './use-cases/sign-up.use-case';
import { SignInUseCase } from './use-cases/sign-in.use-case';
import { LogOutUseCase } from './use-cases/logout.use-case';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { DriverService } from '../driver/driver.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' }
    }),
    CustomeCacheModule,
    HttpModule,
    TypeOrmModule.forFeature([DriverEntity])
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SignUpUseCase,
    SignInUseCase,
    LogOutUseCase,
    DriverService
  ],
  exports: [AuthService]
})
export class AuthModule {}
