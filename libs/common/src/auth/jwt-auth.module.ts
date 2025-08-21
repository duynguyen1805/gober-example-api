import { Module } from '@nestjs/common';
// auth
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@app/common/guards/jwt.strategy';
// constants
import { jwtConstants } from '@app/common/constants';
// module
import { CustomeCacheModule } from '../cache/cache.module';
import { DriverProxyModule } from '@app/proxy/driver-proxy/driver-proxy.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' }
    }),
    CustomeCacheModule,
    DriverProxyModule
  ],
  providers: [JwtStrategy],
  exports: [PassportModule, JwtModule, JwtStrategy]
})
export class JwtAuthModule {}
