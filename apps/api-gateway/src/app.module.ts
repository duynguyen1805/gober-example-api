// app/api-gateway/src/app.module.ts
import { Module } from '@nestjs/common';
import { AuthProxyModule } from './modules/auth-proxy/auth-proxy.module';
import { FileProxyModule } from './modules/file-proxy/file-proxy.module';

@Module({
  imports: [AuthProxyModule, FileProxyModule]
})
export class AppModule {}
