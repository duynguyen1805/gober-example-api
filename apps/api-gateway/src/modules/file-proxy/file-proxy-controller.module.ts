// apps/libs/proxy/src/file-proxy/file-proxy-controller.module.ts
import { Module } from '@nestjs/common';
// module
import { JwtAuthModule } from '@app/common/auth/jwt-auth.module';
import { FileProxyModule } from '@app/proxy/file-proxy/file-proxy.module';
// controller-proxy
import { FileProxyController } from './file-proxy.controller';

@Module({
  imports: [JwtAuthModule, FileProxyModule],
  controllers: [FileProxyController]
})
export class FileProxyControllerModule {}
