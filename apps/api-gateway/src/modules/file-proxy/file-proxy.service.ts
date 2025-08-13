import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FileProxyService {
  constructor(@Inject('FILE_SERVICE') private client: ClientProxy) {}

  async getFileById(id: string) {
    const result = await firstValueFrom(
      this.client.send({ cmd: 'get_file_by_id' }, { id })
    );
    console.log('getFileById', result);
    return result;
  }
}
