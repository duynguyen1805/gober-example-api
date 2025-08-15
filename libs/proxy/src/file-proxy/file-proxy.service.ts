import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FileProxyService implements OnModuleInit {
  constructor(@Inject('FILE_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    // Chờ connect xong trước khi dùng send()
    await this.client.connect();
    Logger.log('[FileProxyService] Connected to FILE_SERVICE queue');
  }

  async getFileById(id: string) {
    const result = await firstValueFrom(
      this.client.send({ cmd: 'findFileByIdById' }, { id })
    );
    return result;
  }
}
