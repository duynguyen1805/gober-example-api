import { Module } from '@nestjs/common';
// controller
import { AuthController } from './auth.controller';
// service
import { AuthService } from './auth.service';
// proxy
import { DriverProxyModule } from '@app/proxy/driver-proxy/driver-proxy.module';

@Module({
  imports: [DriverProxyModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
