import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
// mongoose
import { MongooseModule } from '@nestjs/mongoose';
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
// import { DriverEntity } from '../../database/entities/driver.entity';
// import { DriverRefreshTokenEntity } from '../../database/entities/driver-refresh-token.entity';
// schema
import { Driver, DriverSchema } from '../../database/mongo-db/driver.schema';
import {
  DriverRefreshToken,
  DriverRefreshTokenSchema
} from '../../database/mongo-db/driver-refresh-token.schema';
// model.repository
import { DriverModelRepository } from '../driver/driver.model.repository';
import { DriverRefreshTokenModelRepository } from '../driver-request/driver-refresh-token.model.repository';
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
    MongooseModule.forFeature([
      { name: Driver.name, schema: DriverSchema },
      { name: DriverRefreshToken.name, schema: DriverRefreshTokenSchema }
    ]),
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

    DriverModelRepository,
    DriverRefreshTokenModelRepository
  ],
  exports: [AuthService]
})
export class AuthModule {}
