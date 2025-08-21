// apps/libs/proxy/src/driver-proxy/driver-proxy-controller.module.ts
import { Module } from '@nestjs/common';
// module
import { JwtAuthModule } from '@app/common/auth/jwt-auth.module';
import { DriverProxyModule } from '@app/proxy/driver-proxy/driver-proxy.module';
// controller-proxy
import { DriverProxyController } from './driver-proxy.controller';
import { DriverRequestController } from './driver-request-proxy.controller';

@Module({
  imports: [JwtAuthModule, DriverProxyModule],
  controllers: [DriverProxyController, DriverRequestController]
})
export class DriverProxyControllerModule {}
